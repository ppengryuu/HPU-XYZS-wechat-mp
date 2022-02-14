<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.back1()"/>
		<!-- <view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view> -->
		
		<view class="step1body" :class="step1">
			<view class="step_title">
				<view>查询体测成绩</view>
			</view>
			
			<view class="input-line">
				<input class="uni-input" type="text" v-model="usernum" :placeholder="'请输入学号'" />
			</view>
			<view class="input-line" style="margin-bottom: 10rpx!important;">
				<input class="uni-input" type="password" v-model="userpwd" :placeholder="'请输入密码'" />
			</view>
			<view class="edit-tip"><view>* 默认为身份证号后8位</view></view>
			<view class="input-line" style="margin-bottom: 10rpx!important;">
				<input class="uni-input" type="text" v-model="tccode" :placeholder="'请输入验证码'" />
				<view class="u-f-ajc">
					<image v-if="codestatus" :src="vcimg" mode="widthFix" style="height: auto;width: 180rpx;" @tap="refreshcode" @error="refreshcode()"></image>
					<view v-else style="color: #909090;">loading...</view>
				</view>
			</view>
			<view class="edit-tip"><view>* 点击图片刷新验证码</view></view>
			<label class="splabel u-f-ac" v-on:click="switchsavepass(savepassword)">
				<checkbox :checked="savepassword" style="transform: scale(0.7);"/>
				<view>记住密码</view>
			</label>
			
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="button1disabled" @tap="submit">查询</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				usernum:"",
				userpwd:"",
				tccode:"",
				vcimg:"0",
				codestatus:0,
				savepassword:false,
				config:{
					title:"查询体测成绩", //title
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
			var ecAcc = uni.getStorageSync("tcAccount")
			if(ecAcc){
				this.usernum = ecAcc.account
				this.userpwd = ecAcc.password
				this.savepassword = ecAcc.password?true:false
			} else if (this.User.schoolbind){
				this.usernum=this.User.schoolbind.jwzh
			}
			this.getcode()
		},
		methods: {
			refreshcode(){
				this.codestatus = 0
				this.getcode()
			},
			async getcode(){
				let [err,res] = await this.$http.get('/app/hpuvpn/tc/code',{
					user_id:this.User.userinfo.id,
				});
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				this.vcimg = res.data.data
				this.codestatus = 1
			},
			async submit(){
				if(!this.usernum) return uni.showToast({icon:"none",title:"请输入学号"})
				if(!this.userpwd) return uni.showToast({icon:"none",title:"请输入密码"})
				if(!this.tccode) return uni.showToast({icon:"none",title:"请输入验证码"})
				uni.showLoading({
					title:"获取数据中..."
				})
				let [err,res] = await this.$http.post('/app/hpuvpn/tc/grade',{
					user_id:this.User.userinfo.id,
					usernum:this.usernum?this.usernum:"",
					userpwd:this.userpwd?this.userpwd:"",
					captcha:this.tccode?this.tccode:""
				});
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				uni.setStorageSync("tcAccount", {
					account:this.usernum,
					password:this.savepassword?this.userpwd:""
				})
				uni.setStorageSync("ticeGradeTmp", res.data.data)
				uni.hideLoading()
				uni.navigateTo({
					url: "tice-grade-res/tice-grade-res"
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
