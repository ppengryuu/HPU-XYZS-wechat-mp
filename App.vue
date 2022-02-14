<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary');
			// #endif
			this.lib.NetWork.On();
			// this.lib.Update();
			// 初始化用户状态
			this.User.__init();
			// 初始化配置 
			this.appconfig.__init();
			this.publicM.__init();
			// 检测用户登录状态
			// if(!this.User.token){
			// 	uni.navigateTo({url:'pages/user-login/user-login'})
			// }
		},
		onShow: function() {
			console.log('App Show')
			uni.$emit('appshow',{msg:true})
		},
		onHide: function() {
			console.log('App Hide')
			uni.$emit('apphide',{msg:true})
		}
	} 
</script> 

<style>
	/*每个页面公共css */
	/* 引入官方css库 */
	@import './common/uni.css';
	/* 引入自定义图标库 */
	@import './common/icon.css';
	/* 引入动画库 */
	@import './common/animate.css';
	/* 公共样式 */
	@import './common/common.css';
	uni-checkbox .uni-checkbox-input {
		border-radius: 50%; 
	} 
	uni-checkbox .uni-checkbox-wrapper { 
		width: 100%; 
	}
	button::after{ border: none;}
</style>
