<template>
  <section ref="chart"></section>
</template>

<script>
import * as echarts from 'echarts'

/**
 * 기간 단위, 분류별 평균 평가 -> 육각
 */
export default {
  data() {
    return {
      chart: null,
      chartOption: {
        title: {
          text: 'Basic Radar Chart'
        },
        legend: {},
        radar: {
          indicator: [] // 각 지점 -> 평가
        },
        series: []
      }
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.notionTask.isLoading
    },
    tasks() {
      return this.$store.state.notionTask.taskList
    },
    ratings() {
      return this.$store.state.notionTask.ratingList
    },
    categories() {
      return this.$store.state.notionTask.categoryList
    }
  },
  methods: {
    resizeChart() {
      this.chart?.resize()
    },
    updateChart() {
      this.chart?.setOption(this.chartOption)
    },
    setChartOption() {
      if (this.tasks.length == 0) return
      this.chartOption.legend.data = this.categories.map(c => c.name)
      this.chartOption.indicator = this.ratings.map(r => ({ name: r }))
      // 단위 별 총 처리 업무 개수
      this.chartOption.series = [
        {
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: 'Allocated Budget'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: 'Actual Spending'
            }
          ]
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
