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
    globalData: {},

    /**
     * 初始化完成时触发
     */
    onLaunch({ path, query, scene }) {
      // #ifdef MP
      // 小程序主动更新
      this.updateManager()
      // #endif
      // app启动参数
      this.onStartupQuery(isObject(query) ? query : {})
      // 获取商城基础信息
      this.getStoreInfo()
      // 设置路由拦截器
      setupRouterGuard()
      
      // 立即检查登录状态
      if (!checkLogin()) {
        // 如果未登录，直接重定向到登录页
        uni.reLaunch({
          url: '/pages/login/index'
        })
        return
      }
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