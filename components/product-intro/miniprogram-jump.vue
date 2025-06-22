<template>
  <view class="miniprogram-banner" @click="onJumpToMiniProgram">
    <view class="banner-content">
      <view class="banner-left">
        <image src="/static/miniprogram-icon.svg" class="miniprogram-icon" mode="aspectFit"></image>
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
  name: 'MiniprogramJump',
  props: {
    title: {
      type: String,
      default: '打开小程序'
    },
    subtitle: {
      type: String,
      default: '获取更多服务和优惠'
    },
    buttonText: {
      type: String,
      default: '去打开'
    },
    appId: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    envVersion: {
      type: String,
      default: 'release' // release, trial, develop
    },
    extraData: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onJumpToMiniProgram() {
      if (!this.appId) {
        uni.showToast({
          title: '小程序AppID未配置',
          icon: 'none'
        })
        return
      }
      
      // #ifdef MP-WEIXIN
      uni.navigateToMiniProgram({
        appId: this.appId,
        path: this.path,
        envVersion: this.envVersion,
        extraData: {
          ...this.extraData,
          from: 'goods-detail'
        },
        success: (res) => {
          console.log('跳转小程序成功', res)
        },
        fail: (err) => {
          console.error('跳转小程序失败', err)
          uni.showToast({
            title: '跳转失败',
            icon: 'none'
          })
        }
      })
      // #endif
      
      // #ifndef MP-WEIXIN
      uni.showToast({
        title: '仅支持微信小程序环境',
        icon: 'none'
      })
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
.miniprogram-banner {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(24, 144, 255, 0.3);
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
    
    .miniprogram-icon {
      color: #ffffff;
      width: 62rpx;
      height: 62rpx;
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
  .miniprogram-banner {
    margin: 15rpx;
    
    .banner-content {
      padding: 20rpx 24rpx;
    }
    
    .banner-left .miniprogram-icon {
      width: 44rpx;
      height: 44rpx;
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