// @flow
import type { Moment, MomentInput, MomentFormatSpecification } from 'moment'

import moment from 'moment'
import isFunction from 'lodash/isFunction'

const intervals: Array<string> = [
  'year', 'month', 'week', 'day', 'hour', 'minute', 'second',
]

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

  for (let interval of intervals) {
    const getStartTs = _startTs[interval]
    const getEndTs = _endTs[interval]
    const index = intervals.indexOf(interval)

    if (isFunction(getStartTs) && isFunction(getEndTs)) {
      startTs = getStartTs.call(_startTs)
      endTs = getEndTs.call(_endTs)

      if (startTs !== endTs) {
        if (endTs - startTs <= 24 && index !== intervals.length - 1) {
          return intervals[index + 1]
        }
        return interval
      }
    }
  }

  return intervals[0]
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
