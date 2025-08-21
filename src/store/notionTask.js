import axios from 'axios'

export default {
  namespaced: true,
  state: () => {
    return {
      taskDBCollection: {}, // 필터용 스택 목록
      taskList: []
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
        console.log('searchTaskDataBases:::res:::', res.data)
        res.data.results.forEach(result => {
          const title = result.title[0].plain_text
          taskDBCollection[result.id] = title
        })

        context.commit('updateState', {
          taskDBCollection
        })
      } catch (error) {
        console.log(error)
        context.commit('resetDBList')
      }
    },
    // 일일업무 검색
    async searchTask({ commit }, payload) {
      try {
        const res = await _fetchNotionTaskReport({
          database_id: payload.get('db'),
          filter: {
            and: [
              {
                property: '시작일',
                date: { on_or_after: '2021-05-10' }
                // this_week
              },
              {
                property: '종료일',
                date: { on_or_before: '2025-07-10' }
                // past_month, past_year
              }
            ]
          },
          sorts: [
            {
              property: 'pagetype',
              direction: 'ascending' // descending
            }
          ]
          // page_size : 최대 100
          // start_cursor: 페이지
        })
        console.log('searchTask:::res:::', res.data)

        commit('updateState', {
          taskList: res.data.results
        })
      } catch (error) {
        console.log(error)
        commit('resetTaskList')
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
