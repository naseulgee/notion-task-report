import axios from 'axios'
import { getDurations, getDurationLabels } from '@/utils/date'
import { consoleStart, consoleEnd, consoleChange } from '@/utils/console'
import { PROPS, getPropertyList, getPropertyNumber } from '@/utils/notionProps'

export default {
  namespaced: true,
  state: () => {
    return {
      taskDBCollection: {}, // 필터용 스택 목록
      taskList: [],
      durationLabelList: [],
      // { "id": { "name": "분류1", "color": "", "작업일자": [ 기간별작업일자1, ... ], "분류별평가ID1": [ 기간별작업수1, ... ], ... }, ... }
      categoryCollection: {},
      // { "id": { "name": "평가1", cnt: [ 기간별평가1, ... ] }, ... }
      ratingCollection: {},
      isLoading: false
    }
  },
  mutations: {
    resetDBList(state) {
      state.taskDBCollection = {}
      state.taskList = []
    },
    resetTaskList(state) {
      state.taskList = []
    },
    resetDurationLabelList(state) {
      state.durationLabelList = []
    },
    resetCategoryCollection(state) {
      state.categoryCollection = {}
    },
    resetRatingCollection(state) {
      state.ratingCollection = {}
    },
    updateState(state, payload) {
      for (const key in payload) {
        state[key] = payload[key]
      }
    }
  },
  actions: {
    // 일일업무 데이터베이스 목록 검색
    async searchTaskDataBases(context) {
      if (context.state.isLoading) return // 중복 요청 방지

      consoleStart('searchTaskDataBases')
      context.commit('updateState', { isLoading: true })
      context.commit('resetDBList')

      try {
        let taskDBCollection = {}
        const res = await _fetchNotionTaskDataBases({
          query: '업무',
          filter: {
            value: 'database',
            property: 'object'
          },
          sort: {
            direction: 'ascending',
            timestamp: 'last_edited_time'
          }
        })

        res.data.results.forEach(result => {
          result.title = result.title[0].plain_text
          if (result.title.toLowerCase().includes('sample')) return
          taskDBCollection[result.id] = result
        })

        context.commit('updateState', {
          taskDBCollection
        })
      } catch (error) {
        console.error(error)
        context.commit('resetDBList')
      } finally {
        consoleChange('taskDBCollection', context.state.taskDBCollection)
        context.commit('updateState', { isLoading: false })
        consoleEnd('searchTaskDataBases')
      }
    },

    // 일일업무 검색
    async searchTask({ state, commit }, payload) {
      if (state.isLoading) return // 중복 요청 방지

      consoleStart('searchTask')
      try {
        commit('updateState', { isLoading: true })
        commit('resetTaskList')
        commit('resetCategoryCollection')
        commit('resetRatingCollection')

        // 조회 기준
        const { database_id, date, duration } = payload
        const today = new Date(date)
        const repeatDurations = getDurations(today, duration) // 표에서 비교하여 같이 보여줄 배열

        // 분류, 평가 목록 초기화
        const ratingCollection = _getInitRatingCollection(
          state.taskDBCollection[database_id],
          repeatDurations
        )
        // const ratingCollection = getPropertyList(
        //   state.taskDBCollection[database_id],
        //   PROPS.rating,
        //   true
        // ).map(r => ({
        //   name: r.name,
        //   cnt: Array.from({ length: repeatDurations.length }, () => 0)
        // }))
        // ratingCollection.push({
        //   name: '미평가',
        //   cnt: Array.from({ length: repeatDurations.length }, () => 0)
        // })
        const categoryCollection = _getInitCategoyList(
          state.taskDBCollection[database_id],
          repeatDurations,
          ratingCollection
        )

        // 기간 별 업무리스트 업데이트
        for (let i = 0; i < repeatDurations.length; i++) {
          const repeatDuration = repeatDurations[i]
          const res = await _fetchNotionTaskReport({
            database_id,
            filter: {
              and: [
                {
                  property: '종료일',
                  date: { on_or_after: repeatDuration[0] }
                },
                {
                  property: '종료일',
                  date: { on_or_before: repeatDuration[1] }
                }
              ]
            }
          })

          commit('updateState', {
            taskList: [...state.taskList, res.data.results]
          })
          consoleChange('test', res.data.results)

          // 평가 업데이트
          for (const rateKey in ratingCollection) {
            const rating = ratingCollection[rateKey]
            for (const task of res.data.results) {
              // 업무 평가
              const taskRating =
                getPropertyList(task, PROPS.rating)?.id || 'undefined'
              if (taskRating.includes(rateKey)) rating.cnt[i] += 1
            }
          }

          // 분류 업데이트
          for (const cateKey in categoryCollection) {
            for (const task of res.data.results) {
              // 업무 카테고리 목록
              const taskCategoryIds = getPropertyList(
                task,
                PROPS.category
              )?.map(c => c.id)
              // 분류 별 업무 평가
              const taskRating =
                getPropertyList(task, PROPS.rating)?.id || 'undefined'

              if (taskCategoryIds.includes(cateKey)) {
                // 해당 카테고리의 전체 카운팅
                categoryCollection[cateKey].totalRating[i] += 1
                // 해당 카테고리의
                categoryCollection[cateKey][taskRating].cnt[i] += 1
                categoryCollection[cateKey][PROPS.work_date][i] +=
                  getPropertyNumber(task, PROPS.work_date)
              }
            }
          }
        }
        commit('updateState', {
          ratingCollection,
          categoryCollection,
          durationLabelList: getDurationLabels(duration)
        })
      } catch (error) {
        console.error(error)
        commit('resetTaskList')
        commit('resetDurationLabelList')
        commit('resetCategoryCollection')
        commit('resetRatingCollection')
      } finally {
        consoleChange('categoryCollection', state.categoryCollection)
        consoleChange('ratingCollection', state.ratingCollection)
        consoleChange('durationLabelList', state.durationLabelList)
        consoleChange('taskList', state.taskList)
        commit('updateState', { isLoading: false })
        consoleEnd('searchTask')
      }
    }
  }
}

