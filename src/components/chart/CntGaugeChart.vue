<template>
  <section ref="chart"></section>
</template>

<script>
import * as echarts from 'echarts'

/**
 * 해당 기간
 *  총 처리 업무 개수 -> 게이지
 */
export default {
  data() {
    return {
      chart: null,
      chartOption: {
        title: {
          text: '총 처리 업무 개수',
          top: 0
        },
        series: []
      },
      progressWidth: 18
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
    resizeChart() {
      this.chart?.resize()
      this.updateChart()
    },
    updateChart() {
      this.chart?.setOption(this.chartOption)
    },
    setChartOption() {
      if (this.tasks.length == 0) return
      // 차트 옵션 세팅
      let total = 0
      this.tasks.forEach((task, i) => (total += task.length || 0))
      total = Math.ceil(total / 10) * 10 // 게이지 눈금 표시를 정수로 하기 위한 세팅

      // 가로 사이즈 기반 폰트 크기 계산
      const w = this.$refs.chart.clientWidth
      const baseFont = Math.max(12, w * 0.03) // 최소 12px
      const detailFont = Math.max(20, w * 0.1) // 최소 20px

      // 단위 별 총 처리 업무 개수
      this.chartOption.series = [
        {
          type: 'gauge',
          min: 0,
          max: total || 10,
          progress: { show: true, width: this.progressWidth },
          axisLine: { lineStyle: { width: this.progressWidth } },
          axisTick: { show: false },
          axisLabel: { distance: 25, fontSize: baseFont },
          detail: {
            formatter: '{value}개',
            offsetCenter: [0, detailFont + 10],
            textBorderColor: '#fff',
            textBorderWidth: 2,
            fontSize: detailFont,
            valueAnimation: true
          },
          data: [{ value: this.tasks[0]?.length }]
        }
      ]
    }
  },
  watch: {
    isLoading(newVal) {
      if (newVal) return

      // 업무 목록이 변경되면 차트 변경 진행
      this.setChartOption()
      this.updateChart()
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    window.addEventListener('resize', this.resizeChart)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>
