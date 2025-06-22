<template>
  <view class="product-intro">
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
    
    <!-- 富文本内容展示区域 -->
    <view class="content-section">
      <view class="content-title">
        <text>{{ contentTitle }}</text>
      </view>
      <view class="rich-content">
        <rich-text :nodes="richContent"></rich-text>
      </view>
    </view>
    
    <!-- 客服悬浮球 -->
    <view class="customer-service-float" @click="showCustomerService">
      <view class="float-icon">
        <text class="iconfont icon-kefu">{{ floatText }}</text>
      </view>
    </view>
    
    <!-- 客服弹窗 -->
    <view class="customer-modal" v-if="showServiceModal" @click="hideCustomerService">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ modalTitle }}</text>
          <view class="close-btn" @click="hideCustomerService">
            <text class="iconfont icon-close">×</text>
          </view>
        </view>
        <view class="modal-body">
          <view class="qr-section">
            <text class="qr-title">{{ qrTitle }}</text>
            <image 
              class="qr-image" 
              :src="qrCodeUrl" 
              mode="aspectFit"
              show-menu-by-longpress="true"
            ></image>
            <text class="save-tip">{{ saveTip }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductIntro',
  props: {
    // 视频相关
    videoUrl: {
      type: String,
      default: 'https://fb.xiayingwenhua.xyz/uploads/10001/20250524/a354294b436d884ee87ba30e1a7dd67d.mp4'
    },
    videoPoster: {
      type: String,
      default: ''
    },
    
    // 内容相关
    contentTitle: {
      type: String,
      default: '行程介绍'
    },
    richContent: {
      type: String,
      default: `
        <div style="padding: 20px; line-height: 1.6; color: #333;">
          <p style="margin-bottom: 10px;">这里是产品的详细介绍内容。您可以在后台管理系统中使用编辑器来编辑这部分内容。</p>
        </div>
      `
    },
    
    // 客服相关
    floatText: {
      type: String,
      default: '加群'
    },
    modalTitle: {
      type: String,
      default: '联系客服'
    },
    qrTitle: {
      type: String,
      default: '扫码进群咨询'
    },
    qrCodeUrl: {
      type: String,
      default: 'https://fb.xiayingwenhua.xyz/uploads/wechat-group-qr.jpg'
    },
    saveTip: {
      type: String,
      default: '长按识别二维码加入群聊'
    }
  },
  
  data() {
    return {
      showServiceModal: false // 客服弹窗显示状态
    }
  },
  
  methods: {
    /**
     * 显示客服弹窗
     */
    showCustomerService() {
      this.showServiceModal = true
      this.$emit('show-service')
    },

    /**
     * 隐藏客服弹窗
     */
    hideCustomerService() {
      this.showServiceModal = false
      this.$emit('hide-service')
    }
  }
}
</script>

<style lang="scss" scoped>
.product-intro {
  background-color: #fff;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
}

// 视频区域样式
.video-section {
  padding: 20rpx;
  background-color: #fff;
  order: 1;
  
  .intro-video {
    width: 100%;
    height: 400rpx;
    border-radius: 12rpx;
    overflow: hidden;
  }
}

// 内容区域样式
.content-section {
  padding: 20rpx;
  background-color: #fff;
  order: 999; // 设置为最大值，确保显示在最底部
  
  .content-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    padding-bottom: 10rpx;
    border-bottom: 2rpx solid #f0f0f0;
  }
  
  .rich-content {
    line-height: 1.6;
    color: #666;
  }
}

// 客服悬浮球样式
.customer-service-float {
  position: fixed;
  right: 30rpx;
  bottom: 200rpx;
  z-index: 999;
  
  .float-icon {
    width: 100rpx;
    height: 100rpx;
    background: linear-gradient(135deg, #e49a3d, #f4b942);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 20rpx rgba(228, 154, 61, 0.3);
    animation: float 3s ease-in-out infinite;
    
    text {
      color: #fff;
      font-size: 24rpx;
      font-weight: bold;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

// 客服弹窗样式
.customer-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .modal-content {
    width: 600rpx;
    background-color: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    animation: modalShow 0.3s ease-out;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 2rpx solid #f0f0f0;
    
    .modal-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .close-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      text {
        font-size: 40rpx;
        color: #999;
      }
    }
  }
  
  .modal-body {
    padding: 40rpx;
    
    .qr-section {
      text-align: center;
      
      .qr-title {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 30rpx;
        display: block;
      }
      
      .qr-image {
        width: 400rpx;
        height: 400rpx;
        border-radius: 12rpx;
        margin-bottom: 20rpx;
      }
      
      .save-tip {
        font-size: 24rpx;
        color: #999;
        display: block;
      }
    }
  }
}

@keyframes modalShow {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>