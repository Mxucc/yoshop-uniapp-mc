<template>
  <view class="container">
    <web-view :src="decodeURIComponent(url)" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  onLoad(options) {
    this.url = options.url || ''
  }
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>