async function _fetchNotionTaskDataBases(payload) {
  return await axios.post('/.netlify/functions/notionTaskDataBases', payload)
}
async function _fetchNotionTaskReport(payload) {
  return await axios.post('/.netlify/functions/notionTaskReport', payload)
}

function _getInitRatingCollection(data, repeatDurations) {
  const ratingCollection = {}
  const ratings = getPropertyList(data, PROPS.rating, true)
  const initArray = Array.from({ length: repeatDurations.length }, () => 0)

  ratingCollection.undefined = {
    name: '미평가',
    color: 'lightgray',
    cnt: [...initArray]
  }
  for (const rating of ratings) {
    const { id, name, color } = rating
    ratingCollection[id] = {
      name,
      color: color == 'default' ? 'lightgray' : color
    }
    ratingCollection[id].cnt = [...initArray]
  }
  return ratingCollection
}
function _getInitCategoyList(data, repeatDurations, ratings) {
  const categoryCollection = {}
  const categories = getPropertyList(data, PROPS.category, true)
  const initArray = Array.from({ length: repeatDurations.length }, () => 0)

  for (const category of categories) {
    const { id, name, color } = category
    categoryCollection[id] = {
      name,
      color: color == 'default' ? 'lightgray' : color,
      totalRating: [...initArray] // 평가 카운트 리셋
    }
    for (const rateKey in ratings) {
      categoryCollection[id][rateKey] = {
        name: ratings[rateKey].name,
        cnt: [...initArray]
      }
    }
    // 작업일자 리셋
    categoryCollection[id][PROPS.work_date] = [...initArray]
  }
  return categoryCollection
}
