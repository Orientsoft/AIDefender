// @flow
import type { Moment, MomentInput, MomentFormatSpecification } from 'moment'

import moment from 'moment'
import isFunction from 'lodash/isFunction'

export const intervals = {
  year: '年',
  month: '月',
  week: '周',
  day: '天',
  hour: '小时',
  minute: '分钟',
  second: '秒',
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
  const _startTs: Moment = moment(startTs)
  const _endTs: Moment = moment(endTs)
  const _intervals = Object.keys(intervals)

  for (let interval of _intervals) {
    const getStartTs = _startTs[interval]
    const getEndTs = _endTs[interval]
    const index = _intervals.indexOf(interval)

    if (isFunction(getStartTs) && isFunction(getEndTs)) {
      startTs = getStartTs.call(_startTs)
      endTs = getEndTs.call(_endTs)

      if (startTs !== endTs) {
        if (endTs - startTs <= 12 && index !== _intervals.length - 1) {
          return _intervals[index + 1]
        }
        return interval
      }
    }
  }

  return _intervals[0]
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
