<template>
  <view class="customer-service">
    <!-- 客服悬浮球 -->
    <view class="customer-service-float" @click="showCustomerService">
      <view class="float-icon">
        <text class="iconfont icon-kefu">{{ floatText }}</text>
      </view>
    </view>
    
    <!-- FAQ弹窗 -->
    <view class="customer-modal" v-if="showServiceModal" @click="hideCustomerService">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ modalTitle }}</text>
          <view class="close-btn" @click="hideCustomerService">
            <text class="iconfont icon-close">×</text>
          </view>
        </view>
        <view class="modal-body">
          <view class="faq-container">
            <view 
              class="faq-item" 
              v-for="(item, index) in faqList" 
              :key="index"
            >
              <view 
                class="faq-question" 
                @click="toggleFaq(index)"
                :class="{ 'active': item.expanded }"
              >
                <text class="question-text">{{ item.question }}</text>
                <text class="expand-icon" :class="{ 'expanded': item.expanded }">▼</text>
              </view>
              <view 
                class="faq-answer" 
                v-if="item.expanded"
                :class="{ 'show': item.expanded }"
              >
                <!-- 普通文本答案 -->
                <text v-if="item.type === 'text'" class="answer-text">{{ item.answer }}</text>
                
                <!-- 二维码答案 -->
                <view v-else-if="item.type === 'qrcode'" class="qr-section">
                  <text class="qr-title">{{ item.qrTitle }}</text>
                  <image 
                    class="qr-image" 
                    :src="item.qrCodeUrl" 
                    mode="aspectFit"
                    show-menu-by-longpress="true"
                  ></image>
                  <text class="save-tip">{{ item.saveTip }}</text>
                </view>
                
                <!-- 联系方式答案 -->
                <view v-else-if="item.type === 'contact'" class="contact-section">
                  <view class="contact-item" v-for="(contact, cIndex) in item.contacts" :key="cIndex">
                    <text class="contact-label">{{ contact.label }}：</text>
                    <text class="contact-value" @click="copyText(contact.value)">{{ contact.value }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomerService',
  props: {
    // 客服相关
    floatText: {
      type: String,
      default: '帮助'
    },
    modalTitle: {
      type: String,
      default: '常见问题'
    },
    // FAQ配置
    faqConfig: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      showServiceModal: false, // 弹窗显示状态
      faqList: [] // FAQ列表
    }
  },
  
  created() {
    this.initFaqList()
  },
  
  watch: {
    faqConfig: {
      handler() {
        this.initFaqList()
      },
      deep: true
    }
  },
  
  methods: {
    /**
     * 初始化FAQ列表
     */
    initFaqList() {
      // 如果有传入配置则使用，否则使用默认配置
      const defaultFaq = [
        {
          question: '如何加入交流群？',
          type: 'qrcode',
          qrTitle: '扫码进群咨询',
          qrCodeUrl: 'https://fb.xiayingwenhua.xyz/uploads/wechat-group-qr.jpg',
          saveTip: '长按识别二维码加入群聊',
          expanded: true, // 默认展开
          defaultExpanded: true
        },
        {
          question: '如何联系客服？',
          type: 'contact',
          contacts: [
            { label: '客服微信', value: 'kefu001' },
            { label: '服务时间', value: '9:00-18:00' }
          ],
          expanded: false,
          defaultExpanded: false
        },
        {
          question: '订单问题怎么处理？',
          type: 'text',
          answer: '您可以在"我的订单"中查看订单详情，如有问题请联系客服处理。支持退换货服务，具体政策请查看帮助中心。',
          expanded: false,
          defaultExpanded: false
        },
        {
          question: '支付方式有哪些？',
          type: 'text',
          answer: '支持微信支付、支付宝、银行卡等多种支付方式。支付过程安全可靠，请放心使用。',
          expanded: false,
          defaultExpanded: false
        },
        {
          question: '配送时间和范围？',
          type: 'text',
          answer: '全国大部分地区支持配送，一般1-3个工作日内发货，具体配送时间根据地区而定。偏远地区可能需要额外时间。',
          expanded: false,
          defaultExpanded: false
        }
      ]
      
      this.faqList = this.faqConfig.length > 0 ? this.faqConfig.map(item => ({
        ...item,
        expanded: item.defaultExpanded || false
      })) : defaultFaq
    },

    /**
     * 显示FAQ弹窗
     */
    showCustomerService() {
      this.showServiceModal = true
      this.$emit('show-service')
    },

    /**
     * 隐藏FAQ弹窗
     */
    hideCustomerService() {
      this.showServiceModal = false
      this.$emit('hide-service')
    },
    
    /**
     * 切换FAQ展开状态
     */
    toggleFaq(index) {
      this.faqList[index].expanded = !this.faqList[index].expanded
    },
    
    /**
     * 复制文本
     */
    copyText(text) {
      // #ifdef H5
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          uni.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          })
        })
      } else {
        // 降级方案
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        uni.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        })
      }
      // #endif
      
      // #ifndef H5
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          })
        }
      })
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
// 客服悬浮球样式
.customer-service-float {
  position: fixed;
  right: 30rpx;
  bottom: 200rpx;
  z-index: 999;
  
  .float-icon {
    width: 100rpx;
    height: 100rpx;
    background: linear-gradient(135deg, #e49a3d, #f4b942);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 20rpx rgba(228, 154, 61, 0.3);
    animation: float 3s ease-in-out infinite;
    
    text {
      color: #fff;
      font-size: 24rpx;
      font-weight: bold;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

// FAQ弹窗样式
.customer-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .modal-content {
    width: 680rpx;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    animation: modalShow 0.3s ease-out;
    display: flex;
    flex-direction: column;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 2rpx solid #f0f0f0;
    flex-shrink: 0;
    
    .modal-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .close-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      text {
        font-size: 40rpx;
        color: #999;
      }
    }
  }
  
  .modal-body {
    flex: 1;
    overflow-y: auto;
    
    .faq-container {
      .faq-item {
        border-bottom: 2rpx solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 30rpx;
          cursor: pointer;
          transition: background-color 0.2s;
          
          &:hover {
            background-color: #f8f8f8;
          }
          
          &.active {
            background-color: #f0f8ff;
          }
          
          .question-text {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            flex: 1;
          }
          
          .expand-icon {
            font-size: 24rpx;
            color: #666;
            transition: transform 0.3s;
            
            &.expanded {
              transform: rotate(180deg);
            }
          }
        }
        
        .faq-answer {
          padding: 0 30rpx 30rpx;
          animation: slideDown 0.3s ease-out;
          
          .answer-text {
            font-size: 26rpx;
            color: #666;
            line-height: 1.6;
            display: block;
          }
          
          .qr-section {
            text-align: center;
            
            .qr-title {
              font-size: 32rpx;
              color: #666;
              margin-bottom: 20rpx;
              display: block;
              font-weight: 500;
            }
            
            .qr-image {
              width: 300rpx;
              height: 300rpx;
              border-radius: 12rpx;
              margin-bottom: 15rpx;
            }
            
            .save-tip {
              font-size: 36rpx;
              color: #999;
              display: block;
              font-weight: 500;
            }
          }
          
          .contact-section {
            .contact-item {
              display: flex;
              align-items: center;
              margin-bottom: 15rpx;
              
              &:last-child {
                margin-bottom: 0;
              }
              
              .contact-label {
                font-size: 26rpx;
                color: #666;
                min-width: 140rpx;
              }
              
              .contact-value {
                font-size: 26rpx;
                color: #e49a3d;
                font-weight: 500;
                cursor: pointer;
                
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }
    }
  }
}

@keyframes modalShow {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500rpx;
  }
}
</style>