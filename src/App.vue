<template>
  <section>
    <Loading />
    <SearchBar />
    <div class="aspect-video w-full">
      <cntChart />
    </div>
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
import Loading from '@/components/Loading'
import SearchBar from '@/components/SearchBar'
import cntChart from '@/components/cntChart'

export default {
  components: {
    Loading,
    SearchBar,
    cntChart
  },
  mounted() {
    this.$store.dispatch('notionTask/searchTaskDataBases')
  }
}
</script>
