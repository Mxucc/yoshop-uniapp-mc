import request from '@/utils/request/core/request'
import Config from '@/core/config'

// YControl后端api地址
const ycontrolApiUrl = Config.get('ycontrolApiUrl')

// 创建YControl专用的request实例
const $ycontrol = new request({
  // 接口请求地址
  baseUrl: ycontrolApiUrl,
  // 服务器本地上传文件地址
  fileUrl: ycontrolApiUrl,
  // 服务器上传图片默认url
  defaultUploadUrl: 'upload/image',
  // 设置请求头
  header: {
    'content-type': 'application/json;charset=utf-8'
  },
  // 请求超时时间, 单位ms（默认15000）
  timeout: 15000,
  // 默认配置
  config: {
    // 是否自动提示错误
    isPrompt: true,
    // 是否显示加载动画
    load: true,
    // 是否使用数据工厂
    isFactory: true
  }
})

// 当前接口请求数
let ycontrolRequestNum = 0

// 请求开始拦截器
$ycontrol.requestStart = options => {
  if (options.load) {
    if (ycontrolRequestNum <= 0) {
      // 打开加载动画
      uni.showLoading({
        title: '加载中',
        mask: true
      })
    }
    ycontrolRequestNum += 1
  }
  
  // 图片上传大小限制
  if (options.method == "FILE" && options.maxSize) {
    const maxSize = options.maxSize
    for (let item of options.files) {
      if (item.size > maxSize) {
        setTimeout(() => {
          uni.showToast({
            title: "图片过大，请重新上传",
            icon: "none"
          })
        }, 10)
        return false
      }
    }
  }
  
  // 请求前加入当前终端
  options.header['platform'] = uni.getSystemInfoSync().platform
  // YControl后端不需要Token鉴权，只需要域名authority
  // 如果需要特殊的authority头，可以在这里添加
  options.header['Authority'] = Config.get('ycontrolAuthority')

  
  return options
}

// 请求结束
$ycontrol.requestEnd = options => {
  if (options.load) {
    ycontrolRequestNum = ycontrolRequestNum - 1
    if (ycontrolRequestNum <= 0) {
      uni.hideLoading()
    }
  }
}

// 数据处理工厂
$ycontrol.dataFactory = async res => {
  if (!res.response.statusCode || res.response.statusCode != 200) {
    return Promise.reject({
      statusCode: res.response.statusCode,
      errMsg: 'http状态码错误'
    })
  }

  let httpData = res.response.data
  if (typeof httpData == "string") {
    try {
      httpData = JSON.parse(httpData)
    } catch (error) {
      httpData = false
    }
  }
  
  if (httpData === false || typeof httpData !== 'object') {
    return Promise.reject({
      statusCode: res.response.statusCode,
      errMsg: "请检查YControl api地址能否访问正常"
    })
  }

  // YControl后端的数据结构处理（根据实际情况调整）
  // 如果返回的数据有code字段，按照标准格式处理
  if (httpData.code !== undefined) {
    if (httpData.code == 200) {
      return Promise.resolve({
        status: 200,
        data: httpData.data,
        message: httpData.message || 'success'
      })
    } else {
      // 错误处理 - 不显示提示
      return Promise.reject({
        statusCode: 0,
        errMsg: httpData.message || '请求失败',
        result: httpData
      })
    }
  }
  
  // 如果没有code字段，直接返回数据（适配直接返回数据的情况）
  return Promise.resolve({
    status: 200,
    data: httpData,
    message: 'success'
  })
}

// 错误回调 - 不显示提示
$ycontrol.requestError = e => {
  if (e.statusCode === 0) {
    throw e
  } else {
    // 不显示错误提示
    // setTimeout(() => {
    //   uni.showToast({
    //     title: e.errMsg || '网络请求失败',
    //     icon: 'none',
    //     duration: 2500
    //   })
    // }, 10)
  }
}

// api地址配置
const api = {
  // 新增接口
  shareInfo: 'shareInfo',
  videoData: 'videoData',
  articleData: 'articleData',
  faqConfigData: 'faqConfigData',
  homeSettings:"homeSettings",
  wechatInfo:"wechatInfo",
  miniprogram:"miniprogramInfo",
  // 可以根据需要添加更多接口
}

// 获取分享信息
export const getShareInfo = (param) => {
  return $ycontrol.get(api.shareInfo, param)
}

// 获取视频数据
export const getVideoData = (param) => {
  return $ycontrol.get(api.videoData, param)
}

// 获取文章数据
export const getArticleData = (param) => {
  return $ycontrol.get(api.articleData, param)
}

// 获取FAQ配置数据
export const getFAQConfigData = (param) => {
  return $ycontrol.get(api.faqConfigData, param)
}
// 获取首页活动图数据
export const getHomeSettings = (param) => {
  return $ycontrol.get(api.homeSettings, param)
}
// 获取微信公众号文章数据
export const getWechatInfo = (param) => {
  return $ycontrol.get(api.wechatInfo, param)
}
// 获取微信小程序数据
export const getMiniprogram = (param) => {
  return $ycontrol.get(api.miniprogram, param)
}

// 导出request实例，供其他地方使用
export default $ycontrol