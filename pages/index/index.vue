<template>
  <view class="container" :style="appThemeStyle">
    <!-- 自定义标题栏 -->
    <view class="custom-header" :style="{height: navBarHeight + 'px'}">
      <!-- 背景图片层 -->
      <image src="/static/fbhead.png" class="header-bg"/>
      
      <!-- 状态栏占位 -->
      <view class="status-bar" :style="{height: statusBarHeight + 'px'}"></view>
      
      <!-- 导航内容区域 -->
      <view class="nav-content" :style="{height: menuHeight + 'px', marginTop: menuBottom + 'px', marginBottom: menuBottom + 'px'}">
        <!-- Logo区域 -->
        <view class="logo-section" :style="{marginRight: menuWidth + menuRight + 'px'}">
          <text class="logo-text">福博寻宝</text>
        </view>
      </view>
      
      <!-- 搜索区域 -->
      <view class="search-section-wrapper">
        <view class="search-bar">
          <view class="search-section" @click="onTargetSearch">
            <text class="search-icon iconfont icon-search"></text>
            <text class="search-placeholder">搜索商品</text>
          </view>
        </view>
      </view>
    </view>
    
    <Page :items="items" />
    <u-popup 
    ref="imagePopup" 
    mode="center" :safe-area-inset-bottom="false" background-color="transparent"
     :custom-style="{padding:0}" :closeable="true" close-icon="close" close-icon-pos="top-right" close-icon-color="#ffffff" 
     :close-icon-size="60" :border-radius="16" @close="closeImagePopup">
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
      imageUrl: '/static/pop1.png',
      statusBarHeight: 0,
      navBarHeight: 0,
      menuBottom: 0,
      menuHeight: 0,
      menuRight: 0,
      menuWidth: 0
    }
  },
  onLoad(options) {
    this.options = options
    this.getPageData()
    
    // 获取全局导航栏信息
    const app = getApp()
    this.statusBarHeight = app.globalData.statusBarHeight
    this.navBarHeight = app.globalData.navBarHeight
    this.menuBottom = app.globalData.menuBottom
    this.menuHeight = app.globalData.menuHeight
    this.menuRight = app.globalData.menuRight
    this.menuWidth = app.globalData.menuWidth
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
    /**
     * 计算导航栏信息
     */
    calcNavBarInfo() {
      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      
      // 获取胶囊按钮位置信息
      let menuButtonInfo = {}
      
      // 兼容处理：iOS设备胶囊按钮信息固定，Android设备需要动态获取
      if (systemInfo.platform === 'ios') {
        // iOS设备的胶囊按钮都是固定的
        menuButtonInfo = {
          width: 87,
          height: 32,
          top: systemInfo.statusBarHeight + 4,
          right: systemInfo.windowWidth - 7,
          bottom: systemInfo.statusBarHeight + 4 + 32,
          left: systemInfo.windowWidth - 7 - 87
        }
      } else {
        // Android设备动态获取
        try {
          menuButtonInfo = uni.getMenuButtonBoundingClientRect()
          // 如果获取失败，使用默认值
          if (!menuButtonInfo || menuButtonInfo.width === 0) {
            menuButtonInfo = {
              width: 87,
              height: 32,
              top: systemInfo.statusBarHeight + 4,
              right: systemInfo.windowWidth - 7,
              bottom: systemInfo.statusBarHeight + 4 + 32,
              left: systemInfo.windowWidth - 7 - 87
            }
          }
        } catch (error) {
          // 获取失败时使用默认值
          menuButtonInfo = {
            width: 87,
            height: 32,
            top: systemInfo.statusBarHeight + 4,
            right: systemInfo.windowWidth - 7,
            bottom: systemInfo.statusBarHeight + 4 + 32,
            left: systemInfo.windowWidth - 7 - 87
          }
        }
      }
      
      // 计算导航栏各部分尺寸
      // 导航栏高度 = 状态栏到胶囊的间距 * 2 + 胶囊高度 + 状态栏高度
      this.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight
      // 胶囊距离顶部的间距（状态栏和胶囊之间的间距）
      this.menuBottom = menuButtonInfo.top - systemInfo.statusBarHeight
      // 胶囊高度
      this.menuHeight = menuButtonInfo.height
      // 胶囊右边距
      this.menuRight = systemInfo.windowWidth - menuButtonInfo.right
      // 胶囊宽度
      this.menuWidth = menuButtonInfo.width
    },
    closeImagePopup() {
      if (this.$refs.imagePopup) {
        this.$refs.imagePopup.close()
      }
    },
    onTargetHome() {
      this.$navTo('pages/coupon/index')
    },
    /**
     * 跳转到搜索页面
     */
    onTargetSearch() {
      this.$navTo('pages/search/index')
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

.custom-header {
  position: relative;
  overflow: hidden;
  width: 100%;
  
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  .status-bar {
    position: relative;
    z-index: 2;
  }
  
  .nav-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    
    .logo-section {
      display: flex;
      align-items: center;
      flex: 1;
      
      .logo-text {
        font-size: 32rpx;
        font-weight: bold;
        color: #ffffff;
        text-shadow: 2rpx 2rpx 4rpx rgba(0, 0, 0, 0.3);
        letter-spacing: 2rpx;
      }
    }
  }

  .search-section-wrapper {
    position: relative;
    z-index: 2;
    padding: 0 30rpx 30rpx;
  }
}

.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 0rpx;
  
  .search-section {
    flex: 1;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:active {
      opacity: 0.7;
    }
    
    .search-icon {
      margin-right: 15rpx;
      font-size: 28rpx;
      color: #999;
    }
    
    .search-placeholder {
      font-size: 28rpx;
      color: #999;
      flex: 1;
    }
  }
}

/* 为了让内容不被导航栏遮挡，给Page组件添加上边距 */
::v-deep .page-box {
  margin-top: v-bind(navBarHeight + 'px');
}

::v-deep .u-mode-center-box {
  background-color: rgba(0, 0, 0, 0) !important;
  box-shadow: none !important;
}
</style>