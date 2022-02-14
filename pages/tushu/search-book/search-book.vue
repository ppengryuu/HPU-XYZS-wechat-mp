<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<template v-if="firstload">
			<uni-search-bar radius="5" :placeholder="searchFieldPH" clearButton="auto" cancelButton="none" v-model="searchtext" bodyBgColor="rgb(243,246,248)" @confirm="search()" ref="uniSearchBar" />
			<view class="u-f-ajc" style="height: 100upx;width: 100%;color: #909090;">输入关键词，按回车键搜索</view>
			<view class="search-histroy-part">
				<view class="s-h-p-title u-f-jsb">
					<view class="u-f-ajc">
						<view>
							搜索历史
						</view>
					</view>
					<view @tap="clearSearchHistory()" class="u-f-ajc">
						<view>清空</view>
					</view>
				</view>
				<block v-for="(hitem, hindex) in searchHistroy" :key="hindex">
					<view class="s-h-item" hover-stay-time="100" hover-class="s-h-item-hover" @tap='useSelHistory(hitem)'>
						{{hitem.value}}
					</view>
				</block>
				<view style="height: 200rpx;"></view>
			</view>
		</template>
		<template v-else>
			<view class="book-num-found">
				共<span style="color: #800000;">{{bookNumFound}}</span>条结果
			</view>
			<block v-for="(item,index) in bookList" :key="index">
				<view class="search-book-list" hover-class="book-list-h" hover-stay-time="100" @tap="bookdetail(item)">
					<view class="book-left-cover">
						<image :src="item.bookCover?item.bookCover:'../../../static/images/bookDefaultCover.png'" mode="widthFix"></image>
					</view>
					<view class="book-right-info">
						<view class="book-name">
							<span 
							v-if="item.docName" 
							style="font-size: 30rpx;background: #02a799;border-radius: 4rpx;padding: 4rpx 8rpx;margin: 0 6rpx;color: #FFFFFF;">
								{{item.docName}}
							</span>
							<span>
								{{item.title}}
							</span>
						</view> <!-- 书名 -->
						<view class="book-auther">
							责任者：{{item.author?item.author:"无"}}
						</view>
						<view class="book-pub">
							出版社：{{(item.publisher?item.publisher:"无")+"，"+(item.publishYear?item.publishYear:"")}}
						</view>
						<view class="book-ssh">
							中图法分类号：
							<span style="color: #800000;">{{item.callNoOne?item.callNoOne:"无"}}</span>
						</view>
						<view class="book-collection">
							馆藏总数：
							<span style="color: #800000;">{{item.physicalCount?item.physicalCount:"无"}}</span>
						</view>
						<view class="book-collection">
							在架数量：
							<span style="color: #800000;">{{item.onShelfCountI?item.onShelfCountI:"无"}}</span>
						</view>
					</view>
					
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
				loadMoreStatus:1,
				bookNumFound: 0,
				searchFieldPH: '请输入关键词',
				searchHistroy: [],
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
		computed:{
			
		},
		onReady() {
			
		},
		onLoad(){
			var s = uni.getStorageSync('bookSearchHistory')
			if(s){
				this.searchHistroy = s
			}
		},
		onNavigationBarButtonTap(e) {
			// console.log(e.index)
			if(e.index == 0){
				this.getpage()
			}
		},
		onReachBottom() {
			this.firstload?{}:this.loadmore()
		},
		methods: {
			clearSearchHistory(){
				this.searchHistroy = []
				uni.setStorageSync('bookSearchHistory', [])
			},
			useSelHistory(item){
				this.searchtext.value = item.value
				this.$refs.uniSearchBar.searchClick(item.value)
			},
			bookdetail(item){
				uni.setStorageSync("bookDetail", item)
				uni.navigateTo({
					url:"../book-detail/book-detail"
				})
			},
			addHistory(){
				var newItem = this.searchtext.value
				for (var i = 0; i < this.searchHistroy.length; i++) {
				    if (this.searchHistroy[i].value === newItem) {
				        this.searchHistroy.splice(i, 1); 
						this.searchHistroy.unshift({
							value: newItem
						}); 
						uni.setStorageSync('bookSearchHistory', this.searchHistroy)
				        return true
				    }
				}
				if(this.searchHistroy.length >= 20){
					this.searchHistroy.unshift({
						value: newItem
					})
					this.searchHistroy = this.searchHistroy.slice(0,20)
					uni.setStorageSync('bookSearchHistory', this.searchHistroy)
					return true
				}
				this.searchHistroy.unshift({
						value: newItem
					})
				uni.setStorageSync('bookSearchHistory', this.searchHistroy)
				return true
			},
			async search(){
				this.addHistory()
				// console.log(this.searchtext)
				// console.log('搜索')
				if(!this.searchtext.value) return uni.showToast({title:"搜索内容不能为空",icon:"none"})
				uni.hideKeyboard()
				if(this.firstload){uni.showLoading({title:"加载中"})}
				let [err,res] =await this.$http.post('/app/lib/search',{
					keyword: encodeURI(this.searchtext.value),
					page:this.page
				},{
					token:true,
					checkToken:true
				});
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				var numFound = res.data.data.numFound
				var pageSize = res.data.data.pageSize
				this.bookNumFound = numFound
				var data = res.data.data.searchResult
				if(numFound == 0) return uni.showToast({
					title:"没有符合条件的书籍",
					icon:"none"
				})
				this.bookList = this.page > 1 ? this.bookList.concat(data) : data;
				if (data.length < pageSize) {
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
						this.page = 1
						this.bookNumFound = 0
						this.bookList = []
						// this.searchtext.value = ''
						// this.$refs.uniSearchBar.searchClick()
					}
				}
			}
		}
	}
</script>

<style>
	.s-h-item-hover{
		background: #EEEEEE!important;
	}
	.s-h-item{
		padding: 12rpx 20rpx;
		color: #0C0C0C;
		font-size: 30rpx;
		border-bottom: 1px solid #EEEEEE;
		background-color: #FFFFFF;
	}
	.s-h-p-title{
		border-bottom: 1px solid #EEEEEE;
		padding: 16rpx 20rpx;
	}
	.s-h-p-title>view:first-child>view{
		font-size: 32rpx;
		color: #0c0c0c;
	}
	.s-h-p-title>view:last-child>view{
		color: #4696ff;
		font-size: 30rpx;
	}
	.search-histroy-part{
		padding-top: 20rpx;
	}
	.book-list-h{
		background: #EEEEEE!important;
	}
	.book-num-found{
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		border-bottom: 1px solid #EEEEEE;
		display: flex;
		align-items: center;
	}
	.search-book-list{
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 20rpx;
		border-bottom: 1px solid #EEEEEE;
		display: flex;
		align-items: center;
	}
	.book-name{
		width: 100%;
		font-size: 34rpx;
		padding: 0 0 15rpx 0;
	}
	.book-collection{
		width: 50%;
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
</style>
