import elasticsearch from 'elasticsearch-browser'
const esHost = process.env.ESHOST
export const esClient = new elasticsearch.Client({ host: esHost })
