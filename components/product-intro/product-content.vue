<template>
  <view class="product-content">
    <!-- 富文本内容展示区域 -->
    <view class="content-section">
      <view class="content-title">
        <text>{{ contentTitle }}</text>
      </view>
      <view class="rich-content">
        <rich-text :nodes="richContent"></rich-text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductContent',
  props: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.product-content {
  background-color: #fff;
  margin-bottom: 20rpx;
}

// 内容区域样式
.content-section {
  padding: 20rpx;
  background-color: #fff;
  
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
</style>