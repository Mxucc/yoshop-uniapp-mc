<template>
  <view class="container" :style="appThemeStyle">
    <Page :items="items" />
    <u-popup ref="imagePopup" mode="center" :safe-area-inset-bottom="false" background-color="transparent" :custom-style="{padding:0}" :closeable="true" close-icon="close" close-icon-pos="top-right" close-icon-color="#ffffff" :close-icon-size="36" :border-radius="16" @close="closeImagePopup">
      <image :src="imageUrl" mode="widthFix" style="width: 600rpx; border-radius: 12rpx;" @click="onTargetHome"/>
    </u-popup>
    <!-- #ifdef MP-WEIXIN -->
    <PrivacyPopup :hideTabBar="true" />
    <!-- #endif -->
  </view>
</template>

<script>
import { setCartTabBadge } from '@/core/app'
import * as Api from '@/api/page'
import Page from '@/components/page'
import PrivacyPopup from '@/components/privacy-popup'
import uPopup from '@/uni_modules/vk-uview-ui/components/u-popup/u-popup.vue'

const App = getApp()

export default {
  components: {
    Page,
    PrivacyPopup,
    uPopup
  },
  data() {
    return {
      options: {},
      page: {},
      items: [],
      imageUrl: '/static/pop1.png'
    }
  },
  onLoad(options) {
    this.options = options
    this.getPageData()
  },
  onReady() {
    // const hasShown = uni.getStorageSync('hasShownPopup')
    // if (!hasShown && this.$refs.imagePopup) {
      this.$refs.imagePopup.open()
      // uni.setStorageSync('hasShownPopup', true)
    // }
  },
  onShow() {
    setCartTabBadge()
  },
  methods: {
    closeImagePopup() {
      if (this.$refs.imagePopup) {
        this.$refs.imagePopup.close()
      }
    },
    onTargetHome() {
      this.$navTo('pages/coupon/index')
    },
    getPageData(callback) {
      const app = this
      const pageId = app.options.pageId || 0
      Api.detail(pageId)
        .then(result => {
          const { data: { pageData } } = result
          app.page = pageData.page
          app.items = pageData.items
          app.setPageBar()
        })
        .finally(() => callback && callback())
    },
    setPageBar() {
      const { page } = this
      uni.setNavigationBarTitle({
        title: page.params.title
      })
      uni.setNavigationBarColor({
        frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
        backgroundColor: page.style.titleBackgroundColor
      })
    }
  },
  onPullDownRefresh() {
    this.getPageData(() => {
      uni.stopPullDownRefresh()
    })
  },
  onShareAppMessage() {
    const app = this
    const { page } = app
    return {
      title: page.params.shareTitle,
      path: "/pages/index/index?" + app.$getShareUrlParams()
    }
  },
  onShareTimeline() {
    const app = this
    const { page } = app
    return {
      title: page.params.shareTitle,
      path: "/pages/index/index?" + app.$getShareUrlParams()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #fff;
}
::v-deep .u-mode-center-box {
  background-color: rgba(0, 0, 0, 0) !important;
  box-shadow: none !important;
}
</style>