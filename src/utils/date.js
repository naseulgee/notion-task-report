const _DATE_UNIT = {
  day: '일',
  week: '주',
  month: '월',
  year: '년'
}
let durationLabels = []

/**
 * getStrDate
 * - 전달 받은 날짜를 yyyy-MM-dd 형태의 문자열로 변환하는 함수
 *
 * @param {Date} targetDate - 날짜 객체
 * @returns {string}
 */
export function getStrDate(targetDate) {
  if (typeof targetDate == 'string') targetDate = new Date(targetDate)
  return `${targetDate.getFullYear()}-${(targetDate.getMonth() + 1).toString().padStart(2, '0')}-${targetDate.getDate().toString().padStart(2, '0')}`
}

/**
 * getDurations
 * - 전달 받은 날짜를 기준으로 단위별 시작, 종료일들의 배열을 전달하는 함수
 * - 일 -> 5일(주말 제외) / 주 -> 4주 / 월 -> 3개월 / 년 -> 2년
 *
 * @param {Date} targetDate - 기준 날짜
 * @param {string} unit - 조회 단위
 * @returns {Array}
 */
export function getDurations(targetDate, unit) {
  const durations = []
  durationLabels = []
  switch (unit) {
    case 'day':
      _getDayDurations(targetDate, durations)
      break
    case 'week':
      _getWeekDurations(targetDate, durations)
      break
    case 'month':
      _getMonthDurations(targetDate, durations)
      break
    default:
      _getYearDurations(targetDate, durations)
      break
  }
  return durations
}
function _getDayDurations(targetDate, durations) {
  for (let i = 0; i < 7; i++) {
    if (targetDate.getDay() != 0 && targetDate.getDay() != 6) {
      let strDate = getStrDate(targetDate)
      durations.push([strDate, strDate])
      durationLabels.push(strDate.slice(8) + _DATE_UNIT.day)
    }
    targetDate.setDate(targetDate.getDate() - 1)
  }
}
function _getWeekDurations(targetDate, durations) {
  for (let i = 0; i < 4; i++) {
    const date = targetDate.getDate(),
      day = targetDate.getDay(),
      monday = date - day + (!day ? -6 : 1)
    const firstDate = new Date(targetDate.setDate(monday)),
      lastDate = new Date(firstDate)
    lastDate.setDate(firstDate.getDate() + 6)
    const strFirstDate = getStrDate(firstDate)
    const strLastDate = getStrDate(lastDate)

    durations.push([strFirstDate, strLastDate])
    durationLabels.push(strFirstDate.slice(5) + ' ~ ' + strLastDate.slice(5))
    targetDate.setDate(date - 7)
  }
}
function _getMonthDurations(targetDate, durations) {
  for (let i = 0; i < 3; i++) {
    const y = targetDate.getFullYear(),
      m = targetDate.getMonth()
    const firstDate = new Date(y, m, 1),
      lastDate = new Date(y, m + 1, 0)

    durations.push([getStrDate(firstDate), getStrDate(lastDate)])
    durationLabels.push((m + 1).toString().padStart(2, '0') + _DATE_UNIT.month)
    targetDate.setMonth(m - 1)
  }
}
function _getYearDurations(targetDate, durations) {
  for (let i = 0; i < 2; i++) {
    const y = targetDate.getFullYear()
    const firstDate = new Date(y, 0, 1),
      lastDate = new Date(y + 1, 0, 0)

    durations.push([getStrDate(firstDate), getStrDate(lastDate)])
    durationLabels.push(y.toString().padStart(2, '0') + _DATE_UNIT.year)
    targetDate.setYear(y - 1)
  }
}

/**
 * getDurationLabels
 *
 * @returns {Array}
 */
export function getDurationLabels() {
  return durationLabels
}
