// @flow
import type { DateTime } from 'utils/datetime'

import esb from 'elastic-builder'
import get from 'lodash/get'
import { operators } from 'utils'
import { esClient } from 'utils/esclient'
import { getInterval } from 'utils/datetime'

export async function getQueryResult ({
  payload = [],
  from,
  size,
  queryConfig = [],
  // 这里的index是数据源_id
  index,
  dataSource,
  filters = {},
}) { // eslint-disable-line
  let conditions = {}

  if (payload && payload.length > 0) {
    conditions = payload.reduce((indices, cond) => {
      // cond.field[0].value is index and cond.field[1].value is field
      if (!(Array.isArray(cond.field) && cond.field.length >= 2)) {
        return indices
      }
      const index = cond.field[0].value
      const field = cond.field[1]

      if (!indices[index]) {
        indices[index] = []
      }
      indices[index].push({
        field: field.value,
        type: field.type,
        operator: get(operators.find(opt => opt.label === cond.operator), 'value', 'eq'),
        value: cond.value,
      })

      return indices
    }, {})
  } else if (dataSource) {
    conditions[dataSource.index] = []
  }
  const requestBody = Object.keys(conditions).map(index => ({
    index,
    query: conditions[index].reduce((query, cond) => {
      let condField = cond.field

      if (cond.type === 'text' || cond.type === 'keyword') {
        condField += '.keyword'
      }
      if (cond.operator === 'eq') {
        return query.must(esb.termQuery(condField, cond.value))
      }
      if (cond.operator === 'not') {
        return query.mustNot(esb.termQuery(condField, cond.value))
      }
      return query.must(esb.rangeQuery(cond.field)[cond.operator](cond.value))
    }, esb.boolQuery()),
  }))
  if (!payload.length && queryConfig.length) {
    requestBody.length = 0
    if (index) {
      const config = queryConfig.find(c => c._id === index)
      if (config) {
        requestBody.push({
          index: config.index,
          query: esb.boolQuery(),
        })
      }
    } else {
      queryConfig.forEach((config) => {
        requestBody.push({
          index: config.index,
          query: esb.boolQuery(),
        })
      })
    }
  }
  if (Array.isArray(filters.dateRange)) {
    const { dateRange } = filters

    requestBody.forEach((req) => {
      const config = queryConfig.find(c => c.index === req.index)
      req.query.filter(esb.rangeQuery(config.timestamp)
        // .timeZone('+08:00')
        .gte(+dateRange[0])
        .lte(+dateRange[1]))
    })
  }

  return esClient.msearch({
    body: requestBody.reduce((req, { index, query }) => {
      return req.concat({ index }, {
        from,
        size,
        query: query.toJSON(),
      })
    }, []),
  })
}

function buildAggs (aggName, timeRange, options = {}) {
  const {
    timestamp = '@timestamp',
    interval = 'day',
    fields = [],
  } = options
  const dateRange = esb.dateHistogramAggregation(aggName, timestamp, interval)
    // .timeZone('+08:00')
    .minDocCount(0)
    .extendedBounds(+timeRange[0], +timeRange[1])

  fields.forEach(({ name, agg, type }) => {
    let value = name
    if (['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'].indexOf(type) === -1) {
      value = `${name}.keyword`
    }
    switch (agg) {
      case 'count':
        // Use `timestamp` instead of `value`, because `value` maybe is null
        agg = esb.valueCountAggregation(name, timestamp)
        break
      case 'terms':
        agg = esb.termsAggregation(name, value)
        break
      case 'avg':
        agg = esb.avgAggregation(name, value)
        break
      case 'sum':
        agg = esb.sumAggregation(name, value)
        break
      case 'min':
        agg = esb.minAggregation(name, value)
        break
      case 'max':
        agg = esb.maxAggregation(name, value)
        break
      default:
        agg = null
    }
    if (agg) {
      dateRange.agg(agg)
    }
  })

  return dateRange
}

export async function getKPIResult (payload: any) {
  const { config, timeRange, interval = 'minute' } = payload
  const requestBody = config.map((cfg) => {
    let _query = esb.boolQuery()
      .must(esb.rangeQuery(cfg.chart.x.field)
        // .timeZone('+08:00')
        .gte(+timeRange[0])
        .lte(+timeRange[1]))
    _query = cfg.filters.reduce((query, { field, operator, type, value }) => {
      if (['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'].indexOf(type) === -1) {
        field = `${field}.keyword`
      }
      switch (operator) {
        default:
        case 'eq':
          return query.must(esb.termQuery(field, value))
        case 'not':
          return query.mustNot(esb.termQuery(field, value))
        case 'lt':
        case 'lte':
        case 'gt':
        case 'gte':
          value = parseFloat(value)
          return query.must(esb.rangeQuery(field)[operator](value))
      }
    }, _query)
    return {
      index: cfg.index,
      query: _query.toJSON(),
      aggs: buildAggs(cfg._id, timeRange, {
        interval,
        timestamp: cfg.chart.x.field,
        fields: cfg.chart.values.map(v => ({
          name: v.field,
          agg: v.operator,
          type: v.type,
        })),
      }).toJSON(),
    }
  })

  return esClient.msearch({
    body: requestBody.reduce((req, body) => {
      return req.concat({
        index: body.index,
      }, {
        query: body.query,
        aggs: body.aggs,
      })
    }, []),
  })
}

export async function getAlertResult (payload: any) {
  const {
    alerts = [],
    timeRange,
    interval = getInterval(timeRange[0], timeRange[1]),
  } = payload
  const aggs = alerts.map((alert) => {
    return {
      timestamp: alert.timestamp,
      index: alert.index,
      body: buildAggs(alert.index, timeRange, {
        interval,
        timestamp: alert.timestamp,
        fields: [{ name: 'serverity', agg: 'max', type: 'long' }],
      }).toJSON(),
    }
  })

  if (!alerts.length) {
    return Promise.resolve({
      responses: [],
    })
  }

  return esClient.msearch({
    body: aggs.reduce((requestBody, agg) => requestBody.concat([{
      index: agg.index,
    }, {
      size: 0,
      aggs: agg.body,
      query: esb.boolQuery()
        .must(esb.rangeQuery(agg.timestamp)
          // .timeZone('+08:00')
          .gte(+timeRange[0])
          .lte(+timeRange[1]))
        .toJSON(),
    }]), []),
  })
}

let lastTimeRange: ?Array<DateTime> = null
let lastTimestamp: string = '@timestamp'

export async function getAlertData (payload: any) {
  const {
    from = 0,
    size = 20,
    index,
    timestamp = lastTimestamp,
  } = payload
  let { timeRange } = payload

  if (timeRange) {
    lastTimeRange = timeRange
  } else if (lastTimeRange) {
    timeRange = lastTimeRange
  } else {
    return Promise.resolve({})
  }
  lastTimestamp = timestamp

  return esClient.search({
    index,
    body: esb.requestBodySearch()
      .query(esb.boolQuery()
        .must(esb.rangeQuery(timestamp || lastTimestamp)
          // .timeZone('+08:00')
          .gte(+timeRange[0])
          .lt(+timeRange[1]))
        .mustNot(esb.termQuery('level.keyword', 'NORMAL')))
      .sort(esb.sort('serverity', 'desc'))
      .from(from)
      .size(size)
      .toJSON(),
  })
}
