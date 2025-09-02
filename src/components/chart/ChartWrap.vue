<template>
  <section ref="chart">
    <!-- 
      ✅ 해당 기간 총 처리 업무 개수 -> 게이지
      해당 기간 총 평균 작업 일자 -> 숫자
      ✅ 해당 기간 평가 별 총 처리 업무 개수 -> 파이
      ✅ 기간 단위, 분류별 처리 업무 개수 -> 바
      ✅ 기간 단위, 분류별 평균 작업 일자 -> 라인
      ✅ 기간 단위, 분류별 평균 평가 -> 육각
    -->
    <CntGaugeChart class="aspect-video w-full" />
    <RatePieChart class="aspect-video w-full" />
    <CntBarChart class="aspect-video w-full" />
    <AveLineChart class="aspect-video w-full" />
    <RateRadarChart class="aspect-video w-full" />
  </section>
</template>

<script>
import CntGaugeChart from '@/components/chart/CntGaugeChart'
import RatePieChart from '@/components/chart/RatePieChart'
import RateRadarChart from '@/components/chart/RateRadarChart'
import CntBarChart from '@/components/chart/CntBarChart'
import AveLineChart from '@/components/chart/AveLineChart'

export default {
  components: {
    CntGaugeChart,
    RatePieChart,
    RateRadarChart,
    CntBarChart,
    AveLineChart
  }
}
</script>
