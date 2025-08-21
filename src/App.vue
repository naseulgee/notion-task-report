<template>
  <section>
    <SearchBar />
    // 아래 분류별과 병합 출력 // 처리 업무 개수 -> 숫자 // 평균 작업 일자 ->
    숫자 // 평균 작업 평가 -> 표 // 분류별 처리 업무 개수 -> 막대
    https://echarts.apache.org/examples/en/editor.html?c=bar-y-category-stack //
    가능하면 폴리곤
    https://echarts.apache.org/examples/en/editor.html?c=bar-stack-normalization-and-variation
    // 분류별 평균 작업 일자 -> 라인
    https://echarts.apache.org/examples/en/editor.html?c=line-stack // 분류별
    평균 작업 평가 -> 표 // 표 클릭 시 // 조회 단위 앞뒤로 +2 비교 막대 그래프
  </section>
</template>

<script>
import SearchBar from '@/components/SearchBar'

export default {
  components: {
    SearchBar
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
    this.$store.dispatch('notionTask/searchTaskDataBases')
    /*
option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    data: [{value: 'Mon'}, 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
      name: "Total",
      type: 'custom',
      renderItem: function (params, api) {
        const yIndex = api.value(0);
        const sum = api.value(1);
        const coord = api.coord([sum, yIndex]);
        return {
          type: 'text',
          style: {
            text: sum.toString(),
            x: coord[0] + 10,
            y: coord[1] - 7.5,
            fill: '#000',
            font: 'bold 15px sans-serif'
          }
        };
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
        [6, 2570]  // Sun
      ]
    }
  ]
};


*/
  }
}
</script>
