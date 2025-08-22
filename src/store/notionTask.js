import axios from 'axios'
import { getDurations } from '@/utils/date'

export default {
  namespaced: true,
  state: () => {
    return {
      taskDBCollection: {}, // 필터용 스택 목록
      taskList: [],
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
    updateState(state, payload) {
      for (const key in payload) {
        state[key] = payload[key]
      }
    }
  },
  actions: {
    // 일일업무 데이터베이스 목록 검색
    async searchTaskDataBases(context) {
      // 이미 데이터를 받아온 경우 재요청 방지(자주 안바뀔거라)
      if (Object.keys(context.state.taskDBCollection).length != 0) return

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
          const title = result.title[0].plain_text
          if (title.toLowerCase().includes('sample')) return
          taskDBCollection[result.id] = title
        })

        context.commit('updateState', {
          taskDBCollection
        })
      } catch (error) {
        console.log(error)
        context.commit('resetDBList')
      } finally {
        console.log(
          'searchTaskDataBases:::taskDBCollection:::',
          context.state.taskDBCollection
        )
        context.commit('updateState', { isLoading: false })
      }
    },
    // 일일업무 검색
    async searchTask({ state, commit }, payload) {
      commit('updateState', { isLoading: true })
      commit('resetTaskList')

      // 조회 기준
      const { database_id, date, duration } = payload
      const today = new Date(date)
      const repeatDurations = getDurations(today, duration) // 표에서 비교하여 같이 보여줄 배열
      console.log(repeatDurations)
      try {
        for (const repeatDuration of repeatDurations) {
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
        }
      } catch (error) {
        console.log(error)
        commit('resetTaskList')
      } finally {
        console.log('searchTask:::taskList:::', state.taskList)
        commit('updateState', { isLoading: false })
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
