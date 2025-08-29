<template>
  <section
    ref="chart"
    class="aspect-video w-full"
  >
    <CntGaugeChart
      @update-chart-option="updateChartOption"
      :chart-index="5"
    />
    <CntBarChart
      @update-chart-option="updateChartOption"
      :chart-index="3"
    />
    <AveLineChart
      @update-chart-option="updateChartOption"
      :chart-index="4"
    />
    숫자 // 평균 작업 평가 -> 표
    https://echarts.apache.org/examples/en/editor.html?c=bar-y-category-stack //
    // 분류별 평균 작업 일자 -> 라인
    https://echarts.apache.org/examples/en/editor.html?c=line-stack // 분류별
    평균 작업 평가 -> 표 // 표 클릭 시 // 조회 단위 앞뒤로 +2 비교 막대 그래프
  </section>
</template>

<script>
import * as echarts from 'echarts'
import CntGaugeChart from '@/components/chart/CntGaugeChart'
import CntBarChart from '@/components/chart/CntBarChart'
import AveLineChart from '@/components/chart/AveLineChart'

export default {
  components: {
    CntGaugeChart,
    CntBarChart,
    AveLineChart
  },
  data() {
    return {
      chart: null,
      chartOption: {
        tooltip: {
          trigger: 'item',
          axisPointer: { type: 'shadow', label: { show: true } }
        },
        legend: {},
        grid: [],
        xAxis: [],
        yAxis: [],
        series: []
        // grid: [
        //   { left: '0%', top: '0%', width: '0%' }, // 해당 기간 총 처리 업무 개수 -> 게이지
        //   { left: '0%', top: '0%', width: '0%' }, // 해당 기간 총 평균 작업 일자 -> 숫자
        //   { left: '0%', top: '0%', width: '0%' }, // 해당 기간 평가 별 총 처리 업무 개수 -> 파이
        //   { left: '0%', bottom: '0%', width: '0%' }, // 기간 단위, 분류별 처리 업무 개수 -> 바
        //   { left: '0%', bottom: '0%', width: '0%' }, // 기간 단위, 분류별 평균 작업 일자 -> 라인
        //   { left: '0%', bottom: '0%', width: '0%' } // 기간 단위, 분류별 평균 평가 -> 육각
        // ],
      },
      chartRowSize: 3,
      chartGap: 5,
      updatedChartCnt: 0
    }
  },
  computed: {
    tasks() {
      return this.$store.state.notionTask.taskList
    },
    lables() {
      return this.$store.state.notionTask.durationLabelList
    },
    categories() {
      return this.$store.state.notionTask.categoryList
    }
  },
  methods: {
    initChartOptions() {
      this.chartOption.grid.length = 0
      this.chartOption.xAxis.length = 0
      this.chartOption.yAxis.length = 0
      this.chartOption.series.length = 0
    },
    resizeChart() {
      this.chart?.resize()
    },
    updateChart() {
      this.chart?.setOption(this.chartOption)
    },
    updateGridPosition() {
      // 여백 계산
      const width = Math.ceil(
        (100 - this.chartGap * (this.chartOption.grid?.length || 0)) /
          this.chartRowSize
      )
      // 그리드 위치 세팅
      this.chartOption.grid?.forEach((g, i) => {
        const rowIndex = i % this.chartRowSize
        g.width = width + '%'
        g.left = (width + this.chartGap) * rowIndex + '%'
        if (i < this.chartRowSize) {
          g.top = '0%'
        } else {
          g.bottom = '0%'
        }
      })
    },
    updateChartOption(gridIndex, option) {
      if (!this.updatedChartCnt) this.initChartOptions()

      // 그리드 세팅
      this.chartOption.grid[gridIndex] = { containLabel: true }

      // X 좌표(가로) 라벨 세팅
      this.chartOption.xAxis[gridIndex] = { gridIndex, ...option.xAxis }
      // Y 좌표(세로) 라벨 세팅
      this.chartOption.yAxis[gridIndex] = { gridIndex, ...option.yAxis }

      // 시리즈 세팅
      option.series?.forEach(s => {
        s.xAxisIndex = gridIndex
        s.yAxisIndex = gridIndex
        s.tooltip = {
          formatter: params =>
            option.tooltipFormatter(params, this.chartOption.series)
        }
        this.chartOption.series.push(s)
      })

      this.updatedChartCnt++
    }
  },
  watch: {
    updatedChartCnt(newVal) {
      if (newVal < 3) return // FIXME:

      // 차트 출력
      this.updateGridPosition()
      this.updateChart(this.chartOption)

      // 플래그 리셋
      this.updatedChartCnt = 0
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.initChartOptions()
    window.addEventListener('resize', this.resizeChart)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>
