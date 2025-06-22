<script>
  import store from '@/store'
  import StoreModel from '@/common/model/Store'
  import { getSceneData, checkLogin } from './core/app'
  import { isObject } from './utils/util'
  import { setupRouterGuard } from './core/permission'

  export default {

    /**
     * 全局变量
     */
    globalData: {
      // 导航栏相关信息
      statusBarHeight: 0, // 状态栏高度
      navBarHeight: 0, // 导航栏高度
      menuBottom: 0, // 胶囊距底部间距（顶部间距也是这个）
      menuHeight: 0, // 胶囊高度
      menuRight: 0, // 胶囊距右边距离
      menuWidth: 0 // 胶囊宽度
    },

    /**
     * 初始化完成时触发
     */
    onLaunch({ path, query, scene }) {
      // #ifdef MP
      // 小程序主动更新
      this.updateManager()
      // 计算导航栏信息
      this.calcNavBarInfo()
      // #endif
      // app启动参数
      this.onStartupQuery(isObject(query) ? query : {})
      // 获取商城基础信息
      this.getStoreInfo()
      // 设置路由拦截器
      setupRouterGuard()
      
      // 检查登录状态但不强制跳转
      checkLogin()
    },

    methods: {

      // app启动参数
      onStartupQuery(query) {
        // 获取二维码场景值
        // const scene = getSceneData(query)
      },

      // 获取商城基础信息
      getStoreInfo() {
        StoreModel.data(false)
      },

      /**
       * 计算导航栏信息
       */
      calcNavBarInfo() {
        // #ifdef MP-WEIXIN
        try {
          // 获取系统信息
          const systemInfo = uni.getSystemInfoSync();
          // 胶囊按钮位置信息
          const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
          
          // 状态栏高度
          this.globalData.statusBarHeight = systemInfo.statusBarHeight;
          // 胶囊高度
          this.globalData.menuHeight = menuButtonInfo.height;
          // 胶囊宽度
          this.globalData.menuWidth = menuButtonInfo.width;
          // 胶囊距右方间距
          this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
          // 胶囊距底部间距
          this.globalData.menuBottom = menuButtonInfo.top - systemInfo.statusBarHeight;
          // 导航栏高度 = 状态栏到胶囊的间距（胶囊上坐标位置-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
          this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
        } catch (e) {
          // 获取失败时使用默认值
          const systemInfo = uni.getSystemInfoSync();
          this.globalData.statusBarHeight = systemInfo.statusBarHeight;
          
          // 根据平台设置默认值
          if (systemInfo.platform === 'ios') {
            this.globalData.menuHeight = 32;
            this.globalData.menuBottom = 4;
            this.globalData.navBarHeight = systemInfo.statusBarHeight + 40;
          } else {
            this.globalData.menuHeight = 32;
            this.globalData.menuBottom = 8;
            this.globalData.navBarHeight = systemInfo.statusBarHeight + 48;
          }
        }
        // #endif
      },

      // 小程序主动更新
      updateManager() {
        const updateManager = uni.getUpdateManager()
        updateManager.onCheckForUpdate(res => {
          // 请求完新版本信息的回调
          // console.log(res.hasUpdate)
        })
        updateManager.onUpdateReady(() => {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，即将重启应用',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(() => {
          // 新的版本下载失败
          uni.showModal({
            title: '更新提示',
            content: '新版本下载失败',
            showCancel: false
          })
        })
      }

    }

  }
</script>

<style lang="scss">
  /* uView库样式 */
  @import "./uni_modules/vk-uview-ui/index.scss";
  /* 项目基础样式 */
  @import "./app.scss";
  /* iconfont图标库 */
  @import "./utils/iconfont.scss";
</style>