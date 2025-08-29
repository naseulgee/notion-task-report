<script>
/**
 * 기간 단위, 분류별 처리 업무 개수 -> 바
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
      progressWidth: 18,
      chartOption: {
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
      // 차트 옵션 세팅
      let total = 0
      this.tasks.forEach((task, i) => (total += task.length || 0))
      // 단위 별 총 처리 업무 개수
      this.chartOption.series = [
        {
          type: 'gauge',
          min: 0,
          max: total,
          progress: { show: true, width: this.progressWidth },
          axisLine: { lineStyle: { width: this.progressWidth } },
          axisTick: { show: false },
          axisLabel: { distance: 25, fontSize: 20 },
          detail: {
            valueAnimation: true,
            fontSize: 80,
            offsetCenter: [0, '65%']
          },
          data: [
            {
              name: '총 처리 업무 수',
              value: this.tasks[0]?.length
            }
          ]
        }
      ]
      console.log(this.chartOption.series[0].data.value)

      this.chartOption.tooltipFormatter = (params, series) => {
        // const { seriesName, seriesIndex, marker } = params
        // let results = []
        // // 동일 카테고리의 모든 기간 데이터 조회
        // const seriesData = series[seriesIndex]?.data
        // labels.forEach((label, i) => {
        //   results.push(`${label} : ${seriesData[i] || 0}`)
        // })
        // results.push(marker + seriesName) // 카테고리명
        // return results.reverse().join('<br>')
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
