<template>
  <section
    ref="chart"
    class="grid w-full grid-cols-3 gap-4 overflow-hidden max-lg:grid-cols-2 max-md:grid-cols-1"
  >
    <CntGaugeChart class="aspect-square w-full" />
    <!-- 
      해당 기간 총 평균 작업 일자 -> 숫자
      -->
    <RateRadarChart class="aspect-square w-full" />
    <RatePieChart class="aspect-square w-full" />
    <CntBarAveLineChart class="aspect-square w-full" />
  </section>
</template>

<script>
import CntGaugeChart from '@/components/chart/CntGaugeChart'
import RateRadarChart from '@/components/chart/RateRadarChart'
import RatePieChart from '@/components/chart/RatePieChart'
import CntBarAveLineChart from '@/components/chart/CntBarAveLineChart'

export default {
  components: {
    CntGaugeChart,
    RateRadarChart,
    RatePieChart,
    CntBarAveLineChart
  }
}
</script>
