<template>
  <view class="container" v-if="!isLoading">
    <view class="space-upper">
      <view class="wallet-image">
        <image class="image" src="/static/wallet.png"></image>
      </view>
      <view class="wallet-account">
        <view class="wallet-account_balance">
          <text>{{ userInfo.balance }}</text>
        </view>
        <view class="wallet-account_lable">
          <text>账户余额(元)</text>
        </view>
      </view>
    </view>
    <view class="space-lower">
      <view v-if="setting.is_entrance" class="space-lower_item btn-recharge">
        <view class="btn-submit" @click="onTargetRecharge()">充 值</view>
      </view>
      <view class="space-lower_item item-lable dis-flex flex-x-around">
        <view class="lable-text" @click="onTargetRechargeOrder()">
          <text>充值记录</text>
        </view>
        <view class="lable-text" @click="onTargetBalanceLog()">
          <text>账单详情</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import * as UserApi from '@/api/user'
  import SettingModel from '@/common/model/Setting'
  import SettingKeyEnum from '@/common/enum/setting/Key'

  export default {
    data() {
      return {
        // 正在加载
        isLoading: true,
        // 会员信息
        userInfo: {},
        // 充值设置
        setting: {},
      }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      // 获取页面数据
      this.getPageData()
    },

    methods: {

      // 获取页面数据
      getPageData() {
        const app = this
        app.isLoading = true
        Promise.all([app.getUserInfo(), app.getSetting()])
          .then(() => app.isLoading = false)
      },

      // 获取会员信息
      getUserInfo() {
        const app = this
        return new Promise((resolve, reject) => {
          UserApi.info()
            .then(result => {
              app.userInfo = result.data.userInfo
              resolve(app.userInfo)
            })
        })
      },

      // 获取充值设置
      getSetting() {
        const app = this
        return new Promise((resolve, reject) => {
          SettingModel.item(SettingKeyEnum.RECHARGE.value, false)
            .then(data => {
              app.setting = data
              resolve(data)
            })
        })
      },

      // 跳转充值页面
      onTargetRecharge() {
        this.$navTo('pages/wallet/recharge/index')
      },

      // 跳转充值记录页面
      onTargetRechargeOrder() {
        this.$navTo('pages/wallet/recharge/order')
      },

      // 跳转账单详情页面
      onTargetBalanceLog() {
        this.$navTo('pages/wallet/balance/log')
      }

    }
  }
</script>
<style>
  page {
    background: #fff;
  }
</style>
<style lang="scss" scoped>
  .container {
    background: #fff;
  }

  .space-upper {
    padding: 150rpx 0;
    text-align: center;
  }

  .wallet-image .image {
    width: 360rpx;
    height: 260rpx;
  }

  .wallet-account {
    margin-top: 20rpx;
  }

  .wallet-account_balance {
    font-size: 56rpx;
  }

  .wallet-account_lable {
    margin-top: 14rpx;
    color: #cec1c1;
    font-size: 26rpx;
  }

  .space-lower {
    margin-top: 30rpx;
    padding: 0 110rpx;
  }

  .btn-recharge .btn-submit {
    width: 460rpx;
    height: 84rpx;
    margin: 0 auto;
    border-radius: 50rpx;
    background: #786cff;
    color: white;
    font-size: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-lable {
    margin-top: 80rpx;
    font-size: 28rpx;
    color: rgb(94, 94, 94);
    padding: 0 100rpx;
  }
</style>
