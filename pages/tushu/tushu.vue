<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>
		
		<view v-if="libbind">
			
			<view class="mini-title">我的借阅</view>
			
			<view v-if="bookList.length > 0">
				<block v-for="(item,i) in bookList" :key="i">
					<view class="search-book-list" hover-class="book-list-h" hover-stay-time="100" @tap="bookdetail(item)">
						<view class="book-left-cover">
							<image :src="item.bookCover?item.bookCover:'../../static/images/bookDefaultCover.png'" mode="widthFix"></image>
						</view>
						<view class="book-right-info">
							<view class="book-name">
								{{item.title}}
							</view> <!-- 书名 -->
							<view class="book-auther">
								所属地：{{item.locationName?item.locationName:"无"}}
							</view>
							<view class="book-pub">
								条码：{{item.barcode?item.barcode:"无"}}
							</view>
							<view class="book-ssh">
								借出日期：
								{{item.loanDate?item.loanDate:"无"}}
							</view>
							<view class="book-co">
								应还日期：
								{{item.normReturnDate?item.normReturnDate:"无"}}
							</view>
						</view>
						
					</view>
				</block>
				<view style="height: 80rpx;"></view>
			</view>
			
			<view v-else>
				<view style="height: 500rpx;width: 100%;color: #909090;text-align: center;padding: 30rpx;box-sizing: border-box;flex-direction: column;" class="u-f-ajc">
					<view>当前无借阅记录，下拉重新绑定图书馆以刷新数据</view>
					<view>（注意：借阅信息不是实时同步更新，需要刷新以查看最新借阅信息）</view>
					<view>Tips: 去搜索馆藏找找喜欢的书吧！</view>
				</view>
			</view>
			
		</view>
		
		<view v-else>
			<view style="height: 500rpx;width: 100%;color: #909090;text-align: center;padding: 30rpx;box-sizing: border-box;flex-direction: column;" class="u-f-ajc">
				<view>下拉绑定图书馆，获取图书馆借阅数据</view>
				<view>（注意：借阅信息不是实时同步更新，需要刷新以查看最新借阅信息）</view>
				<view>Tips: 去搜索馆藏找找喜欢的书吧！</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				libbind:false,
				bookList:[],
				config:{
					title:"图书馆", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							iconfont:"icon-sousuo1",
							text:"馆藏"
						}
					]
				}

			}
		},
		async onPullDownRefresh() {
			uni.stopPullDownRefresh()
			uni.navigateTo({
				url:'../bangding/tushuguan/tushuguan'
			})
		},
		onReady() {
			uni.hideLoading()
		},
		onLoad() {
			this.libbind = this.User.libbind
			uni.$on('libbinddone',this.getMyBorrow)
			uni.$on('logindone',this.getMyBorrow)
			this.getMyBorrow()
		},
		methods: {
			buttonTap(e){
				if(e.index == 0){
					this.publicM.back1()
				} else if(e.index==1){
					uni.navigateTo({
						url:"search-book/search-book"
					})
				}
			},
			getMyBorrow(){
				this.libbind = this.User.libbind
				var data = uni.getStorageSync('myborrowbook') // 数据
				this.bookList = data
			},
			bookdetail(item){
				console.log(item)
				item.id = item.book_id
				uni.setStorageSync("bookDetail", item)
				uni.navigateTo({
					url:"book-detail/book-detail"
				})
			},
			bookCoverImgError(e){
				if(e.bookinfo.cover_url == '../../static/img_load_error.png') return;
				e.bookinfo.cover_url = '../../static/img_load_error.png'
			}
		}
	}
</script>

<style>
	.book-name{
		width: 100%;
		font-size: 34rpx;
		padding: 0 0 15rpx 0;
	}
	.book-co{
		width: 100%;
		font-size: 26rpx
	}
	.book-ssh, .book-auther, .book-pub{
		width: 100%;
		font-size: 26rpx;
	}
	
	.book-pub, .book-auther, .book-ssh, .book-name{
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.search-book-list{
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 20rpx;
		border-bottom: 1px solid #EEEEEE;
		display: flex;
		align-items: center;
	}
	.book-list-h{
		background: #EEEEEE!important;
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
	
	
	
	.mini-title{
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		border-bottom: 1px solid #EEEEEE;
		display: flex;
		align-items: center;
	}
	
	page{
		background: #f3f6f8;
	}
</style>
