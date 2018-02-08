import esb from 'elastic-builder'
import get from 'lodash/get'
import { operators } from 'utils'
import { esClient } from 'utils/esclient'

export async function getQueryResult (params = []) {
  const conditions = params.reduce((indices, cond) => {
    // cond.field[0].value is index and cond.field[1].value is field
    if (!(Array.isArray(cond.field) && cond.field.length >= 2)) {
      return indices
    }
    const index = cond.field[0].value
    const field = cond.field[1].value

    if (!indices[index]) {
      indices[index] = []
    }
    indices[index].push({
      field,
      operator: get(operators.find(opt => opt.label === cond.operator), 'value', 'eq'),
      value: Number(cond.value),
    })

    return indices
  }, {})
  const requestBody = Object.keys(conditions).map(index => ({
    index,
    query: conditions[index].reduce((query, cond) => {
      if (cond.operator === 'eq') {
        return query.must(esb.termQuery(cond.field, Number(cond.value)))
      }
      if (cond.operator === 'not') {
        return query.mustNot(esb.termQuery(cond.field, Number(cond.value)))
      }
      return query.must(esb.rangeQuery(cond.field)[cond.operator](cond.value))
    }, esb.boolQuery()).toJSON(),
  }))

  return esClient.msearch({
    body: requestBody.reduce((req, { index, query }) => {
      return req.concat({ index }, { query })
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
