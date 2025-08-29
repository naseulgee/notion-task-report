<script>
/**
 * 기간 단위, 분류별 평균 작업 일자 -> 라인
 */
export default {
  emits: ['updateChartOption'],
  props: {
    chartIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chartOption: {
        xAxis: {
          name: '',
          type: 'category',
          data: [],
          splitLine: { show: true },
          splitArea: { show: true },
          axisPointer: { show: true, type: 'shadow' }
        },
        yAxis: { name: '', type: 'value', interval: 0.5 },
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
    lables() {
      return this.$store.state.notionTask.durationLabelList
    },
    categories() {
      return this.$store.state.notionTask.categoryList
    }
  },
  methods: {
    setChartOption() {
      // 툴팁 생성 시 참고를 위한 변수 선언
      const labels = [...this.lables].reverse()

      // 차트 옵션 세팅
      this.chartOption.xAxis.data = labels
      this.chartOption.series.length = 0
      // 카테고리별 처리 업무 개수
      for (const category of this.categories) {
        this.chartOption.series.push({
          name: category.name,
          type: 'line',
          label: { show: true },
          itemStyle: { color: category.color },
          emphasis: { focus: 'series' },
          data: category['작업일자']
            .map(
              (d, i) =>
                Math.round((d * 100) / category.totalRating[i]) / 100 || 0
            )
            .reverse()
        })
      }

      this.chartOption.tooltipFormatter = (params, series) => {
        const { seriesName, seriesIndex, marker } = params
        let results = []

        // 동일 카테고리의 모든 기간 데이터 조회
        const seriesData = series[seriesIndex]?.data
        labels.forEach((label, i) => {
          results.push(`${label} : ${seriesData[i] || 0}일`)
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
      this.$emit('updateChartOption', this.chartIndex, this.chartOption)
    }
  }
}
</script>
