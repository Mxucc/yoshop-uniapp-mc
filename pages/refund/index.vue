<template>
  <view class="container" :style="appThemeStyle">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback" :up="upOption"
      @up="upCallback">
      <!-- tab栏 -->
      <u-tabs :list="tabs" :is-scroll="false" v-model="curTab" :active-color="appTheme.mainBg" :duration="0.2" @change="onChangeTab" />
      <!-- 退款/售后单 -->
      <view class="widget-list">
        <view class="widget-detail" v-for="(item, index) in list.data" :key="index">
          <view class="row-block dis-flex flex-y-center">
            <view class="flex-box">{{ item.create_time }}</view>
            <view class="flex-box t-r">
              <text class="col-m">{{ item.state_text }}</text>
            </view>
          </view>
          <view class="detail-goods row-block dis-flex" @click.stop="handleTargetDetail(item.order_refund_id)">
            <view class="goods-image">
              <image class="image" :src="item.orderGoods.goods_image" mode="aspectFit"></image>
            </view>
            <view class="goods-right flex-box">
              <view class="goods-name">
                <text class="twoline-hide">{{ item.orderGoods.goods_name }}</text>
              </view>
              <view class="goods-props clearfix">
                <view class="goods-props-item" v-for="(props, idx) in item.orderGoods.goods_props" :key="idx">
                  <text>{{ props.value.name }}</text>
                </view>
              </view>
              <view class="goods-num t-r">
                <text class="f-26 col-8">×{{ item.orderGoods.total_num }}</text>
              </view>
            </view>
          </view>
          <view class="detail-order row-block">
            <view class="item dis-flex flex-x-end flex-y-center">
              <text class="">付款金额：</text>
              <text class="col-m">￥{{ item.orderGoods.total_pay_price }}</text>
            </view>
          </view>
          <view class="detail-operate row-block dis-flex flex-x-end flex-y-center">
            <view class="detail-btn btn-detail" @click.stop="handleTargetDetail(item.order_refund_id)">查看详情</view>
          </view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>

<script>
  import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData } from '@/core/app'
  import * as RefundApi from '@/api/refund'

  // 每页记录数量
  const pageSize = 15

  // tab栏数据
  const tabs = [{
    name: '全部',
    value: -1
  }, {
    name: '待处理',
    value: 0
  }]

  export default {
    mixins: [MescrollMixin],
    data() {
      return {
        // 订单列表数据
        list: getEmptyPaginateObj(),
        // tabs栏数据
        tabs,
        // 当前标签索引
        curTab: 0,
        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: true,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于2条才显示无更多数据
          noMoreSize: 2,
          // 空布局
          empty: {
            tip: '亲，暂无售后单记录'
          }
        },
        // 控制首次触发onShow事件时不刷新列表
        canReset: false,
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.canReset && this.onRefreshList()
      this.canReset = true
    },

    methods: {

      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      upCallback(page) {
        const app = this
        // 设置列表数据
        app.getRefundList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      // 获取退款/售后单列表
      getRefundList(pageNo = 1) {
        const app = this
        return new Promise((resolve, reject) => {
          RefundApi.list({ state: app.getTabValue(), page: pageNo }, { load: false })
            .then(result => {
              // 合并新数据
              const newList = result.data.list
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      },

      // 切换标签项
      onChangeTab(index) {
        const app = this
        // 设置当前选中的标签
        app.curTab = index
        // 刷新售后单列表
        app.onRefreshList()
      },

      // 刷新订单列表
      onRefreshList() {
        this.list = getEmptyPaginateObj()
        setTimeout(() => {
          this.mescroll.resetUpScroll()
        }, 120)
      },

      // 获取当前标签项的值
      getTabValue() {
        return this.tabs[this.curTab].value
      },

      // 跳转到售后单详情页
      handleTargetDetail(orderRefundId) {
        this.$navTo('pages/refund/detail', { orderRefundId })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .widget-detail {
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 20rpx;

    .row-block {
      padding: 0 20rpx;
      min-height: 70rpx;
    }

    .detail-goods {
      padding: 20rpx;
      background: #f9f9f9;

      .goods-image {
        margin-right: 20rpx;

        .image {
          display: block;
          width: 200rpx;
          height: 200rpx;
        }
      }

      .goods-right {
        padding: 15rpx 0;
      }

      .goods-name {
        margin-bottom: 10rpx;
        min-height: 68rpx;
        line-height: 1.3;
      }

      .goods-props {        margin-top: 14rpx;        color: #ababab;        font-size: 24rpx;        overflow: hidden;        .goods-props-item {          padding: 4rpx 16rpx;          border-radius: 12rpx;          background-color: #fcfcfc;        }      }

    }

    .detail-operate {
      padding-bottom: 20rpx;

      .detail-btn {
        border-radius: 4px;
        border: 1rpx solid #ccc;
        padding: 8rpx 20rpx;
        font-size: 28rpx;
        color: #555;
        margin-left: 10rpx;
      }
    }

    .detail-order {
      padding: 10rpx 20rpx;
      font-size: 28rpx;
      height: 50rpx;
      display: flex;
      align-items: center;

      .item {
        margin-bottom: 10rpx;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
</style>
