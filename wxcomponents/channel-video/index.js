// 微信小程序视频号组件
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    feedId: {
      type: String,
      value: 'token/AIgQC4qCB'
    },
    finderUserName: {
      type: String,
      value: 'MoeXiao'
    },
    autoplay: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 组件内部数据
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 视频播放事件
     */
    onVideoPlay() {
      console.log('视频开始播放');
    },

    /**
     * 视频暂停事件
     */
    onVideoPause() {
      console.log('视频暂停播放');
    },

    /**
     * 视频结束事件
     */
    onVideoEnd() {
      console.log('视频播放结束');
    },

    /**
     * 视频错误事件
     */
    onVideoError(e) {
      console.error('视频播放错误:', e.detail);
      this.triggerEvent('error', e.detail);
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    /**
     * 组件实例进入页面节点树时执行
     */
    attached() {
      console.log('channel-video组件已加载');
    },

    /**
     * 组件实例被从页面节点树移除时执行
     */
    detached() {
      console.log('channel-video组件已卸载');
    }
  }
})