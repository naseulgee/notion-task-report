<template>
  <section
    ref="chart"
    class="h-full w-full"
  ></section>
</template>

<script>
import * as echarts from 'echarts'

export default {
  components: {},
  data() {
    return {
      chart: null
    }
  },
  computed: {
    taskList() {
      return this.$store.state.notionTask.taskList
    }
  },
  methods: {
    setOption() {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        series: [
          {
            name: 'Direct',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: 'Mail Ad',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Affiliate Ad',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ad',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          },
          {
            name: 'Search Engine',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
          },
          // 👇 총합 텍스트 표시용 커스텀 시리즈
          {
            name: 'Total',
            type: 'custom',
            renderItem: function (params, api) {
              const yIndex = api.value(0)
              const sum = api.value(1)
              const coord = api.coord([sum, yIndex])
              return {
                type: 'text',
                style: {
                  text: sum.toString(),
                  x: coord[0] + 10,
                  y: coord[1] - 7.5,
                  fill: '#000',
                  font: 'bold 15px sans-serif'
                }
              }
            },
            encode: {
              x: 1,
              y: 0
            },
            data: [
              [0, 1630], // Mon
              [1, 1660], // Tue
              [2, 1695], // Wed
              [3, 1790], // Thu
              [4, 2250], // Fri
              [5, 2550], // Sat
              [6, 2570] // Sun
            ]
          }
        ]
      }
      this.chart.setOption(option)
    }
  },
  watch: {
    taskList() {
      this.setOption()
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
  }
}
</script>
