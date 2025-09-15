<template>
  <section ref="chart">
    <article>
      <h1 :class="titleClass">이번달</h1>
      <div :class="chartWrapClass">
        <CntGaugeChart :class="chartClass" />
        <AveCountUp :class="chartClass" />
      </div>
    </article>

    <article>
      <h1 :class="titleClass">기간별</h1>
      <div :class="chartWrapClass">
        <RateRadarChart :class="chartClass" />
        <RatePieChart :class="chartClass" />
        <CntBarAveLineChart :class="chartClass" />
      </div>
    </article>
  </section>
</template>

<script>
import CntGaugeChart from '@/components/chart/CntGaugeChart'
import AveCountUp from '@/components/chart/AveCountUp'
import RateRadarChart from '@/components/chart/RateRadarChart'
import RatePieChart from '@/components/chart/RatePieChart'
import CntBarAveLineChart from '@/components/chart/CntBarAveLineChart'

export default {
  components: {
    CntGaugeChart,
    AveCountUp,
    RateRadarChart,
    RatePieChart,
    CntBarAveLineChart
  },
  data() {
    return {
      titleClass: 'text-center text-2xl font-bold',
      chartWrapClass: 'w-full flex flex-wrap justify-center items-center gap-4',
      chartClass: 'aspect-square h-[min(calc(45vh_-_35px),_400px)]'
    }
  },
  methods: {
    getClass(prefix, classList) {
      return classList.map(c => prefix + c).join(' ')
    }
  }
}
</script>
