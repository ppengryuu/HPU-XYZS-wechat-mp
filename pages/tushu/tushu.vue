<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>
		
		<view v-if="libbind">
			<view class="user-lib-info">
				<view>概况</view>
				<view class="u-f-ac">
					<view>可借：{{max_borrow?max_borrow:"无"}}本</view>
					<view>现借：{{now_borrow?now_borrow:"无"}}本</view>
					<view>超期：{{exc_num?exc_num:"无"}}本</view>
					<view>欠款：{{debt?debt:"无"}}元</view>
				</view>
			</view>
			<view class="mini-title">现借</view>
			<block v-for="(item,i) in bookList" :key="i">
				<view class="book-item-list u-f" hover-class="book-list-hover" hover-stay-time="100" @tap="bookdetail(item)">
					<view class="book-cover u-f-ac">
						<image :src="!item.bookinfo?'../../static/img_load_error.png':item.bookinfo.cover_url" mode="widthFix" lazy-load></image>
					</view>
					<view class="info-part">
						<view>{{item.book_name?item.book_name:"无"}}</view>
						<view>馆藏地：{{item.lib_loc?item.lib_loc:"无"}}</view>
						<view>借书时间：{{item.borrow_date?item.borrow_date:"无"}}</view>
						<view>应还日期：{{item.return_date?item.return_date:"无"}}</view>
						<view>续借次数：{{item.renew_num?item.renew_num:"无"}}</view>
						<view><view style="width: 50%;">超期情况：{{item.exceedance?item.exceedance:"无"}}天</view><view style="width: 50%;">{{item.renewable?item.renewable:"无"}}</view></view>
					</view>
				</view>
			</block>
		</view>
		
		<view v-else>
			<text style="height: 500rpx;width: 100%;color: #909090;text-align: center;padding: 30rpx;box-sizing: border-box;" class="u-f-ajc">
				下拉绑定图书馆，查看借阅信息\n（注意：借阅信息不是实时同步更新，需要刷新以查看最新借阅信息）
			</text>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				libbind:false,
				bookList:[],
				max_borrow:'',
				now_borrow:'',
				exc_num:'',
				debt:'',
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
				this.max_borrow = this.User.libbind.max_borrow
				this.now_borrow = this.User.libbind.now_borrow
				this.exc_num = this.User.libbind.exc_num
				this.debt = this.User.libbind.debt
				var data = uni.getStorageSync('myborrowbook') // 数据
				// console.log(res)
				// console.log(data)
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
		}
	}
</script>

<style>
	.user-lib-info{
		box-sizing: border-box;
		padding: 20upx;
		color: #646464;
	}
	.user-lib-info>view:nth-child(1),.mini-title{
		color: #202020!important;
		font-size: 32upx;
	}
	.mini-title{
		box-sizing: border-box;
		padding: 0 20upx;
	}
	.user-lib-info>view:nth-child(2)>view{
		min-width: 18%;
		padding-left: 20upx;
	}
	.user-lib-info>view:nth-child(2)>view:nth-child(1){
		padding-left: 0!important;
	}
	.book-list-hover{
		background: #EEEEEE!important;
	}
	.info-part>view:first-child{
		padding-bottom: 15upx;
		font-size: 34upx!important;
		color: #2a2a2a!important;
	}
	.info-part>view{
		font-size: 23upx;
		color: #646464;
		overflow: hidden;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.info-part>view:last-child{
		display: flex!important;
	}
	.info-part>view:last-child>view{
		font-size: 23upx;
		overflow: hidden;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.info-part{
		/* display: inline-block; */
		box-sizing: border-box;
		/* border: 1upx solid #00A075; */
		width: 100%;
	}
	.book-cover>image{
		width: 180upx;
		height: auto;
	}
	.book-cover{
		margin-right: 20upx;
		width: 200upx;
	}
	.book-item-list{
		margin: 10upx 0;
		padding: 25upx 20upx;
		box-sizing: border-box;
		border-top: 1upx solid #EEEEEE;
		border-bottom: 1upx solid #EEEEEE;
		box-shadow: 2upx 0 2upx 0 #EEEEEE;
		/* border: 1upx solid #00A075; */
	}
</style>
