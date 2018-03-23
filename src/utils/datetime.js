// @flow
import moment from 'moment'

/** 计算日期时间粒度
 * @params {Moment|Number|Date|String} startTs
 * @params {Moment|Number|Date|String} endTs
 * @return 返回一个表示粒度的字符串，和Elasticsearch日期粒度相同
 */
export function computeGranulation (startTs: mixed, endTs: mixed): string {
  startTs = moment(startTs)
  endTs = moment(endTs)

  if (startTs.year() !== endTs.year()) {
    return 'year'
  }
  if (startTs.month() !== endTs.month()) {
    return 'month'
  }
  if (startTs.week() !== endTs.week()) {
    return 'week'
  }
  if (startTs.day() !== endTs.day()) {
    return 'day'
  }
  if (startTs.hour() !== endTs.hour()) {
    return 'hour'
  }
  if (startTs.minute() !== endTs.minute()) {
    return 'minute'
  }
  if (startTs.second() !== endTs.second()) {
    return 'second'
  }
  if (startTs.millisecond() !== endTs.millisecond()) {
    return 'millisecond'
  }

  return 'day'
}
