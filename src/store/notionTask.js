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
      // [{ "id": "", "name": "분류1", "color": "", "작업일자": [ 기간별작업일자1, ... ], "평가1": [ 기간별작업수1, ... ], ... }, ...]
      categoryList: [],
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
    resetCategoryList(state) {
      state.categoryList = []
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

        // 조회 기준
        const { database_id, date, duration } = payload
        const today = new Date(date)
        const repeatDurations = getDurations(today, duration) // 표에서 비교하여 같이 보여줄 배열
        const categoryList = _getInitCategoyList(
          state.taskDBCollection[database_id],
          repeatDurations
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

          // 분류 업데이트
          for (const category of categoryList) {
            for (const task of res.data.results) {
              // 업무 카테고리 목록
              const taskCategoryIds = getPropertyList(
                task,
                PROPS.category
              )?.map(c => c.id)
              // 업무 평가
              const taskRating =
                getPropertyList(task, PROPS.rating)?.name || '미평가'

              if (taskCategoryIds.includes(category.id)) {
                // 해당 카테고리의 전체 카운팅
                category.totalRating[i] = (category.totalRating[i] || 0) + 1
                // 해당 카테고리의
                category[taskRating][i] = (category[taskRating][i] || 0) + 1
                category[PROPS.work_date][i] += getPropertyNumber(
                  task,
                  PROPS.work_date
                )
              }
            }
          }
        }
        commit('updateState', {
          categoryList,
          durationLabelList: getDurationLabels(duration)
        })
      } catch (error) {
        console.error(error)
        commit('resetTaskList')
        commit('resetDurationLabelList')
        commit('resetCategoryList')
      } finally {
        consoleChange('categoryList', state.categoryList)
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

function _getInitCategoyList(data, repeatDurations) {
  const categories = getPropertyList(data, PROPS.category, true)
  const ratings = getPropertyList(data, PROPS.rating, true)
  const initArray = new Array(repeatDurations.length)
  for (const category of categories) {
    // 컬러링
    if (category.color == 'default') category.color = 'lightgray'
    // 평가 카운트 리셋
    category.totalRating = [...initArray]
    category['미평가'] = [...initArray]
    for (const rating of ratings) {
      category[rating.name] = [...initArray]
    }
    // 작업일자 리셋
    category[PROPS.work_date] = [...initArray]
  }
  return categories
}
