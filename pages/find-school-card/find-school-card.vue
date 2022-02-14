<template>
	<view class="body">
		<navigation-custom :config="config" @buttonTap="buttonTap"/>

		<view class="edit-tip" style="padding: 10rpx 0;"><view>* 如果失主已注册并绑定邮箱，发布成功后将以邮件的方式通知失主</view></view>
		<view class="ta-item">
			<view class="left-title">卡号</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="20" placeholder="卡号" show-confirm-bar="false" v-model="cardnum" cursor-spacing="0" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="edit-tip"><view>* 输入校园卡上的学号，必填</view><view> {{cardnum.length+'/20'}}</view></view>
		
		<view class="ta-item">
			<view class="left-title">我的联系方式</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="20" placeholder="我的联系方式" show-confirm-bar="false" v-model="mycontact" cursor-spacing="0" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="edit-tip"><view>* 留下你的联系方式，QQ号或手机号等</view><view> {{mycontact.length+'/20'}}</view></view>
		
		<view class="ta-item">
			<view class="left-title">自取地点</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="自取地点" show-confirm-bar="false" v-model="selfpick" cursor-spacing="0" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="edit-tip"><view>* 我已交至招领处，失主需自取</view><view> {{selfpick.length+'/100'}}</view></view>
		
		<view class="ta-item">
			<view class="left-title">添加描述</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="添加描述，介绍一下拾取地点等信息" show-confirm-bar="false" v-model="carddescribe" cursor-spacing="0" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="edit-tip"><view>* 最长100个字符 </view><view> {{carddescribe.length+'/100'}}</view></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardnum:'',
				mycontact:'',
				selfpick:'',
				carddescribe:'',
				canSumbit:false,
				
				config:{
					title:"捡到校园卡", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							text:"提交"
						}
					]
				}

			}
		},
		onLoad() {
			if(!this.User.token){
				return uni.navigateTo({
					url:"../user-login/user-login"
				})
			}
		},
		watch:{
			cardnum(){
				
			}
		},
		methods: {
			buttonTap(e){
				if(e.index==0){
					this.publicM.back1()
				} else if(e.index==1){
					this.submit()
				}
			},
			async submit(){
				if(this.cardnum.length==0){return uni.showToast({title:"卡号不能为空",icon:"none"})}
				if(this.mycontact.length==0&&this.selfpick.length==0){return uni.showToast({title:"联系方式和自取地点至少填写一项",icon:"none"})}
				uni.showLoading({ title: '发布中...', mask: true });
				let [err,res] = await this.$http.post('/user/findcard',{
					cardnum:this.cardnum,
					contactway:this.mycontact,
					selfpick:this.selfpick,
					describe:this.carddescribe,
				},{
					token:true,
					checkToken:true
				});
				if (!this.$http.errorCheck(err,res)) return;
				console.log(res)
				if(res.data.data){
					uni.showToast({
						title:'发布成功',
						duration:1000,
						icon:'success'
					})
					setTimeout(function() {
						uni.navigateBack({
							delta:1
						})
					}, 1000);
				} else {
					uni.showToast({title:"发布失败",icon:"none"})
				}
			}
		}
	}
</script>

<style>
	.edit-tip{
		display: flex;
		flex-direction: row;
		width: 96%;
		justify-content: space-between;
		padding-bottom: 10upx;
	}
	.edit-tip view{
		margin-left: 20upx;
		font-size: 22upx;
		color: #9B9B9B;
	}
	.phclass{
		color: #c8c8c8;
		height: auto;
	}
	
	
	
	.ta-item{
		margin: 36upx 0 20upx 0;
		display: flex;
		align-items: center;
		/* background: #00A075; */
	}
	.left-title{
		font-size: 30upx;
		margin-left: 5%;
		/* background: #0086B3; */
		display: flex;
		line-height: 1;
		align-items: center;
		width: 25%;
	}
	.midta{
		width: 60%;
	}
	.midta>view{
		min-height: 28upx;
		/* background: #00A075; */
		width: 100%;
		word-break: break-all;
		font-size: 28upx; 
	}
	.midta>input{
		width: 100%;
		font-size: 28upx;
		line-height: 1;
	}
	.midta>textarea{
		width: 100%;
		font-size: 28upx;
	}
	.ta-item>view:nth-child(3){
		color: #9B9B9B;
		width: 5%;
		text-align: center;
	}
</style>
