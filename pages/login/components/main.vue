<template>
  <view class="container">

    <view>
      <image src="/static/fbimg.png" class="login_header"/>
    </view>
     <view>
      <image src="/static/fbtext.png" class="text_header"/>
    </view>
   <!-- 页面头部 -->
    <view class="header">
      <view class="title">
        <text>手机号登录</text>
      </view>
      <view class="sub-title">
        <text>未注册的手机号登录后将自动注册</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="login-form">
      <!-- 手机号 -->
      <view class="form-item">
        <input class="form-item--input" type="number" v-model="mobile" maxlength="11" placeholder="请输入手机号码" />
      </view>
      <!-- 图形验证码 -->
      <view class="form-item">
        <input class="form-item--input" type="text" v-model="captchaCode" maxlength="5" placeholder="请输入图形验证码" />
        <view class="form-item--parts">
          <view class="captcha" @click="getCaptcha()">
            <image class="image" :src="captcha.base64"></image>
          </view>
        </view>
      </view>
      <!-- 短信验证码 -->
      <view class="form-item">
        <input class="form-item--input" type="number" v-model="smsCode" maxlength="6" placeholder="请输入短信验证码" />
        <view class="form-item--parts">
          <view class="captcha-sms" @click="handelSmsCaptcha()">
            <text v-if="!smsState" class="activate">获取验证码</text>
            <text v-else class="un-activate">重新发送({{ times }})秒</text>
          </view>
        </view>
      </view>
      <!-- 登录按钮 -->
      <view class="login-button" :class="{ disabled }" @click="handleLogin()">
        <text>登录</text>
      </view>
    </view>

    <!-- 微信授权手机号一键登录 -->
    <!-- #ifdef MP-WEIXIN -->
    <MpWeixinMobile v-if="isMpWeixinMobile" :isParty="isParty" :partyData="partyData" />
    <!-- #endif -->

  </view>
</template>

