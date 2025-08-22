import axios from 'axios'
import { getDurations, getDurationLabels } from '@/utils/date'
import { consoleStart, consoleEnd, consoleChange } from '@/utils/console'

export default {
  namespaced: true,
  state: () => {
    return {
      taskDBCollection: {}, // 필터용 스택 목록
      taskList: [],
      durationLabels: [],
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
    resetDurationLabels(state) {
      state.durationLabels = []
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
          const title = result.title[0].plain_text
          if (title.toLowerCase().includes('sample')) return
          taskDBCollection[result.id] = title
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
      commit('updateState', { isLoading: true })
      commit('resetTaskList')

      // 조회 기준
      const { database_id, date, duration } = payload
      const today = new Date(date)
      const repeatDurations = getDurations(today, duration) // 표에서 비교하여 같이 보여줄 배열

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

          commit('resetDurationLabels')
          commit('updateState', {
            taskList: [...state.taskList, res.data.results],
            durationLabels: getDurationLabels(duration)
          })
        }
      } catch (error) {
        console.error(error)
        commit('resetTaskList')
        commit('resetDurationLabels')
      } finally {
        consoleChange('durationLabels', state.durationLabels)
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
