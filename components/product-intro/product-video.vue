<template>
  <view class="product-video">
    <!-- 介绍视频区域 -->
    <view class="video-section">
      <!-- 视频号组件 -->
      <channel-video v-if="isVideoChannel"
        :feed-id="feedId"
        :finder-user-name="finderUserName"
        :autoplay="false"
        class="channel-video"
      ></channel-video>
      
      <!-- 普通视频组件 -->
      <video v-else
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
    },
    isVideoChannel: {
      type: Boolean,
      default: false
    },
    // 视频号相关属性
    feedId: {
      type: String,
      default: 'token/AGzpDeQXN'
    },
    finderUserName: {
      type: String,
      default: 'MoeXiao'
    }
  },
  data() {
    return {
      // 组件内部状态
    }
  },
  methods: {
    // 视频号错误处理
    onChannelVideoError(e) {
      console.error('视频号播放错误:', e.detail);
      // 可以在这里添加错误处理逻辑，比如显示错误提示或回退到普通视频
      this.$emit('video-error', e.detail);
    },
    
    // 视频号播放事件
    onChannelVideoPlay() {
      console.log('视频号开始播放');
      this.$emit('video-play');
    },
    
    // 视频号暂停事件
    onChannelVideoPause() {
      console.log('视频号暂停播放');
      this.$emit('video-pause');
    },
    
    // 视频号结束事件
    onChannelVideoEnd() {
      console.log('视频号播放结束');
      this.$emit('video-end');
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
    
    .intro-video,
    .channel-video {
      width: 100%;
      height: 100%;
      border-radius: 8rpx;
    }
    
    .intro-video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>