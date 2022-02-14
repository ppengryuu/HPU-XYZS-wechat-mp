<template>
	<view class="body">
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		<!-- <button type="primary" @tap="sendmes">测试全局</button> -->
		<view class="login_title">
			登录校外访问VPN
		</view>
		<view class="policy_confirm">
			<text>* 该操作可能需要一段时间\n</text>
		</view>
		
		<view class="stepbody">
			<view class="input-line">
				<input class="uni-input" type="text" v-model="stunum" placeholder="校园网账号/学号" />
			</view>
			<view class="input-line" style="margin-bottom: 10rpx!important;">
				<input class="uni-input" type="password" v-model="stupass" placeholder="校园网密码" />
			</view>
			<view class="edit-tip"><view>* 默认为身份证号后6位</view></view>
			<label class="u-f-ac" v-on:click="switchsavepass(savepassword)">
				<checkbox :checked="savepassword" style="transform: scale(0.7);"/>
				<view>记住密码</view>
			</label>
			
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" @tap="sumbit">确定</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				stunum:'',
				stupass:'',
				savepassword:false,
				redirect:"",
				config:{
					bgcolor:"#ffffff",
					title:"登录校外访问VPN", //title
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							text:"返回"
						}
					]
				}
			}
		},
		computed:{
			
		},
		watch:{
			
		},
		onShow() {
			
		},
		onLoad(e) {
			console.log(e)
			this.redirect = e.redirect
			var ecAcc = uni.getStorageSync("vpnAccount")
			if(ecAcc){
				this.stunum = ecAcc.account
				this.stupass = ecAcc.password
				this.savepassword = ecAcc.password?true:false
			} else if (this.User.schoolbind){
				this.stunum=this.User.schoolbind.jwzh
				var stupass = uni.getStorageSync('easpassword')
				if(stupass){
					this.savepassword = true
					this.stupass = stupass
				}
			}
		},
		methods: {
			switchsavepass(savepassword){
				savepassword=!savepassword
				this.savepassword=savepassword
				console.log(this.savepassword)
			},
			async sumbit(){
				console.log(this.savepassword)
				if(!this.stunum) return uni.showToast({icon:"none",title:"学号不能为空"});
				if(!this.stupass) return uni.showToast({icon:"none",title:"密码不能为空"});
				uni.showLoading({ title: '验证中...', mask: true });
				
				let [err,res] = await this.$http.post('/app/hpuvpn/login',{
					user_id:this.User.userinfo.id,
					jwzh:this.stunum,
					jwmm:this.stupass
				},{
					token:true,
					checkToken:true
				}); 
				console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					// plus.nativeUI.toast(res.data.msg)
					return;
				}
				uni.setStorageSync("vpnAccount", {
					account:this.stunum,
					password:this.savepassword?this.stupass:""
				})
				uni.hideLoading()
				uni.navigateTo({
					url:this.redirect
				})
				
				
			},
		}
	}
</script>

<style>
	.edit-tip{
		margin-bottom: 30upx;
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
	
	
	.policy_confirm{
		font-size: 22upx;
		padding: 20upx 50upx;
		box-sizing: border-box;
	}
	.policy_confirm>text{
		color: #929292;
		font-size: 22upx;
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
	.stepbody{
		width: 100%;
		position: absolute;
		padding: 10upx 30upx 0 30upx;
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
	.input-line>input{
		/* background: #09BB07; */
		font-size: 32upx;
		border-bottom: 1px solid #eeeeee;
	}
	.input-line{
		margin-bottom: 50upx;
		display: flex;
		align-items: center;
	}
	.stepbody>view:nth-child(2){
		margin-bottom: 20upx!important;
	}
	.stepbody>label{
		margin-left: 12upx;
		margin-bottom: 30upx;
		color: #646464;
	}
	
</style>
