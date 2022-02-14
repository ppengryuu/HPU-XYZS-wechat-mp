<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<template v-if="firstload">
			<uni-search-bar radius="5" placeholder="搜索图书" clearButton="auto" cancelButton="none" v-model="searchtext" bodyBgColor="rgb(243,246,248)" @confirm="search" />
			<view class="u-f-ajc" style="height: 100upx;width: 100%;color: #909090;">输入关键词，按回车键搜索</view>
		</template>
		<template v-else>
			<block v-for="(item,index) in bookList" :key="index">
				<view class="search-book-list" hover-class="book-list-h" hover-stay-time="100" @tap="bookdetail(item)">
					<view class="book-name">{{item["0"]}}</view> <!-- 书名 -->
					<view class="book-seris-name">丛书名：{{item["1"]?item["1"]:"无"}}</view>
					<view class="book-auther">作家：{{item["3"]?item["3"]:"无"}}</view>
					<view class="book-ssh">索书号：{{item["2"]?item["2"]:"无"}}</view>
				</view>
			</block>
			
			<mix-load-more :status="loadMoreStatus"></mix-load-more>
		</template>
		
		
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	export default {
		components:{
			uniSearchBar,
			mixLoadMore
		},
		data() {
			return {
				searchtext:{},
				bookList:[],
				page:1,
				firstload:true,
				loadMoreStatus:0,
				config:{
					title:"搜索馆藏", //title
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
		onReady() {
			
		},
		onNavigationBarButtonTap(e) {
			// console.log(e.index)
			if(e.index == 0){
				this.getpage()
			}
		},
		onReachBottom() {
			this.loadmore()
		},
		methods: {
			bookdetail(item){
				uni.setStorageSync("bookDetail", item)
				uni.navigateTo({
					url:"../book-detail/book-detail"
				})
			},
			async search(){
				// console.log(this.searchtext)
				// console.log('搜索')
				if(!this.searchtext.value) return uni.showToast({title:"搜索内容不能为空",icon:"none"})
				uni.hideKeyboard()
				if(this.firstload){uni.showLoading({title:"加载中"})}
				let [err,res] =await this.$http.post('/app/searchlib',{
					keyword:this.searchtext.value,
					page:this.page
				},{
					token:true,
					checkToken:true
				});
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				var data = res.data.data
				if(data == null) return uni.showToast({
					title:"没有符合条件的书籍",
					icon:"none"
				})
				this.bookList = this.page > 1 ? this.bookList.concat(data) : data;
				if (data.length < 10) {
					this.loadMoreStatus=2
				}else{
					this.loadMoreStatus=0
				}
				if(this.firstload) {uni.hideLoading()}
				this.firstload=false;
			},
			//上拉加载
			loadmore(index){
				//修改状态
				if(this.loadMoreStatus === 2){
					return;
				}
				this.loadMoreStatus = 1;
				//获取数据
				this.page++
				this.search()
				//this.loadmoretext="没有了~"
			},
			buttonTap(e){
				if(e.index==0){
					if(this.firstload){
						this.publicM.back1()
					} else {
						this.firstload = true
						this.bookList = []
						this.searchtext = {}
					}
				}
			}
		}
	}
</script>

<style>
	.book-list-h{
		background: #EEEEEE!important;
	}
	.search-book-list{
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 20rpx;
		border-bottom: 1px solid #EEEEEE;
		display: flex;
		flex-wrap: wrap;
	}
	.book-name{
		width: 100%;
		font-size: 32rpx;
		padding: 0 0 15rpx 0;
	}
	.book-seris-name{
		width: 50%;
		font-size: 25rpx;
	}
	.book-auther{
		width: 50%;
		font-size: 25rpx
	}
	.book-ssh{
		width: 100%;
		color: #800000;
		font-size: 25rpx;
	}
	
	.book-seris-name, .book-auther, .book-ssh, .book-name{
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
</style>
