// @flow
import type { Moment, MomentInput, MomentFormatSpecification } from 'moment'

import moment from 'moment'
// import 'moment/locale/zh-cn'

// moment.locale('zh-cn')

export const intervals = {
  year: '年',
  month: '月',
  week: '周',
  day: '天',
  hour: '小时',
  minute: '分钟',
  second: '秒',
}

/**
 * 如果时间范围属于不同年份，比如2018-10-01 ~ 2019-03-06
 * 则判断月份之差是否在12个月之内，是就以月份作为查询粒度，否就以年作为查询粒度
 *
 * 如果时间范围在同一年，则判断两者月的周数之差是否在7周之内，即相差1.75个月以内
 * 是就以小时作为查询粒度，否就以周最为查询粒度
 *
 * 如果时间范围相差在12天以内，则以小时作为查询粒度
 *
 * 如果时间范围相差在12小时以内，则以分钟作为查询粒度
 *
 * 如果时间范围相差在12分钟以内，则以秒作为查询粒度
 */
export function getIntervalV0 (
  startTs: MomentInput,
  endTs: MomentInput,
): string {
  const _startTs: Moment = moment(startTs)
  const _endTs: Moment = moment(endTs)
  const _intervals = Object.keys(intervals)

  for (let interval of _intervals) {
    const index = _intervals.indexOf(interval)

    startTs = _startTs[interval].call(_startTs)
    endTs = _endTs[interval].call(_endTs)

    if (startTs !== endTs) {
      if (endTs - startTs <= 12 && index < _intervals.length - 1) {
        const _interval = _intervals[index + 1]

        if (_interval === 'week') {
          startTs = _startTs[_interval].call(_startTs)
          endTs = _endTs[_interval].call(_endTs)
          if (endTs - startTs <= 7 && index + 2 < _intervals.length) {
            return _intervals[index + 2]
          }
        }
        return _interval
      }
      return interval
    }
  }

  return _intervals[0]
}

/** 计算日期时间粒度
 * @params {MomentInput} startTs
 * @params {MomentInput} endTs
 * @return 返回一个表示粒度的字符串，和Elasticsearch日期粒度相同
 */
export function getInterval (
  startTs: MomentInput,
  endTs: MomentInput,
): string {
  return getIntervalV0(startTs, endTs)
}

export function toInterval (chineseWord: string): mixed {
  return Object.keys(intervals).find(k => intervals[k] === chineseWord)
}

export function format (
  ts: MomentInput,
  fmt: MomentFormatSpecification,
): string {
  return moment(ts).format(fmt)
}

export function formatDay (ts: MomentInput): string {
  return format(ts, 'YYYY-MM-DD')
}

export function formatMinute (ts: MomentInput): string {
  return format(ts, 'YYYY-MM-DD HH:mm')
}

export function formatSecond (ts: MomentInput): string {
  return format(ts, 'YYYY-MM-DD HH:mm:ss')
}

export type DateTime = Moment

export default moment
