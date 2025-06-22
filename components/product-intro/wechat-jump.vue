<template>
  <view class="wechat-banner" @click="onJumpToWechat">
    <view class="banner-content">
      <view class="banner-left">
        <text class="iconfont icon-weixin"></text>
      </view>
      <view class="banner-text">
        <text class="banner-title">{{ title }}</text>
        <text class="banner-subtitle">{{ subtitle }}</text>
      </view>
      <view class="banner-right">
        <text class="banner-btn">{{ buttonText }}</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'WechatJump',
  props: {
    title: {
      type: String,
      default: '关注公众号'
    },
    subtitle: {
      type: String,
      default: '获取更多服务和优惠'
    },
    buttonText: {
      type: String,
      default: '去关注'
    },
    jumpUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    onJumpToWechat() {
      if (!this.jumpUrl) {
        uni.showToast({
          title: '跳转地址未配置',
          icon: 'none'
        })
        return
      }
      
      // #ifdef H5
      window.open(this.jumpUrl)
      // #endif
      
      // #ifdef APP-PLUS
      plus.runtime.openURL(this.jumpUrl)
      // #endif
      
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(this.jumpUrl)}`
      })
      // #endif
      
      // #ifndef H5 || APP-PLUS || MP-WEIXIN
      uni.setClipboardData({
        data: this.jumpUrl,
        success: () => {
          uni.showToast({
            title: '链接已复制',
            icon: 'success'
          })
        }
      })
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
.wechat-banner {
  background: linear-gradient(135deg, #07c160 0%, #1aad19 100%);
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(7, 193, 96, 0.3);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
  }
  
  .banner-content {
    display: flex;
    align-items: center;
    padding: 24rpx 30rpx;
    position: relative;
    z-index: 1;
  }
  
  .banner-left {
    margin-right: 20rpx;
    
    .icon-weixin {
      font-size: 48rpx;
      color: #ffffff;
    }
  }
  
  .banner-text {
    flex: 1;
    
    .banner-title {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: #ffffff;
      line-height: 1.2;
      margin-bottom: 4rpx;
    }
    
    .banner-subtitle {
      display: block;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.2;
    }
  }
  
  .banner-right {
    display: flex;
    align-items: center;
    
    .banner-btn {
      font-size: 26rpx;
      color: #ffffff;
      margin-right: 8rpx;
      font-weight: 500;
    }
    
    .icon-arrow-right {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  &:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}

@media (max-width: 750rpx) {
  .wechat-banner {
    margin: 15rpx;
    
    .banner-content {
      padding: 20rpx 24rpx;
    }
    
    .banner-left .icon-weixin {
      font-size: 44rpx;
    }
    
    .banner-text {
      .banner-title {
        font-size: 26rpx;
      }
      
      .banner-subtitle {
        font-size: 22rpx;
      }
    }
    
    .banner-right .banner-btn {
      font-size: 24rpx;
    }
  }
}
</style>