<template>
	<view>
		<navigation-custom :config="barConfig" @buttonTap="publicM.back1()"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<block v-for="(item, m) in dataList" :key="m">
			<view class="logis-item-list" hover-class="lil-hover" :hover-stay-time="100" @tap="viewDetail(item)">
				<view class="list-top u-f-jsb u-f-ac">
					<view class="list-top-left">
						<view>提交时间：{{item.date}}</view>
						<view>单号：{{item.repairNo}}</view>
					</view>
					<view class="list-top-right">
						<view>状态：{{item.statusNames}}</view>
					</view>
				</view>
				<view class="list-mid">
					<view class="list-content">
						<view>{{item.content}}</view>
					</view>
					<view class="content-images">
						<view v-for="(img, n) in item.thumbList" :key="n">
							<image :src="picUrlPrefix+img" mode="aspectFill" :style="{width: imgsideLen+'px', height: imgsideLen+'px', margin: n%3==1?'0 10rpx':''}"></image>
						</view> 
					</view>
				</view>
				<view class="list-bottom">
					<view class="bootom-info u-f-jsb u-f-ac">
						<view>{{item.area+"-"+item.address}}</view>
						<view>{{item.item}}</view>
					</view>
				</view>
			</view>
		</block>
		<mix-load-more :status="loadMoreStatus"></mix-load-more>
	</view>
</template>

<script>
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	export default {
		components:{
			mixLoadMore
		},
		data() {
			return {
				dataList:[],
				Cookie:"",
				page:1,
				picUrlPrefix:"",
				// sessionData:Object,
				loadMoreStatus:1, //0加载前，1加载中，2没有更多了
				screenWidth:Number,
				imgsideLen:Number,
				barConfig:{
					title:"报修记录", //title
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
		onReachBottom() {
			this.loadmoreData()
		},
		onLoad() {
			uni.$on("updateLodisticsList", this.updatePage)
			this.Cookie = uni.getStorageSync("zhhqSessionData").session
			this.ImgSideLen()
			console.log(this.Cookie)
			this.getData()
		},
		methods: {
			updatePage(){
				this.page = 1
				this.loadMoreStatus = 1
				this.getData()
			},
			ImgSideLen(){
				this.screenWidth = uni.getSystemInfoSync().screenWidth
				this.imgsideLen = (this.screenWidth-uni.upx2px(20)*5)/3
			},
			loadmoreData(){
				//修改状态
				if(this.loadMoreStatus === 2){
					return;
				}
				this.loadMoreStatus = 1
				this.page++
				this.getData()
			},
			getData(){
				console.log(this.config.zhhqUrl)
				uni.request({
					url: this.config.zhhqUrl + "/repair/api/v2/personal/findList",
					method:"POST",
					header:{
						Cookie: this.Cookie,
						'Content-Type':'application/json;charset=UTF-8',
						'Content-Type':'application/x-www-form-urlencoded'
					},
					data:{
						pageNum: this.page,
						pageSize: "10"
					},
					success: (r) => {
						console.log(r)
						this.picUrlPrefix = r.data.picUrl
						var rdata = r.data.data.rows
						this.dataList = this.page > 1 ? this.dataList.concat(rdata) : rdata;
						// console.log(r.data.data.hasNext)
						if(r.data.data.hasNext){
							this.loadMoreStatus = 0
						}else{
							this.loadMoreStatus = 2
						}
					}
				})
			},
			viewDetail(item){
				uni.setStorageSync("logisticsTempData", item)
				uni.navigateTo({
					url:"../logistic-detail/logistic-detail"
				})
			}
		}
	}
</script>

<style>
	.bootom-info>view{
		color: #3E3E3E;
		font-size: 26rpx;
	}
	.list-bottom{
		margin-top: 10rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	.content-images>view>image{
		border-radius: 12rpx;
	}
	.content-images>view{
		box-sizing: border-box;
	}
	.content-images{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}
	.list-content>view{
		margin: 15rpx 0;
		font-size: 32rpx;
		word-break: break-all;
	}
	.list-top{
		margin-bottom: 10rpx;
	}
	.list-top, .list-mid{
		padding: 0 20rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #EEEEEE;
	}
	.list-top-right>view{
		color: #202020;
		font-size: 30rpx;
	}
	.list-top-left>view{
		color: #202020;
		font-size: 25rpx;
	}
	.logis-item-list{
		margin: 20rpx;
		padding: 25rpx 0;
		box-sizing: border-box;
		border-radius: 10rpx;
		background: #fff;
	}
	.lil-hover{
		background: #f0f0f0!important;
	}
</style>
