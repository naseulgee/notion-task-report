<template>
  <section ref="chart"></section>
</template>

<script>
import * as echarts from 'echarts'

/**
 * 기간 단위 별
 *  평균 평가 개수 -> 파이
 */
export default {
  data() {
    return {
      chart: null,
      chartOption: {
        title: {
          text: '기간별 평균 평가 수',
          top: 0
        },
        tooltip: { trigger: 'item' },
        colorBy: 'series',
        legend: { type: 'scroll' },
        series: [],
        graphic: [] // 링 중앙 텍스트
      },
      seriesOption: {
        type: 'pie',
        stillShowZeroSum: false, // 전체 합이 0인 경우 차트 숨김
        radius: [0, 0], // 내 / 외부 원 반지름
        minAngle: 2, // 최소 각도(너비)
        padAngle: 5, // 각 데이터 간 간격
        itemStyle: { borderRadius: 10 },
        label: { show: false, position: 'center', fontWeight: 'bold' },
        emphasis: {
          focus: 'self',
          blurScope: 'global',
          label: { show: true, fontSize: 40 },
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.3)' }
        },
        data: []
      },
      graphicStyleOption: {
        text: '',
        stroke: '#fff',
        lineWidth: 3,
        fill: '#333',
        fontSize: 12,
        fontWeight: 'bold',
        align: 'right',
        verticalAlign: 'middle'
      },
      chartGap: 5, // 시리즈 간 간격
      legendNameSpace: 30 // 호버 시 범례 명 표시 공간
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
    },
    // 차트 크기 및 간격 계산
    labelMinCnt() {
      return this.labels.length < 4 ? 4 : this.labels.length
    },
    gapSpace() {
      return this.chartGap * (this.labelMinCnt + 1)
    },
    remainSpace() {
      return 100 - this.gapSpace - this.legendNameSpace
    },
    chartSize() {
      return Math.round((this.remainSpace * 100) / this.labelMinCnt) / 100
    }
  },
  methods: {
    resizeChart() {
      this.chart?.resize()
      this.setChartOption() // graphic 위치 때문에 옵션 재계산
      this.updateChart()
    },
    updateChart() {
      this.chart?.setOption(this.chartOption, true)
    },
    setChartOption() {
      // 툴팁 생성 시 참고를 위한 변수 선언
      const series = this.chartOption.series

      // 옵션 초기화
      series.length = 0
      this.chartOption.graphic.length = 0

      // 차트 크기 및 간격 계산
      this.labels.forEach((l, i) => {
        const data = []

        const spaceStart =
          (this.labels.length - 1 - i) * (this.chartSize + this.chartGap) +
          this.legendNameSpace
        const spaceEnd = spaceStart + this.chartSize

        // 평가 별 총 처리 업무 개수
        Object.values(this.ratings).forEach(r => {
          data.push({
            name: r.name,
            value: r.cnt[i],
            itemStyle: { color: r.color }
          })
        })
        series[i] = {
          ...this.seriesOption,
          name: l,
          radius: [`${spaceStart}%`, `${spaceEnd}%`],
          data
        }

        // 링 중앙 텍스트
        const w = this.chart.getWidth()
        const h = this.chart.getHeight()
        const cx = w / 2
        const cy = h / 2
        const base = Math.min(w, h) / 2 // 반지름 px 변환 기준

        const rInnerPx = base * (spaceStart / 100)
        const rOuterPx = base * (spaceEnd / 100)
        const rLabelPx = rInnerPx + (rOuterPx - rInnerPx) * 0.5 // 링 중간 지점

        this.chartOption.graphic.push({
          type: 'text',
          position: [cx, cy - rLabelPx],
          zlevel: 1,
          style: { ...this.graphicStyleOption, text: l }
        })
      })

      this.chartOption.tooltip.formatter = params => {
        const { name, dataIndex, marker } = params
        const results = []

        results.push(marker + name) // 카테고리명
        series.forEach(s => {
          const seriesData = s.data?.[dataIndex]
          const emptyStyle = seriesData.value > 0 ? '' : 'style="color: #ccc;"'
          results.push(`
            <span ${emptyStyle}>
              ${s.name} : ${seriesData.value || 0} 개
            </span>
            `)
        })

        return results.join('<br>')
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
