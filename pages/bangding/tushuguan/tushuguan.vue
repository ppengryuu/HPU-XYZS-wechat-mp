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
				this.stunum = this.User.libbind.lib_userid
				this.fixstunum = this.stunum
				this.isbindlib = true
			}
			var stupass = uni.getStorageSync('libpassword')
			if(stupass){
				// console.log(stupass)
				this.savepassword = true
				this.stupass = stupass
				this.buttondisabled = false
			}
		},
		methods: {
			switchsavepass(savepassword){
				savepassword=!savepassword
				this.savepassword=savepassword
				console.log(this.savepassword)
			},
			async sumbit(){
				uni.showLoading({ title: '验证中...', mask: true });
				let [err,res] = await this.$http.post('/user/bindlib',{
					libuserid:this.stunum,
					libpassword:this.stupass
				},{
					token:true,
					checkToken:true
				});
				// 绑定失败
				if (!this.$http.errorCheck(err,res)) {
					uni.showToast({title:res.data.msg,icon:'none'})
					return uni.hideLoading();
				}
				this.User.libbind = res.data.data
				uni.setStorageSync("libbind",res.data.data);
				// 保存密码
				if(this.savepassword){
					uni.setStorageSync('libpassword',this.stupass)
				} else {
					uni.removeStorageSync('libpassword')
				}
				// console.log(res)
				uni.showLoading({ title: '获取数据...', mask: true });
				let [err1,res1] = await this.$http.get('/user/getborrowbook',{},{
					token:true,
					checkToken:true
				});
				// 获取失败
				if (!this.$http.errorCheck(err1,res1)) {
					uni.showToast({title:res1.data.msg,icon:'none'})
					return uni.hideLoading();
				}
				uni.setStorageSync("myborrowbook",res1.data.data);
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
