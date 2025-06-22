<template>
  <!-- 单图组 -->
  <view class="diy-imageSingle" :style="{ paddingBottom: `${itemStyle.paddingTop * 2}rpx`, background: itemStyle.background }">
    <view class="item-image" v-for="(dataItem, index) in dataList" :key="index" :style="{ padding: `${itemStyle.paddingTop * 2}rpx ${itemStyle.paddingLeft * 2}rpx 0` }">
      <view class="nav-to">
        <image class="image" @click="handleImageClick(dataItem, index)" :src="dataItem.imgUrl" mode="widthFix" :show-menu-by-longpress="true"></image>
      </view>
    </view>
  </view>
</template>

<script>
  import mixin from '../mixin'

  export default {
    name: "Images",

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

    data() {
      return {
        clickTimer: null,
        lastClickTime: 0,
        clickCount: 0
      }
    },

    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {
      /**
       * 处理图片点击事件（支持单击和双击）
       */
      handleImageClick(dataItem, index) {
        const currentTime = Date.now()
        const timeDiff = currentTime - this.lastClickTime
        
        // 清除之前的定时器
        if (this.clickTimer) {
          clearTimeout(this.clickTimer)
          this.clickTimer = null
        }
        
        // 如果两次点击间隔小于400ms，认为是双击
        if (timeDiff < 400 && this.clickCount === 1) {
          this.clickCount = 0
          this.lastClickTime = 0
          // 执行双击事件：预览图片
          this.previewImage(dataItem.imgUrl, index)
        } else {
          // 第一次点击或间隔时间过长
          this.clickCount = 1
          this.lastClickTime = currentTime
          
          // 设置延时执行单击事件
          this.clickTimer = setTimeout(() => {
            if (this.clickCount === 1) {
              // 执行单击事件：链接跳转
              this.onLink(dataItem.link)
            }
            this.clickCount = 0
            this.lastClickTime = 0
            this.clickTimer = null
          }, 400)
        }
      },

      /**
       * 预览图片
       */
      previewImage(current, index) {
        const urls = this.dataList.map(item => item.imgUrl)
        uni.previewImage({
          current: current,
          urls: urls
        })
      }
    }

  }
</script>

<style lang="scss" scoped>
  .diy-imageSingle .item-image .image {
    display: block;
    width: 100%;
  }
</style>
