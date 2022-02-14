<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.back1()"/>
		<!-- <view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view> -->
		
		<view class="step1body" :class="step1">
			<view class="step_title">
				<view>登录后勤管理系统</view>
			</view>
			
			<view class="input-line">
				<input class="uni-input" type="text" v-model="usernum" :placeholder="'请输入学号'" />
			</view>
			<view class="input-line" style="margin-bottom: 10rpx!important;">
				<input class="uni-input" type="password" v-model="userpwd" :placeholder="'请输入密码'" />
			</view>
			<view class="edit-tip"><view>* 默认为身份证号后6位</view></view>
			<view class="input-line" style="margin-bottom: 10rpx!important;">
				<input class="uni-input" type="text" v-model="captcha" :placeholder="'请输入验证码'" />
				<view class="u-f-ajc">
					<image v-if="codestatus" :src="captchaB64" mode="widthFix" style="height: auto;width: 250rpx;" @tap="refreshcode" @error="refreshcode()"></image>
					<view v-else style="color: #909090;">loading...</view>
				</view>
			</view>
			<view class="edit-tip"><view>* 点击图片刷新验证码</view></view>
			<label class="u-f-ac" v-on:click="switchsavepass(savepassword)">
				<checkbox :checked="savepassword" style="transform: scale(0.7);"/>
				<view>记住密码</view>
			</label>
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="button1disabled" @tap="submit">登录</button>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				usernum:"",
				userpwd:"",
				captcha:"",
				captchaB64:"",
				codestatus:false,
				savepassword:false,
				sessionID:"",
				config:{
					title:"登录后勤管理系统", //title
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
		onLoad() {
			var ecAcc = uni.getStorageSync("zhhqAccount")
			if(ecAcc){
				this.usernum = ecAcc.account
				this.userpwd = ecAcc.password
				this.savepassword = ecAcc.password?true:false
			} else if (this.User.schoolbind){
				this.usernum=this.User.schoolbind.jwzh
			}
			this.zhhqSession()
		},
		// onReady() {
		// 	uni.navigateTo({
		// 		url:"post-list/post-list"
		// 	})
		// },
		methods: {
			refreshcode(){
				this.codestatus = false
				this.zhhqSession()
			},
			async zhhqSession(){
				let [err,res] = await this.$http.post("/app/zhhq/session",{
					user_id:this.User.userinfo.id
				},{
					token:true,
					checkToken:true
				})
				console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					// uni.showToast({title:res.data.msg,icon:'none'})
					return;
				}
				this.captchaB64 = res.data.data.captcha;
				this.sessionID = res.data.data.sessionID;
				this.codestatus = true;
			},
			async submit(){
				if(!this.usernum) return uni.showToast({icon:"none",title:"请输入学号"})
				if(!this.userpwd) return uni.showToast({icon:"none",title:"请输入密码"})
				if(!this.captcha) return uni.showToast({icon:"none",title:"请输入验证码"})
				uni.showLoading({
					title:"登录中"
				})
				let [err,res] = await this.$http.post('/app/zhhq/login',{
					user_id:this.User.userinfo.id,
					usernum:this.usernum,
					userpwd:this.userpwd,
					captcha:this.captcha
				});
				console.log(res)
				if (!this.$http.errorCheck(err,res)){ 
					this.refreshcode();
					return;
				}
				uni.setStorageSync("zhhqAccount", {
					account:this.usernum,
					password:this.savepassword?this.userpwd:""
				})
				var data = res.data.data
				// console.log(JSON.parse(data.data.session))
				console.log(data)
				console.log(data.data.session)
				uni.setStorageSync("zhhqSessionData", data.data)
				uni.hideLoading()
				uni.navigateTo({
					url:"logistics-functions/logistics-functions"
				})
			},
			switchsavepass(savepassword){
				savepassword=!savepassword
				this.savepassword=savepassword
				console.log(this.savepassword)
			},
		}
	}
</script>

<style>
	.edit-tip{
		margin-bottom: 50rpx;
		display: flex;
		flex-direction: row;
		width: 96%;
		justify-content: space-between;
	}
	.edit-tip view{
		margin-left: 10upx;
		font-size: 22upx;
		color: #9B9B9B;
	}
	
	.input-line>input{
		/* background: rgb(243,246,248); */
		border-bottom: 1px solid #eeeeee;
		font-size: 32upx;
	}
	.input-line{
		margin-bottom: 50upx;
		display: flex;
		align-items: center;
	}
	
	.step_title{
		padding: 20upx 30upx 50upx 30upx;
		box-sizing: border-box;
	}
	.step_title>view{
		font-size: 40upx;
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
	button::after{ border: none;}
	.step1body>label{
		margin-left: 12upx;
		margin-bottom: 30upx;
		color: #646464;
	}
</style>
