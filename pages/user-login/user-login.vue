<template>
	<view class="body">
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		 
		<view class="login_title">
			登录/注册
		</view>
		<view class="policy_confirm">
			<view>登录/注册即代表您同意</view>
			<navigator url="../service-agreement/service-agreement">服务协议＆隐私政策</navigator>
			<navigator v-if="!wxlogin" url="login-help/login-help">收不到验证码？</navigator>
		</view>
		
		<view v-if="wxlogin">
			<view>
				<view class='header'>
					<image src='../../static/icon.png'></image>
				</view>
				<view class='content'>
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称，头像、地区等)</text>
				</view>
				<button class='wxverifybutton' hover-class="verifybuttonhover" type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="tologin()">授权登录</button>
				<view class="under-button" hover-class="press_under-button" hover-stay-time="100" @tap="toEmaillogin">邮箱登录</view>
			</view>
		</view>
		
		<view class="step1body" v-else>
			<view class="input-line">
				<input class="uni-input" type="text" v-model="email" :placeholder="inputPH1?'输入邮箱':''" />
				<view class="getcode-button u-f-ajc" v-if="use_code">
					<view @tap="getCheckNum" hover-class="gcode-hover" hover-start-time="100" >{{!codetime?'获取验证码':codetime}}</view>
				</view>
			</view>
			<view class="input-line" v-if="use_code">
				<input class="uni-input" type="text" v-model="code" :placeholder="inputPH2?'输入验证码':'输入密码'" />
			</view>
			<view class="input-line" v-if="!use_code">
				<input class="uni-input" type="password" v-model="password" :placeholder="inputPH2?'输入验证码':'输入密码'" />
			</view>
			<button v-if="loginMethod" type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="codebuttondisabled" @tap="verifykey">登录</button>
			<button v-else type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="passbuttondisabled" @tap="verifykey">登录</button>
			<view class="under-button" hover-class="press_under-button" hover-stay-time="100" @tap="changeloginMethod">{{loginMethod?'使用密码登录':'使用验证码登录'}}</view>
			<view class="under-button" hover-class="press_under-button" hover-stay-time="100" @tap="toWxlogin">微信登录</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				email:"",
				code:"",
				password:"",
				codetime:0,
				use_code:true,
				inputPH1:1,//"输入邮箱",
				inputPH2:1,//"输入验证码",
				codebuttondisabled:true,
				passbuttondisabled:true,
				loginMethod:1,//"使用密码登录",
				buttonText:1,//"登录/注册",
				wxlogin:true,
				config:{
					title:"登录/注册", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							text:"返回"
						}
					]
				},
			}
		},
		watch:{
			code(){
				if(this.code.length>=4){
					this.codebuttondisabled=false
				} else {
					this.codebuttondisabled=true
				}
			},
			password(){
				if(this.password.length>0){
					this.passbuttondisabled=false
				} else {
					this.passbuttondisabled=true
				}
			},
			
		},
		onBackPress(e) {
			// console.log(e)
			// if(e.from!='navigateBack'){
			// 	uni.showModal({
			// 		title:'提示',
			// 		content:'确认退出应用吗？',
			// 		success: (res) => {
			// 			if(res.confirm){plus.runtime.quit()}
			// 		}
			// 	})
			// 	return true;
			// }
		},
		methods: {
			//微信登录
			tologin() {
				this.User.wxlogin()
			},
			toEmaillogin(){
				this.wxlogin = false
			},
			toWxlogin(){
				this.wxlogin = true
			},
			// 验证邮箱格式
			isEmail(){
				let mPattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/; 
				return mPattern.test(this.email);
			},
			changeloginMethod(){
				if(this.loginMethod==1){
					this.inputPH2=0
					this.buttonText=0
					this.loginMethod=0
					this.password="",
					this.use_code=false
				} else if (this.loginMethod==0){
					this.inputPH2=1
					this.buttonText=1
					this.loginMethod=1
					this.code="",
					this.use_code=true
				}
			},
			async getCheckNum(){
				if(this.codetime > 0) return;
				if(this.codetime == '请求中') return;
				// 验证邮箱合法性
				if(!this.isEmail()){
					return uni.showToast({title:"请输入正确的邮箱",icon:"none"})
				}
				// 请求服务器，发送验证码
				this.codetime = '请求中'
				let [err,res] = await this.$http.post('/user/sendemailcode',{
					email:this.email
				});
				// 请求失败处理
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				// 发送成功，开启倒计时
				var countdown = 60
				let timer=setInterval(()=>{
					countdown --;
					this.codetime = countdown.toString()+' s'
					if(countdown < 1){
						clearInterval(timer);
						this.codetime=0;
					}
				},1000);
				uni.showToast({title:"验证码已发送，请注意查收",icon:"none"})
			},
			verifykey(){
				if(!this.isEmail()){
					return uni.showToast({title:"请输入正确的邮箱",icon:"none"})
				}
				if(this.loginMethod==1){
					// console.log("验证码登录")
					if(this.code.length!=4){
						return uni.showToast({title:"验证码的长度应该为4",icon:"none"})
					}
					return this.User.login({
						url:"/user/wxmpemaillogin",
						data:{
							email:this.email,
							emailcode:this.code
						}
					})
				} else {
					return this.User.login({
						url:"/user/login",
						data:{
							username:this.email,
							password:this.password
						}
					})
				}
				
			}
		}
	}
</script>

<style>
	.policy_confirm{
		font-size: 23upx;
		padding: 20upx 50upx;
		box-sizing: border-box;
	}
	.policy_confirm>view{
		color: #929292;
	}
	.under-button{
		padding-top: 30upx;
		color: #00AAFF;
		text-align: center;
	}
	.press_under-button{
		color: #00d3ff;
	}
	.policy_confirm>navigator{
		color: #00AAFF;
		background: rgb(255, 255, 255)!important;
	}
	.login_title{
		padding: 0 50upx 50upx 50upx;
		box-sizing: border-box;
		height: 80upx;
		line-height: 80upx;
		font-size: 60upx;
		font-weight: bold;
		/* background: #007AFF; */
	}
	.step1body{
		width: 100%;
		position: absolute;
		padding: 30upx;
		box-sizing: border-box;
		z-index: 999;
	}
	
	.verifybuttonhover[type=primary]{
		background: #00b9ff!important;
	}
	.verifybutton{
		background: #00aaff!important;
		border-radius: 50upx!important;
	}
	.wxverifybutton{
		background: #00aaff!important;
		border-radius: 50upx!important;
		margin: 0 30upx;
	}
	button::after{ border: none;}
	.getcode-hover{
		/* border: 1upx solid #ff0000; */
		opacity: 0.8;
	}
	.getcode-button>view{
		font-size: 25upx;
	}
	.gcode-hover{
		color: #00D3FF!important;
	}
	.getcode-button{
		position: relative;
		z-index: 9999;
		color: #00aaff;
		padding: 0upx 10upx;
		opacity: 1;
		/* border: 1upx solid #00aaff; */
		border-radius: 20upx;
	}
	.input-line>input{
		/* background: #09BB07; */
		border-bottom: 1px solid #eeeeee;
		font-size: 32upx;
	}
	.input-line{
		margin-bottom: 50upx;
		display: flex;
		align-items: center;
	}
	
	.header {
		margin: 90rpx 0 90rpx 50rpx;
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		line-height: 450rpx;
	}
		
	.header image {
		border: 1upx solid #EEEEEE;
		border-radius: 50%;
		width: 200rpx;
		height: 200rpx;
	}
		
	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}
		
	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}
	
</style>
