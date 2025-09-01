<template>
  <section ref="chart"></section>
</template>

<script>
import * as echarts from 'echarts'

/**
 * 해당 기간 평가 별 총 처리 업무 개수 -> 파이
 */
export default {
  data() {
    return {
      chart: null,
      chartOption: {
        tooltip: { trigger: 'item' },
        colorBy: 'series',
        legend: { top: '5%', left: 'center' },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'], // 내 / 외부 원 반지름
            padAngle: 5,
            itemStyle: { borderRadius: 10 },
            label: { show: false, position: 'center' },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            data: []
          }
        ]
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
      return this.$store.state.notionTask.ratingCollection
    },
    categories() {
      return this.$store.state.notionTask.categoryCollection
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
      const seriesData = this.chartOption.series[0].data
      Object.values(this.ratings).forEach((r, i) => {
        seriesData[i] = {
          name: r.name,
          value: r.cnt[0],
          itemStyle: { color: r.color, borderWidth: 5, borderColor: r.color }
        }
      })
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
