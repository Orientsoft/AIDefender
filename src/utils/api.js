import config from '../../app.json'

export default {
  from: url => config.apiPrefix + url,
}
