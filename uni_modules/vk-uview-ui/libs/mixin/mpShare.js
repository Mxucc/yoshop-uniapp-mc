export default {
	onLoad() {
		// 设置默认的转发参数
		this.$u.mpShare = {
			title: '', // 默认为小程序名称
			path: '', // 默认为当前页面路径
			imageUrl: '/static/fbback.png' // 设置默认分享图片
		}
	},
	onShareAppMessage() {
		return this.$u.mpShare
	},
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		return this.$u.mpShare
	}
	// #endif
}
