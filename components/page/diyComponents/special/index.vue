<template>
  <!-- 头条快报 -->
  <view class="diy-special" :style="{ padding: `${itemStyle.paddingTop * 2}rpx 0`, background: itemStyle.background }">
    <view class="special-left" @click="handleNavMore()">
      <image class="image" mode="widthFix" :src="params.image" />
    </view>
    <div class="special-content" :class="[`display_${params.display}`]">
      <swiper :autoplay="true" :interval="1500" :duration="800" :circular="true" :vertical="true"
        :display-multiple-items="itemStyle.display">
        <swiper-item v-for="(dataItm, idx) in dataList" :key="idx">
          <view class="content-item oneline-hide" @click="handleNavDetail(dataItm.article_id)">
            <text :style="{ color: itemStyle.textColor }">{{ dataItm.title }}</text>
          </view>
        </swiper-item>
      </swiper>
    </div>
    <div class="special-more" @click="handleNavMore()">
      <text class="iconfont icon-arrow-right"></text>
    </div>
  </view>
</template>

<script>
  import mixin from '../mixin'

  export default {

    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    props: {
      itemIndex: String,
      itemStyle: Object,
      params: Object,
      dataList: Array
    },

    mixins: [mixin],

    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {

      // 跳转到文章详情页
      handleNavDetail(articleId) {
        this.$navTo('pages/article/detail', { articleId })
      },

      // 跳转到更多
      handleNavMore() {
        this.$navTo('pages/article/index')
      }

    }

  }
</script>

<style lang="scss" scoped>
  // diy-头条快报
  .diy-special {
    display: flex;
    align-items: center;
    line-height: normal;

    .special-left {
      padding: 10rpx 20rpx;

      .image {
        display: block;
        width: 140rpx;
      }
    }

    .special-content {
      flex: 1;
      overflow: hidden;

      .content-item {
        padding: 4rpx 0;
        font-size: 13px;
        color: #141414;
      }

      &.display_1 {
        height: 44rpx;
      }

      &.display_2 {
        height: 88rpx;
      }
    }

    .special-more {
      padding: 24rpx 20rpx;
      font-size: 24rpx;
    }
  }
</style>
