<template>
  <section class="flex flex-col items-center *:mb-auto">
    <strong class="text-lg font-bold">평균 작업 소요일</strong>
    <p
      ref="chart"
      class="text-7xl font-bold"
    ></p>
  </section>
</template>

<script>
import { CountUp } from 'countup.js'
import { PROPS, getPropertyNumber } from '@/utils/notionProps'

/**
 * 해당 기간
 *  총 평균 작업 일자 -> 숫자
 */
export default {
  components: {},
  data() {
    return {
      countUp: null
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.notionTask.isLoading
    },
    tasks() {
      return this.$store.state.notionTask.taskList
    }
  },
  methods: {
    updateCount() {
      if (!this.countUp) return

      let aveCnt = 0

      if (this.tasks?.length && this.tasks[0]?.length) {
        const totalCnt = this.tasks[0].length
        let totalDays = 0

        this.tasks[0].forEach(
          t => (totalDays += getPropertyNumber(t, PROPS.work_date))
        )

        aveCnt = Math.round((totalDays * 100) / totalCnt) / 100
      }

      this.countUp.reset()
      this.countUp.update(aveCnt)
      this.countUp.start()
    }
  },
  watch: {
    isLoading(newVal) {
      if (newVal) return

      // 업무 목록이 변경되면 차트 변경 진행
      this.updateCount()
    }
  },
  mounted() {
    this.countUp = new CountUp(this.$refs.chart, 0, {
      decimalPlaces: 2,
      suffix: '일'
    })
  }
}
</script>
