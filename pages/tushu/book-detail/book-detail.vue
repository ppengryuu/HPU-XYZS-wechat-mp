<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<view v-if="dataReady">
			<view class="mini-title">图书详情</view>
			<view class="detail-item">
				<view>书名：{{book_data["0"]?book_data["0"]:"无"}}</view>
				<view>丛书名：{{book_data["1"]?book_data["1"]:"无"}}</view>
				<view>索书号：{{book_data["2"]?book_data["2"]:"无"}}</view>
				<view>作家：{{book_data["3"]?book_data["3"]:"无"}}</view>
				<view>出版社：{{book_data["4"]?book_data["4"]:"无"}}</view>
				<view>出版时间：{{book_data["5"]?book_data["5"]:"无"}}</view>
				<view>主题词：{{book_data["6"]?book_data["6"]:"无"}}</view>
				<view>语种：{{book_data["7"]?book_data["7"]:"无"}}</view>
			</view>
			<view class="mini-title">馆藏信息</view>
			<block v-for="(item,i) in book_coll" :key="i">
				<view class="detail-box">
					<view class="detail-loc1">{{item.loc1}}</view>
					<view class="detail-loc2">
						{{item.loc2}}
					</view>
					<view class="detail-status" :style="{color:item.status=='可借'?'#00A075':'#ff3542'}">{{item.status}}</view>
					<view class="detail-libn">馆藏号：{{item.libn?item.libn:"无"}}</view>
					<view class="detail-code">条形号：{{item.code?item.code:"无"}}</view>
					<view class="detail-outTime" v-if="item.outTime">借出时间：{{item.outTime?item.outTime:"无"}}</view>
					<view class="detail-backTime" v-if="item.backTime">应还时间：{{item.backTime?item.backTime:"无"}}</view>
				</view>
			</block>
			
			<view style="height: 300rpx;"></view>
			<view class="dbbutton">
				<button type="primary" class="verifybutton" hover-class="verifybuttonhover" @tap="goDouBan">豆瓣评分</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				book_data:{},
				book_coll:{},
				dataReady:false,
				config:{
					title:"图书详情", //title
					bgcolor:"#f8f8f8", //背景颜色
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
		onReady() {  
			
		},
		onLoad(e) {
			uni.showLoading({title:"加载中"})
			var a = uni.getStorageSync("bookDetail")
			uni.removeStorageSync("bookDetail")
			console.log(a)
			this.getBookDetail(a.id)
		},
		methods: {
			async getBookDetail(id){
				// 获取书籍信息 isbn^
				let [err0,res0] =await this.$http.post('/app/bookinfo',{
					id:id
				},{
				token:true,
				checkToken:true
				});
				console.log(res0)
				if (!this.$http.errorCheck(err0,res0)) return;
				var d = res0.data.data
				this.book_data = d
				// 获取馆藏
				let [err,res] =await this.$http.post('/app/bookcoll',{
					id:id
				},{
					token:true,
					checkToken:true
				});
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				var data = res.data.data
				if(data == null) return uni.showToast({
					title:"错误",
					icon:"none"
				})
				this.book_coll = data
				console.log(this.book_coll)
				this.dataReady = true
				uni.hideLoading()
			},
			async goDouBan(){
				uni.showLoading({title:"加载中"})
				let [err,res] =await this.$http.post('/app/doubanid',{
					isbn: this.book_data["8"]
				},{
					token:true,
					checkToken:true
				});
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				var id = res.data.data
				uni.hideLoading()
				uni.navigateToMiniProgram({
					appId: 'wx2f9b06c1de1ccfca',
					path: "/pages/subject/subject?id="+id+"&type=book",
				})
			}
		}
	}
</script>

<style>
	.detail-libn, .detail-code{
		width: 50%;
	}
	.detail-libn, .detail-code, .detail-outTime, .detail-backTime{
		font-size: 28rpx;
	}
	.detail-loc1{
		font-size: 36rpx!important;
	}
	.detail-status{
		font-size: 28rpx!important;
	}
	.detail-loc1, .detail-loc2, .detail-status{
		text-align: center;
		font-size: 32rpx
	}
	.detail-box{
		/* color: #00A075;
		color: #ff3542; */
		background: #FFFFFF;
		border-radius: 8rpx;
		box-sizing: border-box;
		padding: 30rpx;
		margin: 20rpx 30rpx;
	}
	
	
	.detail-item>view{
		padding: 10upx 30upx;
		border-top: 1upx dashed #e4e4e4;
		color: #323232;
		word-break: break-all;
	}
	.detail-item>view:last-child{
		border-bottom: 1upx dashed #e4e4e4;
	}
	.mini-title{
		color: #323232!important;
		font-size: 36upx;
		text-align: center;
		box-sizing: border-box;
		padding: 20upx 0;
	}
	
	.dbbutton{
		position: fixed;
		bottom: 0;
		padding: 20upx 0;
		width: 96%;
		margin-left: 2%;
	}
	.verifybuttonhover[type=primary]{
		background: #2a8236!important;
	}
	.verifybutton{
		background: #329841!important;
		border-radius: 50upx!important;
	}
	button::after{ border: none;}
</style>