<script>
  import store from '@/store'
  import * as CaptchaApi from '@/api/captcha'
  import * as Verify from '@/utils/verify'
  import MpWeixinMobile from './mp-weixin-mobile'

  // 倒计时时长(秒)
  const times = 60

  // 表单验证场景
  const GET_CAPTCHA = 10
  const SUBMIT_LOGIN = 20

  export default {
    components: {
      MpWeixinMobile
    },

    props: {
      // 是否存在第三方用户信息
      isParty: {
        type: Boolean,
        default: () => false
      },
      // 第三方用户信息数据
      partyData: {
        type: Object
      },
      // 是否显示微信小程序端 一键授权手机号
      isMpWeixinMobile: {
        type: Boolean,
        default: () => false
      },
    },

    data() {
      return {
        // 正在加载
        isLoading: false,
        // 按钮禁用
        disabled: false,
        // 图形验证码信息
        captcha: {},
        // 短信验证码发送状态
        smsState: false,
        // 倒计时
        times,
        // 手机号
        mobile: '',
        // 图形验证码
        captchaCode: '',
        // 短信验证码
        smsCode: ''
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    created() {
      // 获取图形验证码
      this.getCaptcha()
    },

    methods: {

      // 获取图形验证码
      getCaptcha() {
        const app = this
        CaptchaApi.image()
          .then(result => app.captcha = result.data)
      },

      // 点击发送短信验证码
      handelSmsCaptcha() {
        const app = this
        if (!app.isLoading && !app.smsState && app.formValidation(GET_CAPTCHA)) {
          app.sendSmsCaptcha()
        }
      },

      // 表单验证
      formValidation(scene = GET_CAPTCHA) {
        const app = this
        // 验证获取短信验证码
        if (scene === GET_CAPTCHA) {
          if (!app.validteMobile(app.mobile) || !app.validteCaptchaCode(app.captchaCode)) {
            return false
          }
        }
        // 验证提交登录
        if (scene === SUBMIT_LOGIN) {
          if (!app.validteMobile(app.mobile) || !app.validteSmsCode(app.smsCode)) {
            return false
          }
        }
        return true
      },

      // 验证手机号
      validteMobile(str) {
        if (Verify.isEmpty(str)) {
          this.$toast('请先输入手机号')
          return false
        }
        if (!Verify.isMobile(str)) {
          this.$toast('请输入正确格式的手机号')
          return false
        }
        return true
      },

      // 验证图形验证码
      validteCaptchaCode(str) {
        if (Verify.isEmpty(str)) {
          this.$toast('请先输入图形验证码')
          return false
        }
        return true
      },

      // 验证短信验证码
      validteSmsCode(str) {
        if (Verify.isEmpty(str)) {
          this.$toast('请先输入短信验证码')
          return false
        }
        return true
      },

      // 请求发送短信验证码接口
      sendSmsCaptcha() {
        const app = this
        app.isLoading = true
        CaptchaApi.sendSmsCaptcha({
            form: {
              captchaKey: app.captcha.key,
              captchaCode: app.captchaCode,
              mobile: app.mobile
            }
          })
          .then(result => {
            // 显示发送成功
            app.$toast(result.message)
            // 执行定时器
            app.timer()
          })
          .catch(() => app.getCaptcha())
          .finally(() => app.isLoading = false)
      },

      // 执行定时器
      timer() {
        const app = this
        app.smsState = true
        const inter = setInterval(() => {
          app.times = app.times - 1
          if (app.times <= 0) {
            app.smsState = false
            app.times = times
            clearInterval(inter)
          }
        }, 1000)
      },

      // 点击登录
      handleLogin() {
        const app = this
        if (!app.isLoading && !app.disabled && app.formValidation(SUBMIT_LOGIN)) {
          app.submitLogin()
        }
      },

      // 确认登录
      submitLogin() {
        const app = this
        app.isLoading = true
        app.disabled = true
        store.dispatch('Login', {
            smsCode: app.smsCode,
            mobile: app.mobile,
            isParty: app.isParty,
            partyData: app.partyData
          })
          .then(result => {
            // 显示登录成功
            app.$toast(result.message)
            // 相应全局事件订阅: 刷新上级页面数据
            uni.$emit('syncRefresh', true)
            // 跳转回原页面
            setTimeout(() => app.onNavigateBack(1), 2000)
          })
          .catch(err => {
            app.disabled = false
            // 跳转回原页面
            if (err.result.data.isBack) {
              setTimeout(() => app.onNavigateBack(1), 2000)
            }
          })
          .finally(() => app.isLoading = false)
      },

      /**
       * 登录成功-跳转回原页面
       */
      onNavigateBack(delta = 1) {
        const pages = getCurrentPages()
        if (pages.length > 1) {
          uni.navigateBack({
            delta: Number(delta || 1)
          })
        } else {
          this.$navTo('pages/index/index')
        }
      }

    }
  }
</script>

<style lang="scss" scoped>

  .container {
    padding: 50rpx 60rpx;
    min-height: 100vh;
    background: linear-gradient(180deg, #00a2ff, #ffffff);
  }

  .login_header{
    display: block;
    margin: 0 auto;
    width: 300rpx;
    height: 300rpx;
    object-fit: contain;
  }
  .text_header{
      display: block;
      margin: 0 auto;
      width: 525rpx;
      height: 185rpx;
      object-fit: contain;
  }

  // 页面头部
  .header {
    margin-bottom: 60rpx;

    .title {
      color: #ffffff;
      font-size: 54rpx;
    }

    .sub-title {
      margin-top: 20rpx;
      color: #ffffff;
      font-size: 28rpx;
    }
  }

  // 输入框元素
  .form-item {
    display: flex;
    align-items: center;
    padding: 18rpx;
    border: 1rpx solid #ffffff;
    border-radius: 48rpx;
    margin-bottom: 30rpx;
    height: 96rpx;
    background-color: transparent;

    &--input {
      font-size: 28rpx;
      letter-spacing: 1rpx;
      flex: 1;
      height: 100%;
    }

    &--parts {
      min-width: 100rpx;
    }

    // 图形验证码
    .captcha {
      height: 60rpx;

      .image {
        display: block;
        width: 192rpx;
        height: 100%;
      }
    }

    // 短信验证码
    .captcha-sms {
      font-size: 28rpx;
      line-height: 50rpx;
      padding-right: 20rpx;

      .activate {
        color: $main-bg;
      }

      .un-activate {
        color: #0026ff;
      }
    }
  }


  // 登录按钮
  .login-button {
    margin-bottom: 50rpx;
    width: 100%;
    height: 86rpx;
    margin-top: 80rpx;
    background: transparent;
    border: 1rpx solid $main-bg;
    color: $main-bg;
    border-radius: 80rpx;
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    letter-spacing: 5rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    // 禁用按钮
    &.disabled {
      opacity: 0.6;
    }
  }
</style>