<template>
  <section>
    <canvas
      ref="chart"
      class="h-full w-full"
    ></canvas>
  </section>
</template>

<script>
import Chart from 'chart.js/auto'

/**
 * 기간 단위, 분류별 평균 평가 -> 육각
 */

let chart = null // NOTE: 차트 객체는 data 에서 관리하면 Proxy → Chart.js 내부 탐색 충돌 → 스택 오버플로우 발생

export default {
  data() {
    return {
      chartOption: {
        type: 'radar',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: '분류 평균 평가',
              color: '#000',
              font: { size: 18 }
            },
            legend: { position: 'bottom' }
          },
          scales: {
            r: {
              min: 0,
              max: 0,
              ticks: {
                stepSize: 1,
                z: 1,
                showLabelBackdrop: false,
                textStrokeWidth: 2,
                textStrokeColor: '#fff'
              }
            }
          }
        }
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
    categories() {
      return this.$store.state.notionTask.categoryCollection
    },
    ratings() {
      return this.$store.state.notionTask.ratingCollection
    }
  },
  methods: {
    resizeChart() {
      chart?.resize()
    },
    updateChart() {
      chart?.update()
    },
    setChartOption() {
      if (!chart) chart = new Chart(this.$refs.chart, this.chartOption)

      // ratings 배열 캐싱 (정렬/역순 포함)
      const ratingList = Object.values(this.ratings).sort(
        (a, b) => a.order - b.order
      )
      const ticks = [...ratingList].reverse().map(r => r.name)
      const ratingCount = ratingList.length

      // 단계 세팅
      chart.options.scales.r.max = ratingCount - 1
      chart.options.scales.r.ticks.callback = value => ticks[value] || value

      // 데이터 초기화 세팅
      chart.data.labels.length = 0
      chart.data.datasets = this.labels.map(l => ({
        label: l,
        data: Array(this.categories.length).fill(0),
        _point: Array(this.categories.length).fill(0),
        _cnt: Array(this.categories.length).fill(0)
      }))

      // 카테고리 별
      Object.values(this.categories).forEach((c, i) => {
        // 꼭지점 세팅
        chart.data.labels[i] = c.name

        // 각 기간 데이터 세팅
        this.labels.forEach((_, j) => {
          const dataset = chart.data.datasets[j]

          // 평가 점수 및 개수 세팅
          for (const rKey in this.ratings) {
            const { cnt, order } = c[rKey]
            const ratingPoint = order < 99 ? ratingCount - order - 1 : 0

            dataset._point[i] = (dataset._point[i] || 0) + cnt[j] * ratingPoint
            dataset._cnt[i] = (dataset._cnt[i] || 0) + cnt[j]
          }

          // 평균 평가 점수 세팅
          dataset.data[i] = dataset._cnt[i]
            ? Math.round(dataset._point[i] / dataset._cnt[i])
            : 0
        })
      })

      // 툴팁 세팅
      chart.options.plugins.tooltip = {
        mode: 'nearest',
        intersect: false,
        displayColors: false,
        filter: (_, i) => i == 0,
        callbacks: {
          label: context => {
            const { dataIndex } = context
            const tooltips = []

            chart.data.datasets.forEach(d => {
              tooltips.push(`${d.label}: ${ticks[d.data[dataIndex]]}`)
            })

            return tooltips
          }
        }
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
    window.addEventListener('resize', this.resizeChart)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>
