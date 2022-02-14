<template>
	<view class="body">
		<navigation-custom :config="config" @buttonTap="publicM.back1()"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<view class="step1body" :class="step1">
			<view class="step_title">
				<view>在更换新邮箱之前，</view>
				<view>需要先验证一下您的原邮箱</view>
				<navigator url="../../user-login/login-help/login-help">收不到验证码？</navigator>
			</view>
			
			<view class="user-email u-f-jsb">
				<view style="margin-left: 25rpx;">{{old_email}}</view>
				<view class="getcode-button u-f-ajc" >
					<view @tap="getCheckNum1" hover-class="gcode-hover" hover-start-time="100">{{!codetime?'获取验证码':codetime+' s'}}</view>
				</view>
			</view>
			<view class="hb-style-input">
				<view>&nbsp;&nbsp;</view>
				<input class="uni-input" type="text" v-model="code1" placeholder="输入验证码"/>
			</view>
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="button1disabled" @tap="step1verifycode">验证</button>
		</view>
		<view class="step2body" :class="step2">
			<view class="step_title" v-show="step1verified">
				<view>{{User.email?'现在开始验证您的新邮箱':'绑定邮箱'}}</view>
				<navigator url="../../user-login/login-help/login-help">收不到验证码？</navigator>
			</view>
			
			<view class="hb-style-input" v-show="step1verified">
				<input class="uni-input" type="text" v-model="new_email" placeholder="输入新邮箱"/>
				<view class="getcode-button u-f-ajc">
					<view @tap="getCheckNum2">{{!codetime?'获取验证码':codetime+' s'}}</view>
				</view>
			</view>
			<view class="hb-style-input" v-show="step1verified">
				<input class="uni-input" type="text" v-model="code2" placeholder="输入验证码"/>
			</view>
			<button v-show="step1verified" type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="button2disabled" @tap="old_email?step2verifycode():nooldemail()">确定</button>
		</view>
		
		
	</view>
</template>

<script>
	import $http from "../../../common/request.js";
	export default {
		data() {
			return {
				step1:"",
				step2:"",
				code1:"",
				old_email:"",
				new_email:"",
				code2:"",
				codetime:0,
				step1verified:false,
				button1disabled:true,
				button2disabled:true,
				config:{
					title:"绑定邮箱", //title
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
			if(!this.User.email){
				this.step1="animated slideOutLeft faster";
				this.step2="animated slideInRight faster";
				this.step1verified=true;
				this.codetime=0;
			} else {
				this.old_email = this.User.email
			}
		},
		watch:{
			code1(){
				if(this.code1.length>=4){
					this.button1disabled=false
				} else {
					this.button1disabled=true
				}
			},
			code2(){
				if(this.code2.length>=4){
					this.button2disabled=false
				} else {
					this.button2disabled=true
				}
			}
			
		},
		methods: {
			// 验证原邮箱
			isEmail(){
				let mPattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/; 
				return mPattern.test(this.new_email);
			},
			async getCheckNum1(){
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
				// 发送成功，开启倒计时
				this.codetime=60;
				let timer=setInterval(()=>{
					this.codetime--;
					if(this.codetime < 1){
						clearInterval(timer);
						this.codetime=0;
					}
				},1000);
			},
			async getCheckNum2(){
				if(this.codetime > 0) return;
				// 验证手机号合法性
				if(!this.isEmail()){
					return uni.showToast({ title: '请输入正确的邮箱',icon:"none" });
				}
				// 请求服务器，发送验证码
				let [err,res] = await this.$http.post('/user/sendemailcode',{
					email:this.new_email
				});
				// 请求失败处理
				console.log(res)
				this.$http.errorCheck(err,res);
				if (res.data.errorCode === 30001) return;
				// 发送成功，开启倒计时
				uni.showToast({title:"验证码已发送，请注意查收",icon:"none"})
				// 发送成功，开启倒计时
				this.codetime=60;
				let timer=setInterval(()=>{
					this.codetime--;
					if(this.codetime < 1){
						clearInterval(timer);
						this.codetime=0;
					}
				},1000);
			},
			async step1verifycode(){
				var data={
						email:this.User.email,
						emailcode:this.code1
					}
				uni.showLoading({ title: '验证中...', mask: true });
				// 请求服务器
				let [err,res] = await $http.post("/user/wxmpemaillogin",data);
				// 验证失败
				if (!$http.errorCheck(err,res)){return uni.hideLoading();}
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
				uni.showToast({title:"验证成功",icon:"none"})
				uni.hideLoading();
				this.step1="animated slideOutLeft faster";
				this.step2="animated slideInRight faster";
				this.step1verified=true;
				this.codetime=0;
			},
			async step2verifycode(){
				console.log("step2verifycode")
				let [err,res] = await this.$http.post('/user/changebindemail',{
					oldemail:this.old_email,
					email:this.new_email,
					emailcode:this.code2
				},{
					token:true,
					checkToken:true,
				});
				// 请求失败处理
				if (!this.$http.errorCheck(err,res)) return;
				// 成功
				this.isbind = true;
				// 修改状态，保存缓存
				console.log(res)
				let data = res.data.data;
				if (typeof data === 'boolean' && data) {
					this.User.email = this.new_email;
					this.User.userinfo.email = this.new_email
				}
				uni.setStorageSync("email",this.User.email);
				uni.setStorageSync("userinfo",this.User.userinfo);
				uni.showToast({title:"绑定成功",icon:"none"})
				uni.$emit('emailchanged',{msg:true})
				uni.navigateBack({delta:1});
			},
			async nooldemail(){
				console.log("nooldemail")
				let [err,res] = await this.$http.post('/user/bindemail',{
					email:this.new_email,
					emailcode:this.code2
				},{
					token:true,
					checkToken:true,
				});
				// 请求失败处理
				if (!this.$http.errorCheck(err,res)) return;
				// 成功
				this.isbind = true;
				// 修改状态，保存缓存
				console.log(res)
				let data = res.data.data;
				this.User.email = this.new_email;
				this.User.userinfo.email = this.new_email
				uni.setStorageSync("email",this.User.email);
				uni.setStorageSync("userinfo",this.User.userinfo);
				uni.showToast({title:"绑定成功",icon:"none"})
				uni.$emit('emailchanged',{msg:true})
				uni.navigateBack({delta:1});
			}
		}
	}
</script>

<style>
	.step_title>navigator{
		font-size: 23upx;
		color: #00AAFF;
		background: rgb(243,246,248)!important;
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
	.step2body{
		position: absolute;
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
	.hb-style-input>input{
		/* background: #09BB07; */
		font-size: 32upx;
		background: rgb(243,246,248);
		border-bottom: 1px solid #eeeeee;
	}
	.hb-style-input,.user-email{
		margin-bottom: 50upx;
		display: flex;
		align-items: center;
	}
	.user-email{
		height: 80upx;
	}
	.user-email>view:nth-child(1)>view{
		font-size: 33upx;
	}
</style>
