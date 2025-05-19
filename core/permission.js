import store from '@/store'
import { checkLogin } from '@/core/app'

// 需要登录才能访问的页面路径
const loginRequiredPages = [
  'pages/category/index',
  'pages/cart/index',
  'pages/user/index',
  'pages/custom/index',
  // 可以根据需要添加更多需要登录的页面
]

// 不需要登录的白名单页面
const whiteList = [
  'pages/login/index',
  'pages/login/components/main',
  // 可以根据需要添加其他不需要登录就能访问的页面
]

/**
 * 路由拦截器
 * 检查用户是否已登录，未登录则跳转到登录页面
 */
export function setupRouterGuard() {
  // 监听路由跳转
  uni.addInterceptor('navigateTo', {
    invoke(e) {
      return routerGuard(e, 'navigateTo')
    }
  })
  
  uni.addInterceptor('redirectTo', {
    invoke(e) {
      return routerGuard(e, 'redirectTo')
    }
  })
  
  uni.addInterceptor('switchTab', {
    invoke(e) {
      return routerGuard(e, 'switchTab')
    }
  })
  
  uni.addInterceptor('reLaunch', {
    invoke(e) {
      return routerGuard(e, 'reLaunch')
    }
  })
}

/**
 * 路由守卫函数
 * @param {Object} e - 路由事件对象
 * @param {String} navigationType - 导航类型
 * @returns {Boolean} - 是否允许导航
 */
function routerGuard(e, navigationType) {
  // 获取目标页面路径
  const url = e.url
  
  // 提取页面路径（不含参数）
  let pagePath = url.split('?')[0]
  // 去掉开头的斜杠（如果有）
  if (pagePath.startsWith('/')) {
    pagePath = pagePath.substr(1)
  }
  
  // 如果是白名单页面，直接放行
  if (whiteList.some(page => pagePath.includes(page))) {
    return true
  }
  
  // 检查是否需要登录
  const needLogin = loginRequiredPages.some(page => pagePath.includes(page))
  
  // 如果需要登录但未登录，则显示提醒但不阻止导航
  if ((needLogin || pagePath === 'pages/index/index') && !checkLogin()) {
    uni.showModal({
      title: '温馨提示',
      content: '本小程序需要登录后才能使用完整功能，是否立即登录？',
      success(res) {
        if (res.confirm) {
          uni.redirectTo({
            url: '/pages/login/index'
          })
        }
      }
    })
  }
  
  // 始终允许导航
  return true
  
  // 其他情况放行
  return true
}