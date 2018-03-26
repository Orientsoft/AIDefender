// @flow
import moment from 'moment'
import isFunction from 'lodash/isFunction'

const formatLiterals: Array<string> = [
  'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond',
]

/** 计算日期时间粒度
 * @params {Moment|Number|Date|String} startTs
 * @params {Moment|Number|Date|String} endTs
 * @return 返回一个表示粒度的字符串，和Elasticsearch日期粒度相同
 */
export function getGranulation (
  startTs: mixed,
  endTs: mixed,
): Array<string> {
  const granulation: Array<string> = []
  const _startTs: moment.Moment = moment(startTs)
  const _endTs: moment.Moment = moment(endTs)

  formatLiterals.forEach((ts) => {
    const startTsFn = _startTs[ts]
    const endTsFn = _endTs[ts]
    if (isFunction(startTsFn) && isFunction(endTsFn) &&
      startTsFn() !== endTsFn()) {
      granulation.push(ts)
    }
  })

  return granulation
}
