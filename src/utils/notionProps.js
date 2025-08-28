export const PROPS = {
  category: '분류',
  rating: '평가',
  work_date: '작업일자'
}

/**
 * getPropertyList
 * - Notion DB 객체에서 속성 값 리스트를 추출하는 함수
 *
 * @param {object} task - notion db object
 * @param {string} key - 속성 키
 * @returns {Array}
 */
export function getPropertyList(task, key, isOption) {
  const property = task?.properties?.[key]
  if (isOption)
    return property?.multi_select?.options || property?.select?.options || []
  return property?.multi_select || property?.select || []
}

/**
 * getPropertyNumber
 * - Notion DB 객체에서 속성 숫자값을 추출하는 함수
 *
 * @param {object} task - notion db object
 * @param {string} key - 속성 키
 * @returns {Array}
 */
export function getPropertyNumber(task, key) {
  const property = task?.properties?.[key]
  return property?.number || property?.formula?.number || 0
}
