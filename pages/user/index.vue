<template>
  <view v-if="!isFirstload" class="container" :style="appThemeStyle">
    <!-- 页面头部 -->
    <view class="main-header" :style="{ height: platform == 'H5' ? '260rpx' : '320rpx', paddingTop: platform == 'H5' ? '0' : '80rpx' }">
      <image class="bg-image" src="/static/background/user-header2.png" mode="scaleToFill"></image>
      <!-- 用户信息 -->
      <view v-if="isLogin" class="user-info">
        <view class="user-avatar" @click="handlePersonal()">
          <avatar-image :url="userInfo.avatar_url" :width="100" />
        </view>
        <view class="user-content">
          <!-- 会员昵称 -->
          <view class="nick-name oneline-hide" @click="handlePersonal()">{{ userInfo.nick_name }}</view>
          <!-- 会员等级 -->
          <view v-if="$checkModule('user-grade') && userInfo.grade_id > 0 && userInfo.grade" class="user-grade">
            <view class="user-grade_icon">
              <image class="image"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA0lBMVEUAAAD/tjL/tzH/uDP/uC7/tjH/tzH/tzL/tTH+tTL+tjP/tDD/tTD+tzD/tjL/szD/uDH/tjL/tjL+tjD/tjT/szb/tzL/tTL+uTH+tjL/tjL/tjL/tTT/tjL/tjL+tjH/uTL/vDD/tjL/tjH/tzL9uS//tTL/nBr/sS7/tjH/ujL/szD/uTv+rzf/tzL+tzH+vDP+uzL+tjP+ry7+tDL9ki/7szf/sEX/tTL/tjL+tjL/tTH/tTT/tzH/tzL/tjP/sTX/uTP/wzX+rTn/vDX9vC8m8ckhAAAAOXRSTlMAlnAMB/vjxKWGMh0S6drMiVxPRkEY9PLy0ru0sKagmo5+dGtgVCMgBP716eXWyMGxqJGRe2o5KSmFNjaYAAABP0lEQVQ4y8XS13KDMBAF0AWDDe4t7r3ETu9lVxJgJ/n/X8rKAzHG5TE+Twz3zki7I/g/KXdghIbGJewrU4yzn08Ebgl6TuZzzuOC6W5es3HX6qsSz3NFShRU0MpucytDmOSpu3yULx3CA9RD1HjVedc0jSjqm6ZzhUjDsFDQhSp/OKj5GQvg0+ZCOixsbtDLAeTTOm/yGi8GyIphIVsgH737FEDV44LJa88IRKK/SetrwT9G/GUIr6vXjoy4GXn7+RboVXnghuSjaoGecwQxL2su3CwAKlO+QFoqxI4FMctHQhQd2OhxTu184jWUlI+rMTBTn1/IQcJHQ6GQdZ7pWiDaNdhTt330efISeiqYwQEzQpTlsURJLhzkEmpCPsERfeIUVyXr6MNuIyp5uziW6xURtt7hhGwzmMNJExfO4Bd9X0ZPqAxdNwAAAABJRU5ErkJggg==">
              </image>
            </view>
            <view class="user-grade_name">
              <text>{{ userInfo.grade.name }}</text>
            </view>
          </view>
          <!-- 会员无等级时显示手机号 -->
          <view v-else class="mobile">{{ userInfo.mobile }}</view>
        </view>
      </view>
      <!-- 未登录 -->
      <view v-else class="user-info" @click="handleLogin">
        <view class="user-avatar">
          <avatar-image :width="100" />
        </view>
        <view class="user-content">
          <view class="nick-name">未登录</view>
          <view class="login-tips">点击登录账号</view>
        </view>
      </view>
    </view>

    <!-- 绑定手机号 -->
    <view v-if="isLogin && !userInfo.mobile && setting[SettingKeyEnum.REGISTER.value].isManualBind" class="my-mobile"
      @click="handleBindMobile()">
      <view class="info">点击绑定手机号，确保账户安全</view>
      <view class="btn-bind">去绑定</view>
    </view>

    <!-- 我的钱包 -->
    <view v-if="$checkModules(['market-recharge', 'market-points', 'market-coupon'])" class="my-asset">
      <view class="asset-left flex-box dis-flex flex-x-around">
        <view v-if="$checkModule('market-recharge')" class="asset-left-item" style="max-width: 200rpx;" @click="onTargetWallet">
          <view class="item-value dis-flex flex-x-center">
            <text class="oneline-hide">{{ isLogin ? assets.balance : '--' }}</text>
          </view>
          <view class="item-name dis-flex flex-x-center">
            <text>账户余额</text>
          </view>
        </view>
        <view v-if="$checkModule('market-points')" class="asset-left-item" @click="onTargetPoints">
          <view class="item-value dis-flex flex-x-center">
            <text class="oneline-hide">{{ isLogin ? assets.points : '--' }}</text>
          </view>
          <view class="item-name dis-flex flex-x-center">
            <text>{{ setting[SettingKeyEnum.POINTS.value].points_name }}</text>
          </view>
        </view>
        <view v-if="$checkModule('market-coupon')" class="asset-left-item" @click="onTargetMyCoupon">
          <view class="item-value dis-flex flex-x-center">
            <text class="oneline-hide">{{ isLogin ? assets.coupon : '--' }}</text>
          </view>
          <view class="item-name dis-flex flex-x-center">
            <text>优惠券</text>
          </view>
        </view>
      </view>
      <view v-if="$checkModule('market-recharge')" class="asset-right">
        <view class="asset-right-item" @click="onTargetWallet">
          <view class="item-icon dis-flex flex-x-center">
            <text class="iconfont icon-qianbao"></text>
          </view>
          <view class="item-name dis-flex flex-x-center">
            <text>我的钱包</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 绑定手机号 (第2种样式) -->
    <!-- <view class="my-mobile2" @click="handleBindMobile()">
      <view class="info">点击绑定手机号，确保账户安全</view>
      <view class="btn-bind">去绑定</view>
    </view> -->

    <!-- 订单操作 -->
    <view class="order-navbar">
      <view class="order-navbar-item" v-for="(item, index) in orderNavbar" :key="index" @click="onTargetOrder(item)">
        <view class="item-icon">
          <text class="iconfont" :class="[`icon-${item.icon}`]"></text>
        </view>
        <view class="item-name">{{ item.name }}</view>
        <view class="item-badge" v-if="item.count && item.count > 0">
          <text v-if="item.count <= 99" class="text">{{ item.count }}</text>
          <text v-else class="text">99+</text>
        </view>
      </view>
    </view>

    <!-- 我的服务 -->
    <view class="my-service">
      <view class="service-title">我的服务</view>
      <view class="service-content clearfix">
        <block v-for="(item, index) in service" :key="index">
          <view v-if="item.type == 'link' && item.enabled" class="service-item" @click="handleService(item)">
            <view class="item-icon">
              <text class="iconfont" :class="[`icon-${item.icon}`]"></text>
            </view>
            <view class="item-name">{{ item.name }}</view>
            <view class="item-badge" v-if="item.count && item.count > 0">
              <text v-if="item.count <= 99" class="text">{{ item.count }}</text>
              <text v-else class="text">99+</text>
            </view>
          </view>
          <!-- 在线客服 -->
          <view v-if="item.type == 'contact' && item.enabled" class="service-item">
            <customer-btn>
              <view class="item-icon">
                <text class="iconfont" :class="[`icon-${item.icon}`]"></text>
              </view>
              <view class="item-name">{{ item.name }}</view>
            </customer-btn>
          </view>
        </block>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="isLogin" class="my-logout">
      <view class="logout-btn" @click="handleLogout()">
        <text>退出登录</text>
      </view>
    </view>

  </view>
