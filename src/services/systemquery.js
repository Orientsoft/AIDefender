import esb from 'elastic-builder'
import get from 'lodash/get'
import { operators } from 'utils'
import { esClient } from 'utils/esclient'

export async function getQueryResult ({ payload = [], from, size, datasource, filters = {} }) { // eslint-disable-line
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
  } else {
    if (datasource) {
      conditions[datasource.index] = []
    }
  }

  const requestBody = Object.keys(conditions).map(index => ({
    index,
    query: conditions[index].reduce((query, cond) => {
      let condField = cond.field

      if (cond.type === 'text') {
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
  if (Array.isArray(filters.dateRange)) {
    const { dateRange } = filters

    requestBody.forEach((req) => {
      req.query.filter(esb.rangeQuery('@timestamp')
        .timeZone('+08:00')
        .gte(dateRange[0].toJSON())
        .lte(dateRange[1].toJSON()))
    })
  }
  if (!requestBody.length) {
    return Promise.resolve({ responses: [] })
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
    .timeZone('+08:00')
    .minDocCount(0)
    .extendedBounds(timeRange[0].toJSON(), timeRange[1].toJSON())

  fields.forEach(({ name, agg }) => {
    switch (agg) {
      case 'terms':
        agg = esb.termsAggregation(name, `${name}.keyword`)
        break
      case 'avg':
        agg = esb.avgAggregation(name, name)
        break
      case 'sum':
        agg = esb.sumAggregation(name, name)
        break
      case 'min':
        agg = esb.minAggregation(name, name)
        break
      case 'max':
        agg = esb.maxAggregation(name, name)
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

export async function getKPIResult (payload) {
  const { config, timeRange, interval = 'minute' } = payload
  const requestBody = config.map(cfg => ({
    index: cfg.index,
    query: esb.constantScoreQuery()
      .filter(esb.rangeQuery('@timestamp')
        .timeZone('+08:00')
        .gte(timeRange[0].toJSON())
        .lte(timeRange[1].toJSON()))
      .toJSON(),
    aggs: buildAggs(cfg._id, timeRange, {
      interval,
      fields: cfg.chart.values.map(v => ({ name: v.field, agg: v.operator })),
    }).toJSON(),
  }))

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

export async function getAlertResult (payload) {
  const { alertName, timeRange, interval = 'day' } = payload
  const aggs = buildAggs(alertName, timeRange, {
    interval,
    timestamp: 'createdAt',
  })
  aggs.agg(esb.termsAggregation('level', 'level.keyword'))
  /*
  aggs.agg(esb.filtersAggregation('alert')
    .anonymousFilters([
      esb.matchQuery('level.keyword', 'normal'),
      esb.matchQuery('level.keyword', 'error'),
      esb.matchQuery('level.keyword', 'warning'),
    ]))
  */
  return esClient.msearch({
    body: [{
      index: 'alter_mobile_count',
    }, {
      aggs: aggs.toJSON(),
    }],
  })
}
