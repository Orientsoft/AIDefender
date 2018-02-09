import esb from 'elastic-builder'
import get from 'lodash/get'
import { operators } from 'utils'
import { esClient } from 'utils/esclient'

export async function getQueryResult ({ payload = [], from, to }) {
  const conditions = payload.reduce((indices, cond) => {
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
    }, esb.boolQuery()).toJSON(),
  }))

  return esClient.msearch({
    body: requestBody.reduce((req, { index, query }) => {
      return req.concat({ index }, { query, from, to })
    }, []),
  })
}

export async function getKPIResult (params = []) {
  return esClient.msearch({
    body: [
      {},
      { query: { match_all: {} } },
    ],
  })
}
