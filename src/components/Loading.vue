<template>
  <div
    v-show="isLoading"
    class="absolute inset-0 z-50 flex flex-wrap content-center items-center justify-center gap-4 bg-black text-center text-white opacity-65"
  >
    <font-awesome-icon
      class="icon fa-spin-pulse text-4xl"
      icon="fa-solid fa-spinner"
    />
    <p class="w-full">
      Loading
      <span ref="dot"></span>
    </p>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      interval: null
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.notionTask.isLoading
    }
  },
  methods: {
    setDot(dotCnt) {
      let dot = ''
      for (let i = 0; i < dotCnt % 4; i++) {
        dot += '.'
      }
      this.$refs.dot.textContent = dot
    }
  },
  watch: {
    isLoading(newVal) {
      if (newVal) {
        let cnt = 1
        this.setDot(cnt++)
        this.interval = setInterval(() => {
          this.setDot(cnt++)
        }, 1000)
      } else {
        clearInterval(this.interval)
        this.$refs.dot.textContent = ''
      }
    }
  }
}
</script>
