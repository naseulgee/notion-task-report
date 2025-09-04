<template>
  <form
    @submit.prevent="submitForm"
    class="flex flex-wrap items-end gap-1 text-gray-600"
  >
    <!-- s: DB 선택창 -->
    <div>
      <span class="m-1 mx-2 block text-sm text-gray-400">일지</span>
      <select
        v-model="formData.data_source_id"
        required
        class="min-w-52 cursor-pointer appearance-none rounded-2xl border border-gray-200 px-3 py-1 pr-7 outline-0 *:bg-white hover:bg-gray-100"
      >
        <option
          v-for="dbID in Object.keys(dbs)"
          :key="dbID"
          :value="dbID"
        >
          {{ dbs[dbID].title }}
        </option>
      </select>
    </div>
    <!-- e: DB 선택창 -->

    <!-- s: 조회 기준 일자 -->
    <div>
      <span class="m-1 mx-2 block text-sm text-gray-400">기준 일자</span>
      <input
        type="date"
        required
        v-model="formData.date"
        class="cursor-pointer rounded-2xl border border-gray-200 px-3 py-1 outline-0 *:bg-white hover:bg-gray-100"
      />
    </div>
    <!-- e: 조회 기준 일자 -->

    <!-- s: 조회 단위 선택 버튼 -->
    <div>
      <span class="m-1 mx-2 block text-sm text-gray-400">비교 단위</span>
      <ul
        class="flex overflow-hidden rounded-2xl border border-gray-200 *:*:block *:*:cursor-pointer *:*:px-3 *:*:py-1 *:*:*:first:hidden *:*:hover:bg-gray-100 *:*:has-checked:bg-gray-100"
      >
        <li
          v-for="(duration, idx) in durations"
          :key="duration.unit"
        >
          <label>
            <input
              type="radio"
              v-model="formData.duration"
              :value="duration.unit"
              :checked="idx == 0"
              required
            />
            {{ duration.dec }}
          </label>
        </li>
      </ul>
    </div>
    <!-- e: 조회 단위 선택 버튼 -->

    <!-- s: 조회 버튼 -->
    <button
      type="submit"
      class="ml-1 cursor-pointer rounded bg-blue-500 px-3 py-1 font-semibold text-white hover:bg-blue-600"
    >
      조회
    </button>
    <!-- e: 조회 버튼 -->
  </form>
</template>

<script>
import { getStrDate } from '@/utils/date'

export default {
  data() {
    return {
      formData: {
        data_source_id: '',
        date: '',
        duration: 'day'
      },
      durations: [
        { unit: 'day', dec: '일' },
        { unit: 'week', dec: '주' },
        { unit: 'month', dec: '월' },
        { unit: 'year', dec: '년' }
      ]
    }
  },
  computed: {
    dbs() {
      const dbs = this.$store.state.notionTask.taskDBCollection
      this.formData.data_source_id = Object.keys(dbs)[0]
      return dbs
    }
  },
  methods: {
    submitForm() {
      // 데이터 제출
      this.$store.dispatch('notionTask/searchTask', this.formData)
    }
  },
  mounted() {
    // 기준 일자 오늘로 세팅
    const date = new Date()
    this.formData.date = getStrDate(date)
  }
}
</script>
