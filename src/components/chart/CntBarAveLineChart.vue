<template>
  <section ref="chart"></section>
</template>

<script>
import * as echarts from 'echarts'
import { PROPS, getPropertyNumber } from '@/utils/notionProps'

/**
 * 기간 단위, 분류별 처리 업무 개수 -> 바
 */
export default {
  data() {
    return {
      chart: null,
      chartOption: {
        tooltip: {
          trigger: 'item',
          axisPointer: { type: 'shadow', label: { show: true } }
        },
        legend: {},
        xAxis: [
          {
            name: '작업일',
            type: 'category',
            inverse: true,
            data: [],
            animation: true,
            splitLine: { show: true },
            splitArea: { show: true },
            axisPointer: { show: true, type: 'shadow' }
          }
        ],
        yAxis: [
          {
            name: '작업 수',
            type: 'value',
            minInterval: 1,
            splitLine: { show: false }, // y축 가이드 라인이 중복되어 제거
            axisLabel: { formatter: '{value} 개' }
          },
          {
            name: '소요일',
            type: 'value',
            minInterval: 0.5,
            boundaryGap: [0.5, 0.2], // 표시 범위 제한(상 / 하)
            axisLabel: { formatter: '{value} 일' }
          }
        ],
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
    labels() {
      return this.$store.state.notionTask.durationLabelList
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
      // 툴팁 생성 시 참고를 위한 변수 선언
      const labels = this.labels
      const series = this.chartOption.series
      const barZ = 0,
        lineZ = 1

      // xAxis 데이터(작업일) 설정
      this.chartOption.xAxis[0].data = labels

      // 단위 별 총 처리 업무 개수
      series.length = 0
      series.push({
        name: 'Total',
        type: 'bar',
        yAxisIndex: 0,
        z: barZ,
        label: { show: true },
        emphasis: { focus: 'series' },
        data: this.tasks?.map(task => task?.length || '')
      })
      series.push({
        name: 'Total',
        type: 'line',
        yAxisIndex: 1,
        z: lineZ + 1,
        label: { show: true },
        emphasis: { focus: 'series' },
        data: this.tasks?.map(task => {
          const totalCnt = task?.length || 0
          if (!totalCnt) return totalCnt

          let totalDays = 0
          task.forEach(
            t => (totalDays += getPropertyNumber(t, PROPS.work_date))
          )
          return Math.round((totalDays * 100) / totalCnt) / 100
        })
      })

      for (const cateKey in this.categories) {
        // 카테고리별 처리 업무 개수
        const category = this.categories[cateKey]
        series.push({
          name: category.name,
          type: 'bar',
          stack: 'category',
          yAxisIndex: 0,
          z: barZ,
          label: { show: true },
          itemStyle: { color: category.color },
          emphasis: { focus: 'series' },
          data: category.totalRating.map(r => r || '')
        })
        // 카테고리별 평균 소요일
        series.push({
          name: category.name,
          type: 'line',
          yAxisIndex: 1,
          z: lineZ,
          label: { show: true },
          itemStyle: { color: category.color },
          emphasis: { focus: 'series' },
          data: category['작업일자'].map(
            (d, i) => Math.round((d * 100) / category.totalRating[i]) / 100 || 0
          )
        })
      }

      this.chartOption.tooltip.formatter = params => {
        const { seriesName, seriesIndex, marker } = params
        let results = []

        // 동일 카테고리의 모든 기간 데이터 조회
        let seriesBarData, seriesLineData
        if (series[seriesIndex]?.type == 'bar') {
          seriesBarData = series[seriesIndex]?.data
          seriesLineData = series[seriesIndex + 1]?.data
        } else {
          seriesBarData = series[seriesIndex - 1]?.data
          seriesLineData = series[seriesIndex]?.data
        }

        labels.forEach((label, i) => {
          const emptyStyle = seriesBarData?.[i] ? '' : 'style="color: #ccc;"'

          results.push(`
            <span ${emptyStyle}>
              ${label} : ${seriesBarData?.[i] || 0} 개 (${seriesLineData?.[i] || 0} 일)
            </span>
            `)
        })
        results.push(marker + seriesName) // 카테고리명

        return results.reverse().join('<br>')
      }
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
