<template>
  <view class="container">
    <web-view :src="decodeURIComponent(url)" @message="handleMessage" />
  </view>
</template>

<script>
import * as YControlApi from '@/api/ycontrol'

export default {
  data() {
    return {
      url: '',
      shareInfo: {
        title: '福博寻宝',
        desc: '发现更多精彩内容',
        imageUrl: '/static/fbback.png'
      },
      // YControl分享信息
      ycontrolShareInfo: {
        title: null,
        imageUrl: null
      }
    }
  },
  onLoad(options) {
    this.url = options.url || ''
    // 获取分享信息
    this.getShareInfo()
    // 显示分享按钮
    uni.showShareMenu({
      withShareTicket: true
    })
  },
  methods: {
    /**
     * 监听webview消息
     */
    handleMessage(e) {
      console.log('收到webview消息:', e.detail.data)
      const data = e.detail.data[0] || {}
      
      // 如果webview发送分享信息，更新分享配置
      if (data.action === 'updateShare') {
        this.shareInfo = {
          title: data.title || this.shareInfo.title,
          desc: data.desc || this.shareInfo.desc,
          imageUrl: data.imageUrl || this.shareInfo.imageUrl
        }
      }
      
      // 如果webview请求分享，触发分享
      if (data.action === 'share') {
        this.triggerShare()
      }
    },
    
    /**
     * 触发分享
     */
    triggerShare() {
      uni.showShareMenu({
        withShareTicket: true,
        success: () => {
          console.log('分享菜单显示成功')
        },
        fail: (err) => {
          console.error('分享菜单显示失败:', err)
        }
      })
    },

    // 获取分享信息
    getShareInfo() {
      const app = this
      const path = "webview"
      YControlApi.getShareInfo({
        path
      }).then(result => {
        app.ycontrolShareInfo = result.data.data
      }).catch(err => {
        console.log('获取分享信息失败:', err)
        // 保持默认分享信息
      })
    }
  },
  
  /**
   * 分享给朋友
   */
  onShareAppMessage() {
    return {
      title: this.ycontrolShareInfo.title || this.shareInfo.title,
      desc: this.shareInfo.desc,
      path: `/pages/webview/webview?url=${encodeURIComponent(this.url)}`,
      imageUrl: this.ycontrolShareInfo.imageUrl || this.shareInfo.imageUrl
    }
  },
  
  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: this.ycontrolShareInfo.title || this.shareInfo.title,
      path: `/pages/webview/webview?url=${encodeURIComponent(this.url)}`,
      imageUrl: this.ycontrolShareInfo.imageUrl || this.shareInfo.imageUrl
    }
  }
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>