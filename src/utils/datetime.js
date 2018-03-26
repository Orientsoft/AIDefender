// @flow
import type { Moment, MomentInput, MomentFormatSpecification } from 'moment'

import moment from 'moment'
import isFunction from 'lodash/isFunction'

const formatLiterals: Array<string> = [
  'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond',
]

/** 计算日期时间粒度
 * @params {MomentInput} startTs
 * @params {MomentInput} endTs
 * @return 返回一个表示粒度的字符串，和Elasticsearch日期粒度相同
 */
export function getGranulation (
  startTs: MomentInput,
  endTs: MomentInput,
): Array<string> {
  const granulation: Array<string> = []
  const _startTs: Moment = moment(startTs)
  const _endTs: Moment = moment(endTs)

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

export default moment
