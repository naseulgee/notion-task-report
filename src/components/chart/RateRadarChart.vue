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
        tooltip: { trigger: 'item' },
        legend: {},
        radar: { axisLabel: { show: true, hideOverlap: true } },
        series: [{ type: 'radar', data: [] }]
      }
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.notionTask.isLoading
    },
    labels() {
      return this.$store.state.notionTask.durationLabelList
    },
    ratings() {
      return this.$store.state.notionTask.ratingCollection
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
      const ratings = Object.values(this.ratings)
      let max = 0

      // 평가 별 총 처리 업무 개수
      const seriesData = []
      this.labels.forEach((l, i) => {
        const initArray = Array.from({ length: ratings.length }, () => 0)
        ratings.forEach((r, j) => {
          initArray[j] += r.cnt[i]
          max = Math.max(max, ...r.cnt)
        })
        seriesData[i] = {
          name: l,
          value: initArray,
          areaStyle: {}
        }
      })
      this.chartOption.series[0].data = seriesData

      // 꼭지점 세팅 -> 평가
      this.chartOption.radar.indicator = ratings.map(r => ({
        name: r.name,
        color: r.color,
        max: Math.ceil(max / 10) * 10 // 눈금 표시를 정수로 하기 위한 세팅
      }))
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
