# ProductIntro 产品介绍组件

一个集成了视频介绍、富文本内容展示和客服功能的产品介绍组件。

## 功能特性

- 📹 **视频介绍**: 支持视频播放，包含播放控制和封面图
- 📝 **富文本内容**: 支持HTML富文本内容展示
- 💬 **客服悬浮球**: 带动画效果的悬浮客服按钮
- 📱 **微信群二维码**: 弹窗展示二维码，支持长按保存
- 🎨 **美观UI**: 现代化的界面设计和动画效果

## 使用方法

### 1. 引入组件

```javascript
import ProductIntro from '@/components/product-intro'

export default {
  components: {
    ProductIntro
  }
}
```

### 2. 在模板中使用

```vue
<template>
  <product-intro 
    :video-url="videoUrl"
    :rich-content="richContent"
    :qr-code-url="qrCodeUrl"
    @show-service="onShowService"
    @save-success="onSaveSuccess"
  />
</template>
```

### 3. 配置数据

```javascript
data() {
  return {
    videoUrl: 'https://example.com/video.mp4',
    richContent: '<div><h2>产品介绍</h2><p>这里是产品详情...</p></div>',
    qrCodeUrl: 'https://example.com/qr-code.jpg'
  }
}
```

## Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| videoUrl | String | - | 视频链接地址 |
| videoPoster | String | '' | 视频封面图片 |
| contentTitle | String | '详情介绍' | 内容区域标题 |
| richContent | String | - | 富文本HTML内容 |
| floatText | String | '加群' | 悬浮球显示文字 |
| modalTitle | String | '联系客服' | 弹窗标题 |
| qrTitle | String | '扫码进群咨询' | 二维码标题 |
| qrCodeUrl | String | - | 二维码图片地址 |
| saveTip | String | '长按保存二维码到相册' | 保存提示文字 |

## Events 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| show-service | 显示客服弹窗时触发 | - |
| hide-service | 隐藏客服弹窗时触发 | - |
| save-success | 二维码保存成功时触发 | - |
| save-fail | 二维码保存失败时触发 | error |
| download-fail | 二维码下载失败时触发 | - |

## 样式定制

组件使用了scoped样式，如需自定义样式，可以通过以下方式：

1. **修改CSS变量**（如果组件支持）
2. **使用深度选择器**

```scss
::v-deep .product-intro {
  .video-section {
    padding: 30rpx;
  }
  
  .customer-service-float {
    right: 50rpx;
    bottom: 300rpx;
  }
}
```

## 注意事项

1. **权限处理**: 保存图片到相册需要用户授权，组件已内置权限处理逻辑
2. **网络图片**: 确保视频和二维码图片链接可正常访问
3. **富文本安全**: 富文本内容应经过安全过滤，避免XSS攻击
4. **性能优化**: 大型富文本内容建议进行懒加载处理

## 兼容性

- ✅ 微信小程序
- ✅ H5
- ✅ App
- ✅ 支付宝小程序
- ✅ 百度小程序

## 更新日志

### v1.0.0
- 初始版本发布
- 支持视频播放、富文本展示、客服悬浮球功能
- 支持二维码展示和保存功能