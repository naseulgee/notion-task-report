<template>
  <section>
    <Loading />
    <SearchBar />
    <ChartWrap />
  </section>
</template>

<script>
import Loading from '@/components/Loading'
import SearchBar from '@/components/SearchBar'
import ChartWrap from '@/components/chart/ChartWrap'

export default {
  components: {
    Loading,
    SearchBar,
    ChartWrap
  },
  mounted() {
    this.$store.dispatch('notionTask/searchTaskDataBases')
  }
}
</script>
