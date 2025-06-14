<template>
  <view class="container" :style="appThemeStyle">
      <!-- 产品视频组件 -->
      <product-video 
         v-if="options.pageId === '10006'"
        :video-url="productIntroData.videoUrl"
        :video-poster="productIntroData.videoPoster"
        @show-service="onShowService"
        @hide-service="onHideService"
      />
    <!-- 店铺页面组件 -->
    <Page :items="items" />
    
      <!-- 产品内容组件 -->
      <product-content  
      v-if="options.pageId === '10006'"
        :content-title="productIntroData.contentTitle"
        :rich-content="productIntroData.richContent"
      />
      <customer-service 
        :float-text="productIntroData.floatText"
        :modal-title="productIntroData.modalTitle"
        :faq-config="productIntroData.faqConfig"
      ></customer-service>

  </view>
</template>

<script>
  import * as Api from '@/api/page'
  import Page from '@/components/page'
  import ProductVideo from '@/components/product-intro/product-video'
  import ProductContent from '@/components/product-intro/product-content'

  import CustomerService from '@/components/product-intro/customer-service'
  export default {
    components: {
      Page,
      ProductVideo,
      ProductContent,
      CustomerService
    },
    data() {
      return {
        // 页面参数
        options: {},
        // 页面属性
        page: {},
        // 页面元素
        items: [],
        
        // 产品介绍组件配置数据
        productIntroData: {
          videoUrl: 'https://fb.xiayingwenhua.xyz/uploads/10001/20250524/a354294b436d884ee87ba30e1a7dd67d.mp4',
          videoPoster: '',
          contentTitle: '旅程介绍',
          richContent: `
            <div style="padding: 20px; line-height: 1.6; color: #333;">
              <p>
    厦门旅游的<span style="font-style: italic; font-weight: 700;">必去景点</span>包括：
</p>
<ul class="gs_cit_stry_pre gs_cit_stry_sm list-paddingleft-2" style="list-style-type: none;">
    <li>
        <p>
            <span style="font-style: italic; font-weight: 700; touch-action: manipulation;">鼓浪屿</span>：被誉为“海上花园”，拥有美丽的海滩和丰富的历史文化建筑，如日光岩和菽庄花园。&nbsp;
        </p>
    </li>
    <li>
        <p>
            <span style="font-style: italic; font-weight: 700; touch-action: manipulation;">厦门大学</span>：风景如画的校园，免费开放，但需提前预约。&nbsp;
        </p>
    </li>
    <li>
        <p>
            <span style="font-style: italic; font-weight: 700; touch-action: manipulation;">南普陀寺</span>：历史悠久的佛教寺庙，香火鼎盛，免费参观。&nbsp;
        </p>
    </li>
    <li>
        <p>
            <span style="font-style: italic; font-weight: 700; touch-action: manipulation;">环岛路</span>：适合骑行的海岸线，沿途风景优美。&nbsp;
        </p>
    </li>
</ul>
<p></p>
<ul class="gs_cit_stry_pre gs_cit_stry_sm list-paddingleft-2" style="list-style-type: none;">
    <li>
        <p>
            <span style="font-style: italic; font-weight: 700; touch-action: manipulation;">曾厝垵</span>：文艺气息浓厚的渔村，适合漫步和拍照。&nbsp;
        </p>
    </li>
    <li>
        <p>
            <span style="font-style: italic; font-weight: 700; touch-action: manipulation;">胡里山炮台</span>：保存完好的历史炮台，具有独特的建筑风格。&nbsp;
        </p>
    </li>
    <li>
        <p>
            <span style="font-style: italic; font-weight: 700; touch-action: manipulation;">中山路步行街</span>：体验当地美食和购物的好去处。
        </p>
    </li>
</ul>
<p>
    <br/>
</p>
            </div>
          `,
          floatText: '帮助',
          modalTitle: '常见问题',
          faqConfig: [
            {
              question: '如何加入交流群？',
              type: 'qrcode',
              qrTitle: '扫码进群咨询',
              qrCodeUrl: 'https://fb.xiayingwenhua.xyz/uploads/10001/20250607/b2c84e348209e63a4094f84f4e9c39fc.jpg',
              saveTip: '长按识别二维码加入群聊',
              defaultExpanded: true
            },
            {
              question: '厦门旅游最佳时间？',
              type: 'text',
              answer: '厦门四季如春，全年都适合旅游。春秋两季（3-5月、9-11月）气候最为宜人，是最佳旅游时间。夏季虽然炎热但海边凉爽，冬季温和少雨。',
              defaultExpanded: false
            },
            {
              question: '厦门有哪些必去景点？',
              type: 'text',
              answer: '鼓浪屿（海上花园）、厦门大学（最美校园）、南普陀寺（千年古刹）、环岛路（海岸骑行）、曾厝垵（文艺渔村）、胡里山炮台（历史遗迹）、中山路步行街（美食购物）等。',
              defaultExpanded: false
            },
            {
              question: '如何联系客服？',
              type: 'contact',
              contacts: [
                { label: '客服微信', value: 'totalsea' },
                { label: '客服电话', value: '177-5002-0397' },
                { label: '服务时间', value: '10:00-18:00' }
              ],
              defaultExpanded: false
            }
          ]
        },
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 当前页面参数
      this.options = options
      // 加载页面数据
      this.getPageData()
    },
    methods: {

      /**
       * 加载页面数据
       * @param {Object} callback
       */
      getPageData(callback) {
        const app = this
        const pageId = app.options.pageId || 0
        Api.detail(pageId)
          .then(result => {
            // 设置页面数据
            const { data: { pageData } } = result
            app.page = pageData.page
            app.items = pageData.items
            // 设置顶部导航栏栏
            app.setPageBar()
          })
          .finally(() => callback && callback())
      },

      /**
       * 设置顶部导航栏
       */
      setPageBar() {
        const { page } = this
        // 设置页面标题
        uni.setNavigationBarTitle({
          title: page.params.title
        })
        // 设置navbar标题、颜色
        uni.setNavigationBarColor({
          // #ifndef MP-ALIPAY
          frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
          // #endif
          backgroundColor: page.style.titleBackgroundColor
        })
      },

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

    /**
     * 分享当前页面
     */
    onShareAppMessage() {
      const app = this
      const { page } = app
      return {
        title: page.params.shareTitle,
        path: "/pages/custom/index?" + app.$getShareUrlParams({ pageId: app.options.pageId })
      }
    },

    /**
     * 分享到朋友圈
     * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
     * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
     */
    onShareTimeline() {
      const app = this
      const { page } = app
      return {
        title: page.params.shareTitle,
        path: "/pages/custom/index?" + app.$getShareUrlParams({ pageId: app.options.pageId })
      }
    }

  }
</script>

<style lang="scss" scoped>
  .container {
    background: #fff;
  }
</style>