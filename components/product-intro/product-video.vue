<template>
  <view class="product-video">
    <!-- 介绍视频区域 -->
    <view class="video-section">
      <video 
        class="intro-video"
        :src="videoUrl"
        controls
        show-center-play-btn
        show-play-btn
        :poster="videoPoster"
        object-fit="cover"
      ></video>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductVideo',
  props: {
    // 视频相关
    videoUrl: {
      type: String,
      default: 'https://fb.xiayingwenhua.xyz/uploads/intro-video.mp4'
    },
    videoPoster: {
      type: String,
      default: 'https://fb.xiayingwenhua.xyz/uploads/video-poster.jpg'
    }
  }
}
</script>

<style lang="scss" scoped>
.product-video {
  position: relative;
  width: 100%;
  
  // 视频区域样式
  .video-section {
    width: 100%;
    height: 400rpx;
    background-color: #000;
    
    .intro-video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>