<template>
  <section>
    <SearchBar />
    <ChartWrap class="relative mt-4" />
  </section>
</template>

<script>
import SearchBar from '@/components/SearchBar'
import ChartWrap from '@/components/chart/ChartWrap'

export default {
  components: {
    SearchBar,
    ChartWrap
  },
  mounted() {
    this.$store.dispatch('notionTask/searchTaskDataBases')
  }
}
</script>
