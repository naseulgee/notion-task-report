<template>
  <section ref="chart">
    <Loading />

    <article>
      <h1 :class="titleClass">{{ labels[0] }} 기준</h1>
      <div :class="chartWrapClass">
        <CntGaugeChart :class="chartClass" />
        <AveCountUp :class="chartClass" />
      </div>
    </article>

    <article>
      <h1 :class="titleClass">기간별</h1>
      <div :class="chartWrapClass">
        <CntBarAveLineChart :class="chartClass" />
        <RatePieChart :class="chartClass" />
        <RateRadarChart :class="chartClass" />
      </div>
    </article>
  </section>
</template>

<script>
import Loading from '@/components/Loading'
import CntGaugeChart from '@/components/chart/CntGaugeChart'
import AveCountUp from '@/components/chart/AveCountUp'
import CntBarAveLineChart from '@/components/chart/CntBarAveLineChart'
import RatePieChart from '@/components/chart/RatePieChart'
import RateRadarChart from '@/components/chart/RateRadarChart'

export default {
  components: {
    Loading,
    CntGaugeChart,
    AveCountUp,
    CntBarAveLineChart,
    RatePieChart,
    RateRadarChart
  },
  data() {
    return {
      titleClass: 'mb-8 text-center text-2xl font-bold',
      chartWrapClass: 'w-full flex flex-wrap justify-center items-center gap-4',
      chartClass:
        'aspect-square lg:h-[max(calc(45vh_-_70px),_400px)] max-lg:w-1/3 max-md:w-full'
    }
  },
  computed: {
    labels() {
      return this.$store.state.notionTask.durationLabelList
    }
  },
  methods: {
    getClass(prefix, classList) {
      return classList.map(c => prefix + c).join(' ')
    }
  }
}
</script>
