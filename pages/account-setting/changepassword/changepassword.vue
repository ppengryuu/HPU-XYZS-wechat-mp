<template>
	<view class="body">
		<navigation-custom :config="config" @buttonTap="publicM.back1()"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<template v-if="!bindEmail">
			<view class="u-f-ajc" style="height: 300rpx;color: #909090;">未绑定邮箱，请先绑定邮箱</view>
		</template>
		<template v-else>
			<view class="step1body" :class="step1">
				<view class="step1_title">
					<view>在设置新密码之前，</view>
					<view>需要先验证一下您的邮箱</view>
					<navigator url="../../user-login/login-help/login-help">收不到验证码？</navigator>
				</view>
				<view class="user-phone u-f-jsb">
					<view style="margin-left: 25rpx;">{{bindEmail}}</view>
					<view class="getcode-button u-f-ajc">
						<view @tap="getCheckNum" hover-class="gcode-hover" hover-stay-time="100">{{!codetime?'获取验证码':codetime+' s'}}</view>
					</view>
				</view>
				<view class="changepassword-input">
					<input class="uni-input" type="text" v-model="code" placeholder="输入验证码"/>
				</view>
				<button type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="buttondisabled" @tap="verifycode">验证</button>
			</view>
			<view class="step2body" :class="step2">
				<view class="changepassword-input" v-show="verified">
					<input class="uni-input" type="password" v-model="newpassword" placeholder="输入/设置新密码"/>
				</view>
				<view class="changepassword-input" v-show="verified">
					<input class="uni-input" type="password" v-model="confirmnewpassword" placeholder="确认密码"/>
				</view>
				<button v-show="verified" type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="button2disabled" @tap="sumbitNewpassword">确定</button>
			</view>
		</template>
	</view>
</template>

<script>
	import $http from "../../../common/request.js";
	export default {
		data() {
			return {
				step1:"",
				step2:"",
				code:"",
				codetime:0,
				bindEmail:false,
				newpassword:"",
				confirmnewpassword:"",
				verified:false,
				buttondisabled:true,
				button2disabled:true,
				config:{
					title:"设置密码", //title
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
					this.buttondisabled=false
				} else {
					this.buttondisabled=true
				}
			},
			newpassword(){	},
			confirmnewpassword(){
				if(this.newpassword&&this.confirmnewpassword){
					this.button2disabled=false
				} else {
					this.button2disabled=true
				}
			}
		},
		onLoad() {
			this.bindEmail = this.User.email
		},
		methods: {
			async getCheckNum(){
				if(this.codetime > 0) return;
				// 请求服务器，发送验证码
				let [err,res] = await this.$http.post('/user/sendemailcode',{
					email:this.User.email
				});
				// 请求失败处理
				this.$http.errorCheck(err,res);
				if (res.data.errorCode === 30001) return;
				// 发送成功，开启倒计时
				uni.showToast({title:"验证码已发送，请注意查收",icon:"none"})
				this.codetime=60;
				let timer=setInterval(()=>{
					this.codetime--;
					if(this.codetime < 1){
						clearInterval(timer);
						this.codetime=0;
					}
				},1000);
			},
			async verifycode(){
				var data={
						email:this.User.email,
						emailcode:this.code
					}
				uni.showLoading({ title: '验证中...', mask: true });
				// 请求服务器
				let [err,res] = await $http.post("/user/wxmpemaillogin",data);
				// 验证失败
				if (!$http.errorCheck(err,res)) return;
				// 验证成功 更新用户状态
				this.token = res.data.data.token;
				this.email = res.data.data.email;
				this.userinfo = this.User.__formatUserinfo(res.data.data);
				// 本地存储
				uni.setStorageSync("userinfo",this.userinfo);
				uni.setStorageSync("token", this.token);
				uni.setStorageSync("email", this.email);
				// 获取用户相关统计
				await this.User.getCounts();
				// 成功提示
				uni.hideLoading();
				uni.showToast({title:"验证成功",icon:'none'})
				this.step1="animated slideOutLeft faster";
				this.step2="animated slideInRight faster";
				this.verified=true;
			},
			async sumbitNewpassword(){
				if(this.newpassword!=this.confirmnewpassword){
					uni.showToast({
						icon:"none",
						title:"密码不一致，请检查"
					})
				} else {
					let [err,res] = await this.$http.post('/repassword',{
						token:this.User.token,
						newpassword:this.newpassword,
						renewpassword:this.confirmnewpassword,
					},{
						token:true,
						checkToken:true
					})
					if(!this.$http.errorCheck(err,res)){
						this.loading = this.disabled = false;
						return;
					}
					// 修改状态，缓存
					this.User.userinfo.password = true;
					uni.setStorageSync('userinfo',this.User.userinfo);
					uni.showToast({title:'修改密码成功！',icon:'none'})
					uni.navigateBack({ delta: 1 });
				}
			}
		}
	}
</script>

<style>
	.step1_title{
		padding: 20upx 30upx 50upx 30upx;
		box-sizing: border-box;
	}
	.step1_title>view{
		font-size: 40upx;
	}
	.step1_title>navigator{
		font-size: 23upx;
		color: #00AAFF;
		background: rgb(243,246,248)!important;
	}
	.step1body{
		width: 100%;
		position: fixed;
		padding: 30upx;
		box-sizing: border-box;
		z-index: 999;
	}
	.step2body{
		position: fixed;
		z-index: 998;
		padding: 30upx;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}
	.verifybuttonhover[type=primary]{
		background: #00b9ff!important;
	}
	.verifybutton{
		background: #00aaff!important;
		border-radius: 50upx!important;
	}
	button::after{ border: none;}
	.getcode-button>view{
		color: #00aaff;
		font-size: 22upx;
	}
	.gcode-hover{
		color: #00D3FF!important;
	}
	.getcode-button{
		padding: 0upx 10upx;
		/* border: 1upx solid #00aaff; */
		border-radius: 20upx;
	}
	.changepassword-input>input{
		/* background: #09BB07; */
		font-size: 32upx;
		background: rgb(243,246,248);
		border-bottom: 1px solid #eeeeee;
	}
	.changepassword-input,.user-phone{
		margin-bottom: 50upx;
		display: flex;
		align-items: center;
	}
	.user-phone{
		height: 80upx;
	}
	.user-phone>view:nth-child(1)>view{
		font-size: 33upx;
	}
</style>