</template>

<script>
  import store from '@/store'
  import { inArray } from '@/utils/util'
  import AvatarImage from '@/components/avatar-image'
  import CustomerBtn from '@/components/customer-btn'
  import { setCartTabBadge } from '@/core/app'
  import SettingKeyEnum from '@/common/enum/setting/Key'
  import StoreModel from '@/common/model/Store'
  import SettingModel from '@/common/model/Setting'
  import * as UserApi from '@/api/user'
  import * as OrderApi from '@/api/order'
  import { checkLogin, filterModules } from '@/core/app'

  // 订单操作
  const orderNavbar = [
    { id: 'all', name: '全部订单', icon: 'qpdingdan' },
    { id: 'payment', name: '待支付', icon: 'daifukuan', count: 0 },
    { id: 'delivery', name: '待发货', icon: 'daifahuo', count: 0 },
    { id: 'received', name: '待收货', icon: 'daishouhuo', count: 0 },
  ]

  /**
   * 我的服务
   * id: 标识; name: 标题名称; icon: 图标; type 类型(link和button); url: 跳转的链接
   */
  const service = [
    { id: 'address', name: '收货地址', icon: 'shouhuodizhi', type: 'link', url: 'pages/address/index' },
    { id: 'coupon', name: '领券中心', icon: 'lingquan', type: 'link', url: 'pages/coupon/index', moduleKey: 'market-coupon' },
    { id: 'myCoupon', name: '优惠券', icon: 'youhuiquan', type: 'link', url: 'pages/my-coupon/index', moduleKey: 'market-coupon' },
    { id: 'refund', name: '退换/售后', icon: 'shouhou', type: 'link', url: 'pages/refund/index', count: 0 },
    { id: 'contact', name: '在线客服', icon: 'kefu', type: 'contact' },
    { id: 'points', name: '我的积分', icon: 'jifen', type: 'link', url: 'pages/points/log', moduleKey: 'market-points' },
    { id: 'orderCenter', name: '订单中心', icon: 'order-c', type: 'link', url: 'pages/order/center' },
    { id: 'help', name: '我的帮助', icon: 'bangzhu', type: 'link', url: 'pages/help/index', moduleKey: 'content-help' },
  ]

  export default {
    components: {
      AvatarImage,
      CustomerBtn
    },
    data() {
      return {
        inArray,
        // 枚举类
        SettingKeyEnum,
        // 正在加载
        isLoading: true,
        // 首次加载
        isFirstload: true,
        // 是否已登录
        isLogin: false,
        // 系统设置
        setting: {},
        // 当前用户信息
        userInfo: {},
        // 账户资产
        assets: { balance: '--', points: '--', coupon: '--' },
        // 我的服务
        service,
        // 订单操作
        orderNavbar,
        // 当前用户待处理的订单数量
        todoCounts: { payment: 0, deliver: 0, received: 0 }
      }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onLoad(options) {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.onRefreshPage()
    },

    methods: {

      // 刷新页面
      onRefreshPage() {
        // 更新购物车角标
        setCartTabBadge()
        // 判断是否已登录
        this.isLogin = checkLogin()
        // 获取页面数据
        this.getPageData()
      },

      // 获取页面数据
      getPageData(callback) {
        const app = this
        app.isLoading = true
        Promise.all([app.getSetting(), app.getUserInfo(), app.getUserAssets(), app.getTodoCounts()])
          .then(result => {
            app.isFirstload = false
            // 初始化我的服务数据
            app.initService()
            // 初始化订单操作数据
            app.initOrderTabbar()
            // 执行回调函数
            callback && callback()
          })
          .catch(err => console.log('catch', err))
          .finally(() => app.isLoading = false)
      },

      // 初始化我的服务数据
      async initService() {
        const app = this
        const isShowCustomerBtn = await SettingModel.isShowCustomerBtn()
        const newService = []
        service.forEach(item => {
          // 默认开启
          item.enabled = true
          // 我的积分
          if (item.id === 'points') {
            item.name = '我的' + app.setting[SettingKeyEnum.POINTS.value].points_name
          }
          // 企业微信客服
          if (item.id === 'contact' && !isShowCustomerBtn) {
            item.enabled = false
          }
          // 数据角标
          if (item.count != undefined) {
            item.count = app.todoCounts[item.id]
          }
          newService.push(item)
        })
        app.service = filterModules(newService)
      },

      // 初始化订单操作数据
      initOrderTabbar() {
        const app = this
        const newOrderNavbar = []
        orderNavbar.forEach(item => {
          if (item.count != undefined) {
            item.count = app.todoCounts[item.id]
          }
          newOrderNavbar.push(item)
        })
        app.orderNavbar = newOrderNavbar
      },

      // 获取商城设置
      getSetting() {
        const app = this
        return new Promise((resolve, reject) => {
          SettingModel.data()
            .then(setting => {
              app.setting = setting
              resolve(setting)
            })
            .catch(reject)
        })
      },

      // 获取当前用户信息
      getUserInfo() {
        const app = this
        return new Promise((resolve, reject) => {
          !app.isLogin ? resolve(null) : UserApi.info({}, { load: app.isFirstload })
            .then(result => {
              app.userInfo = result.data.userInfo
              resolve(app.userInfo)
            })
            .catch(err => {
              if (err.result && err.result.status == 401) {
                app.isLogin = false
                resolve(null)
              } else {
                reject(err)
              }
            })
        })
      },

      // 获取账户资产
      getUserAssets() {
        const app = this
        return new Promise((resolve, reject) => {
          !app.isLogin ? resolve(null) : UserApi.assets({}, { load: app.isFirstload })
            .then(result => {
              app.assets = result.data.assets
              resolve(app.assets)
            })
            .catch(err => {
              if (err.result && err.result.status == 401) {
                app.isLogin = false
                resolve(null)
              } else {
                reject(err)
              }
            })
        })
      },

      // 获取当前用户待处理的订单数量
      getTodoCounts() {
        const app = this
        return new Promise((resolve, reject) => {
          !app.isLogin ? resolve(null) : OrderApi.todoCounts({}, { load: app.isFirstload })
            .then(result => {
              app.todoCounts = result.data.counts
              resolve(app.todoCounts)
            })
            .catch(err => {
              if (err.result && err.result.status == 401) {
                app.isLogin = false
                resolve(null)
              } else {
                reject(err)
              }
            })
        })
      },

      // 跳转到登录页
      handleLogin() {
        !this.isLogin && this.$navTo('pages/login/index')
      },

      // 跳转到绑定手机号页面
      handleBindMobile() {
        this.$navTo('pages/user/bind/index')
      },

      // 跳转到修改个人信息页
      handlePersonal() {
        this.$navTo('pages/user/personal/index')
      },

      // 退出登录
      handleLogout() {
        const app = this
        uni.showModal({
          title: '友情提示',
          content: '您确定要退出登录吗?',
          success(res) {
            if (res.confirm) {
              store.dispatch('Logout', {})
                .then(result => app.onRefreshPage())
            }
          }
        })
      },

      // 跳转到钱包页面
      onTargetWallet() {
        this.$navTo('pages/wallet/index')
      },

      // 跳转到订单页
      onTargetOrder(item) {
        this.$navTo('pages/order/index', { dataType: item.id })
      },

      // 跳转到我的积分页面
      onTargetPoints() {
        this.$navTo('pages/points/log')
      },

      // 跳转到我的优惠券页
      onTargetMyCoupon() {
        this.$navTo('pages/my-coupon/index')
      },

      // 跳转到服务页面
      handleService({ url }) {
        this.$navTo(url)
      }

    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
      // 获取首页数据
      this.getPageData(() => {
        uni.stopPullDownRefresh()
      })
    },


  }
</script>

<style lang="scss" scoped>
  .container {
    padding-bottom: 60rpx;
  }

  // 页面头部
  .main-header {
    // background-color: #FBF7EF;
    position: relative;
    width: 100%;
    height: 280rpx;
    background-size: 100% 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding-left: 30rpx;

    .bg-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .user-info {
      display: flex;
      height: 100rpx;
      z-index: 1;

      .user-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 30rpx;
        color: #c59a46;

        .nick-name {
          font-size: 34rpx;
          font-weight: bold;
          max-width: 300rpx;
        }

        .mobile {
          margin-top: 15rpx;
          font-size: 28rpx;
        }

        .user-grade {
          align-self: baseline;
          display: flex;
          align-items: center;
          background: #3c3c3c;
          margin-top: 12rpx;
          border-radius: 10rpx;
          padding: 4rpx 12rpx;

          .user-grade_icon .image {
            display: block;
            width: 32rpx;
            height: 32rpx;
          }

          .user-grade_name {
            margin-left: 5rpx;
            font-size: 26rpx;
            color: #EEE0C3;
          }

        }

        .login-tips {
          margin-top: 12rpx;
          font-size: 30rpx;
        }

      }
    }
  }

  // 角标组件
  .item-badge {
    position: absolute;
    top: 0;
    right: 55rpx;
    // background: $main-bg;
    background: #fa2209;
    color: #fff;
    border-radius: 100%;
    min-width: 38rpx;
    height: 38rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rpx;
    font-size: 24rpx;
  }

  // 我的钱包
  .my-asset {
    display: flex;
    background: #fff;
    padding: 40rpx 0;

    .asset-right {
      width: 200rpx;
      border-left: 1rpx solid #eee;
    }

    .asset-right-item {
      text-align: center;
      color: #545454;

      .item-icon {
        font-size: 44rpx;
      }

      .item-name {
        margin-top: 14rpx;
        font-size: 28rpx;
      }

    }

    .asset-left-item {
      max-width: 183rpx;
      text-align: center;
      color: #666;
      padding: 0 16rpx;

      .item-value {
        font-size: 34rpx;
        color: $main-bg;
      }

      .item-name {
        margin-top: 14rpx;
        font-size: 28rpx;
      }

    }

  }

  // 订单操作
  .order-navbar {
    display: flex;
    margin: 20rpx auto 20rpx auto;
    padding: 20rpx 0 26rpx 0;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    font-size: 30rpx;
    border-radius: 5rpx;
    background: #fff;

    &-item {
      position: relative;
      width: 25%;

      .item-icon {
        text-align: center;
        margin: 0 auto;
        padding: 10rpx 0;
        color: #545454;
        font-size: 44rpx;
      }

      .item-name {
        font-size: 28rpx;
        color: #545454;
        text-align: center;
        margin-right: 10rpx;
      }

    }
  }

  // 我的服务
  .my-service {
    margin: 22rpx auto 22rpx auto;
    padding: 22rpx 0;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 5rpx;
    background: #fff;

    .service-title {
      padding-left: 24rpx;
      margin-bottom: 20rpx;
      font-size: 30rpx;
    }

    .service-content {

      margin-bottom: -20rpx;

      .service-item {
        position: relative;
        width: 25%;
        float: left;
        margin-bottom: 30rpx;

        .item-icon {
          text-align: center;
          margin: 0 auto;
          padding: 14rpx 0;
          color: $main-bg;
          font-size: 44rpx;
        }

        .item-name {
          font-size: 28rpx;
          color: #545454;
          text-align: center;
        }

      }
    }
  }

  // 退出登录
  .my-logout {
    display: flex;
    justify-content: center;
    margin-top: 50rpx;

    .logout-btn {
      width: 60%;
      margin: 0 auto;
      font-size: 28rpx;
      color: #616161;
      border-radius: 20rpx;
      border: 1px solid #dcdcdc;
      padding: 16rpx 0;
      text-align: center;
    }
  }

  // 绑定手机号 样式1
  .my-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx 40rpx;
    background: #FCEBD1;

    .info {
      color: #cd8c0c;
      font-size: 28rpx;
    }

    .btn-bind {
      padding: 8rpx 24rpx;
      background-color: #EAB766;
      color: #fff;
      border-radius: 30rpx;
      font-size: 26rpx;
      text-align: center;
    }
  }

  // 绑定手机号 样式2
  .my-mobile2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20rpx auto 20rpx auto;
    padding: 12rpx 40rpx;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    font-size: 30rpx;
    border-radius: 5rpx;
    background: #fff;

    .info {
      // color: #cd8c0c;
      font-size: 26rpx;
    }

    .btn-bind {
      padding: 8rpx 24rpx;
      background-color: #EAB766;
      color: #fff;
      border-radius: 30rpx;
      font-size: 26rpx;
      text-align: center;
    }
  }
</style>