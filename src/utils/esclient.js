import elasticsearch from 'elasticsearch-browser'
const esHost = process.env.ESHOST || '192.168.0.21:9900'
export const esClient = new elasticsearch.Client({ host: esHost })