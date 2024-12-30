<template>
  <view class="diy-banner" :style="{ height: `${imgHeights[swiperIndex]}px` }">
    <!-- 图片轮播 -->
    <swiper :autoplay="autoplay" class="swiper-box" :duration="duration" :circular="true" :interval="itemStyle.interval * 1000"
      @change="onChangeItem">
      <swiper-item v-for="(dataItem, index) in dataList" :key="index">
        <image mode="widthFix" class="slide-image" :src="dataItem.imgUrl" @click="onLink(dataItem.link)" @load="onLoadImage" />
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="indicator-dots" :class="itemStyle.btnShape">
      <view class="dots-item" :class="{ active: swiperIndex == index }" :style="{ backgroundColor: itemStyle.btnColor }"
        v-for="(dataItem, index) in dataList" :key="index"></view>
    </view>
  </view>
</template>

<script>
  import mixin from '../mixin'

  export default {
    props: {
      itemIndex: String,
      itemStyle: Object,
      params: Object,
      dataList: Array
    },
    mixins: [mixin],
    data() {
      return {
        windowWidth: 750,
        indicatorDots: false, // 是否显示面板指示点
        autoplay: true, // 是否自动切换
        duration: 800, // 滑动动画时长
        imgHeights: [], // 图片的高度
        swiperIndex: 0 // 当前banne所在滑块指针
      }
    },
    created() {
      const { windowWidth } = uni.getSystemInfoSync()
      this.windowWidth = windowWidth > 750 ? 750 : windowWidth
    },
    methods: {
      // 计算图片高度
      onLoadImage({ detail }) {
        const app = this
        // 获取图片真实宽度
        const { width, height } = detail
        // 宽高比
        const ratio = width / height
        // 计算的高度值
        const viewHeight = app.windowWidth / ratio
        // 把每一张图片的高度记录到数组里
        app.imgHeights.push(viewHeight)
      },

      // 记录当前指针
      onChangeItem({ detail }) {
        this.swiperIndex = detail.current
      }
    }
  }
</script>

<style lang="scss" scoped>
  .diy-banner {
    position: relative;

    // swiper组件
    .swiper-box {
      height: 100%;

      .slide-image {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: block;
      }
    }

    // 指示点
    .indicator-dots {
      width: 100%;
      height: 28rpx;
      padding: 0 20rpx;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 20rpx;
      opacity: 0.8;
      display: flex;
      justify-content: center;

      .dots-item {
        width: 16rpx;
        height: 16rpx;
        margin-right: 8rpx;
        background-color: #fff;

        &:last-child {
          margin-right: 0;
        }

        &.active {
          background-color: #313131 !important;
        }
      }

      // 圆形
      &.round .dots-item {
        width: 16rpx;
        height: 16rpx;
        border-radius: 20rpx;
      }

      // 正方形
      &.square .dots-item {
        width: 16rpx;
        height: 16rpx;
      }

      // 长方形
      &.rectangle .dots-item {
        width: 22rpx;
        height: 14rpx;
      }
    }
  }
</style>