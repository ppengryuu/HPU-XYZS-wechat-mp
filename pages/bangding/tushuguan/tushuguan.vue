<template>
	<view class="body">
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		<!-- <button type="primary" @tap="sendmes">测试全局</button> -->
		<view class="login_title">
			绑定/重新绑定图书馆
		</view>
		<view class="policy_confirm">
			<text>* 获取你在图书馆的借阅信息\n* 绑定操作可能需要一段时间\n</text>
			<text v-if="isbindlib">* 你已绑定到账号：{{fixstunum}}，重新绑定以获取最新数据\n</text>
		</view>
		
		<view class="stepbody">
			<view class="input-line">
				<input class="uni-input" type="text" v-model="stunum" placeholder="图书馆账号/学号" />
			</view>
			<view class="input-line">
				<input class="uni-input" type="password" v-model="stupass" placeholder="密码" />
			</view>
			<view class="input-line" style="margin-bottom: 10rpx!important;">
				<input class="uni-input" type="text" v-model="captcha" :placeholder="'请输入验证码'" />
				<view class="u-f-ajc">
					<image v-if="codestatus" :src="captchaB64" mode="widthFix" style="height: auto;width: 180rpx;" @tap="refreshcode" @error="refreshcode()"></image>
					<view v-else style="color: #909090;">loading...</view>
				</view>
			</view>
			<view class="edit-tip"><view>* 点击图片刷新验证码</view></view>
			<label class="u-f-ac" v-on:click="switchsavepass(savepassword)">
				<checkbox :checked="savepassword" style="transform: scale(0.7);"/>
				<view>记住密码</view>
			</label>
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="buttondisabled" @tap="sumbit">绑定</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				fixstunum:"",
				stunum:'',
				stupass:'',
				isbindlib:false,
				buttondisabled:true,
				isbindschool:false,
				savepassword:false,
				captcha:"",
				captchaB64:"",
				codestatus:false,
				sessionID:"",
				config:{
					bgcolor:"#ffffff",
					title:"绑定图书馆", //title
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
		watch:{
			stupass(){
				if(this.stunum.length>0&&this.stupass.length>0){
					this.buttondisabled=false
				} else {
					this.buttondisabled=true
				}
			}
		},
		onLoad() {
			if(this.User.libbind){
				this.stunum = this.User.libbind.usernum
				this.fixstunum = this.stunum
				this.isbindlib = true
				var stupass = uni.getStorageSync('libpassword')
				if(stupass){
					// console.log(stupass)
					this.savepassword = true
					this.stupass = stupass
					this.buttondisabled = false
				}
			}
			this.getSession()
		},
		methods: {
			switchsavepass(savepassword){
				savepassword=!savepassword
				this.savepassword=savepassword
				console.log(this.savepassword)
			},
			refreshcode(){
				// this.publicM.sleep(600)
				this.codestatus = false;
				this.getSession()
			},
			async getSession(){
				let [err,res] = await this.$http.post("/app/lib/session",{
					user_id:this.User.userinfo.id
				},{
					token:true,
					checkToken:true
				})
				console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					uni.showToast({title:res.data.msg,icon:'none'})
					return;
				}
				this.captchaB64 = res.data.data.captcha;
				this.sessionID = res.data.data.sessionID;
				this.codestatus = true;
			},
			async sumbit(){
				uni.showLoading({ title: '请稍候...', mask: true });
				let [err,res] = await this.$http.post('/user/lib/loanlist',{
					usernum:this.stunum,
					password:this.stupass,
					captcha: this.captcha
				},{
					token:true,
					checkToken:true
				});
				console.log(res)
				// 绑定失败
				if (!this.$http.errorCheck(err,res)) return;
				this.User.libbind = {
					usernum : this.stunum
				}
				uni.setStorageSync("libbind", this.User.libbind);
				// 保存密码
				if(this.savepassword){
					uni.setStorageSync('libpassword',this.stupass)
				} else {
					uni.removeStorageSync('libpassword')
				}
				uni.setStorageSync("myborrowbook",res.data.data);
				uni.$emit('libbinddone',{msg:true})
				// 绑定成功
				uni.hideLoading();
				uni.showToast({
					title: '绑定成功！',
					duration:1000
				});
				setTimeout(function() {
					uni.navigateBack({
						delta:1
					})
				}, 1000);
			}
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
		border-bottom: 1upx solid #eeeeee;
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
