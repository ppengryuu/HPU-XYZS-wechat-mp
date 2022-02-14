<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<view>
			<view class="mini-title">图书详情</view>
			
			<view class="book-info-part">
				<view class="search-book-list">
					<view class="book-left-cover">
						<image :src="book_data.bookCover?book_data.bookCover:'../../../static/images/bookDefaultCover.png'" mode="widthFix" @tap="previewImg(book_data.bookCover)"></image>
					</view>
					<view class="book-right-info">
						<view class="book-name">
							<span 
							v-if="book_data.docName" 
							style="font-size: 30rpx;background: #02a799;border-radius: 4rpx;padding: 4rpx 8rpx;margin: 0 6rpx;color: #FFFFFF;">
								{{book_data.docName}}
							</span>
							<span>
								{{book_data.title}}
							</span>
						</view> <!-- 书名 -->
						<view class="book-auther">
							责任者：{{book_data.author?book_data.author:"无"}}
						</view>
						<view class="book-pub">
							出版社：{{(book_data.publisher?book_data.publisher:"无")+"，"+(book_data.publishYear?book_data.publishYear:"")}}
						</view>
						<!-- <view class="book-ssh">
							中图法分类号：
							<span style="color: #800000;">{{book_data.callNoOne?book_data.callNoOne:"无"}}</span>
						</view> -->
					</view>
					
				</view>
				<block v-for="(item, index) in book_detail" :key="index">
					<view class="book-detail-part">
						<view class="book-detail-item">
							{{item.description}}：
							<span style="color: #333333!important;">
								{{item.fieldVal}}
							</span>
						</view>
					</view>
				</block>
			</view>
			<view style="height: 80rpx;"></view>
			
			<view class="mini-title">馆藏信息</view>
			
			<view class="book-collection-part">
				
				<block v-for="(item, index) in book_coll" :key="index">
					
					<view class="book-collection-item">
						<view class="b-c-i-part1 u-f-ajc">
							<view class="b-c-cln">
								{{item.locationName?item.locationName:"未知"}}
							</view>
							<view class="b-c-sn">
								{{item.shelfNo?item.shelfNo:''}}
							</view>
							<view class="b-c-pt">
								书刊状态：{{item.processType?item.processType:'未知'}}
							</view>
						</view>
						<view class="b-c-bc">
							条码：{{item.barcode?item.barcode:"无"}}
						</view>
						<view class="b-c-cn">
							索书号：
							<span style="color: #800000;">{{item.callNo?item.callNo:"无"}}</span>
						</view>
					</view>
					
				</block>
				
			</view>
			
			
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
				book_detail:{},
				book_coll:{},
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
			// uni.removeStorageSync("bookDetail")
			this.book_data = a
			console.log(a)
			this.getBookDetail(a.recordId)
		},
		methods: {
			previewImg(src){
				src = src?src:'../../../static/images/bookDefaultCover.png'
				console.log(src)
				uni.previewImage({
					current: src,
					urls:[src]
				})
			},
			async getBookDetail(id){
				// 获取书籍信息 isbn^
				let [err0,res0] =await this.$http.post('/app/lib/book/detail',{
					record_id: id
				},{
					token:true,
					checkToken:true
				});
				console.log(res0)
				if (!this.$http.errorCheck(err0,res0)) return;
				var d = res0.data.data.bean2ListR
				this.book_detail = d
				// 获取馆藏
				let [err,res] =await this.$http.post('/app/lib/book/collection',{
					record_id: id
				},{
					token:true,
					checkToken:true
				});
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				var data = res.data.data
				if(!data) return uni.showToast({
					title:"获取馆藏信息失败",
					icon:"none"
				})
				this.book_coll = data.list
				console.log(this.book_coll)
				// this.dataReady = true
				uni.hideLoading()
			},
			async goDouBan(){
				uni.showLoading({title:"加载中"})
				let [err,res] =await this.$http.get('/app/lib/book/detail/douban/subjectid',{
					isbn: this.book_data.isbn
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
	.b-c-pt{
		font-size: 30rpx;
	}
	.b-c-sn{
		font-size: 35rpx;
	}
	.b-c-cln{
		/* color: #00A075; */
		font-size: 38rpx;
	}
	.b-c-i-part1{
		flex-direction: column;
		padding: 12rpx 0;
	}
	
	.book-collection-item{
		padding: 26rpx;
		box-sizing: border-box;
		margin: 32rpx 20rpx;
		border-radius: 12rpx;
		border: 1px solid #EEEEEE;
		background: #FFFFFF;
	}
	
	
	.book-detail-item{
		padding: 12rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #EEEEEE;
		background: #FFFFFF;
		font-size: 30rpx;
		color: #0C0C0C;
	}
	
	.book-ssh, .book-auther, .book-pub{
		width: 100%;
		font-size: 26rpx;
	}
	.book-name{
		width: 100%;
		font-size: 34rpx;
		padding: 0 0 15rpx 0;
	}
	.book-left-cover{
		width: 26%;
		padding: 12rpx;
		display: flex;
		align-items: center;
	}
	
	.book-left-cover>image{
		width: 100%;
		height: auto;
	}
	
	.book-right-info{
		width: 74%;
		/* background: #00A075; */
		display: flex;
		flex-wrap: wrap;
	}
	.search-book-list{
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 20rpx;
		border-bottom: 1px solid #EEEEEE;
		display: flex;
		align-items: center;
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
