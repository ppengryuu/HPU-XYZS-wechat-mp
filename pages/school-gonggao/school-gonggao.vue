<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap" @navHeight="getnavH"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		<view class="top-swiper-head">
			<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap"></swiper-tab-head>
		</view>
		<view class="tsheight"></view>
		
		<view class="uni-tab-bar">
			<swiper 
			:style="{'height': swiperheight + 'px'}"
			style="background: rgb(243,246,248);"
			:current="tabIndex"
			:duration="200"
			@change="currentchange"
			>
				<swiper-item>
					<scroll-view scroll-y class="list" @scrolltolower="annloadmore()" :enable-back-to-top="tabIndex==0">
						<block v-for="(item,n) in annList" :key="n">
							<view class="ann-list" hover-class="al-hover" hover-stay-time="100" @tap="openAnn(item)">
								<view class="title-part u-f-ac">
									<span v-if="item.isTop" class="ann-top">置顶</span>
									<span class="ann-title">{{item.title}}</span>
								</view>
								<view>{{item.date}}</view>
							</view>
						</block>
						<mix-load-more :status="AloadMoreStatus"></mix-load-more>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="list" @scrolltolower="lecloadmore()" :enable-back-to-top="tabIndex==1">
						<block v-for="(item,m) in lecList" :key="m">
							<view class="lec-list">
								<view>{{item.title}}</view>
								<view>主讲人：{{item.speaker}}</view>
								<view>时间：{{item.date}}</view>
								<view>地点：{{item.loc}}</view>
								<view>内容：{{item.content}}</view>
							</view>
						</block>
						<mix-load-more :status="LloadMoreStatus"></mix-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		
		
	</view>
</template>

<script>
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	import SwiperTabHead from '../../components/index/swiper-tab-head.vue';
	export default {
		components:{
			mixLoadMore,
			SwiperTabHead,
		},
		data() {
			return {
				annList:[],
				lecList:[],
				AloadMoreStatus:1,//0加载前，1加载中，2没有更多了
				LloadMoreStatus:1,
				Apage:1,
				Lpage:1,
				swiperheight:Number,
				navH:Number,
				config:{
					title:"公告和讲座", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							iconfont:"icon-shuaxin"
						}
					]
				},
				tabIndex: 0,
				tabBars: [{
						name: "公告",
						id: "ann"
					},
					{
						name: "讲座",
						id: "lecture"
					}
				],
			}
		},
		onLoad() {
			this._initPage()
		},
		methods: {
			_initPage(){
				this.AloadMoreStatus = 1
				this.LloadMoreStatus = 1
				this.annList = []
				this.lecList = []
				this.Lpage = 1
				this.Apage = 1
				this.getAnn()
			},
			async getAnn(){
				let [err,res] = await this.$http.post('/app/hpuvpn/school/ann', {
					user_id:this.User.userinfo.id,
					page: this.Apage
				});
				// 请求失败处理
				console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					this.AloadMoreStatus = 2
					return;
				}
				var data = res.data.data.data
				var hasNext = res.data.data.hasNext
				this.annList = this.Apage > 1 ? this.annList.concat(data) : data;
				if(hasNext){
					this.AloadMoreStatus = 0
				}else{
					this.AloadMoreStatus = 2
				}
				if(this.Apage==1){ this.getLec() }
			},
			async getLec(){
				let [err,res] = await this.$http.post('/app/hpuvpn/school/lectures', {
					user_id:this.User.userinfo.id,
					page: this.Lpage
				});
				// 请求失败处理
				console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					this.LloadMoreStatus = 2
					return;
				};
				var data = res.data.data.data
				var hasNext = res.data.data.hasNext
				this.lecList = this.Lpage>1?this.lecList.concat(data):data
				if(hasNext){
					this.LloadMoreStatus = 0
				}else{
					this.LloadMoreStatus = 2
				}
				
				if(this.Lpage==1){ this.lecloadmore() }
			},
			annloadmore(){
				//修改状态
				if(this.AloadMoreStatus === 2){
					return;
				}
				this.AloadMoreStatus = 1;
				//获取数据
				this.Apage++
				this.getAnn()
				//this.loadmoretext="没有了~"
			},
			lecloadmore(){
				//修改状态
				if(this.LloadMoreStatus === 2){
					return;
				}
				this.LloadMoreStatus = 1;
				//获取数据
				this.Lpage++
				this.getLec()
				//this.loadmoretext="没有了~"
			},
			tabtap(e){
				this.tabIndex=e
			},
			currentchange(e){
				this.tabIndex=e.detail.current;
			},
			buttonTap(e){
				if(e.index == 0){
					this.publicM.back1()
				} else {
					this._initPage()
				}
			},
			getnavH(e){
				console.log(e)
				this.navH = e.height
				this.swiperheight = uni.getSystemInfoSync().windowHeight - e.height-uni.upx2px(100)
			},
			async openAnn(item){
				console.log(item)
				uni.showLoading({
					title:"加载中"
				})
				let [err,res] = await this.$http.post('/app/hpuvpn/school/ann/list', {
					user_id:this.User.userinfo.id,
					id: item.id?item.id:""
				});
				console.log(res)
				// 请求失败处理
				if (!this.$http.errorCheck(err,res)) return;
				var data = res.data.data.data
				uni.hideLoading()
				uni.setStorageSync("GGFilesTemp", data)
				uni.navigateTo({
					url:"gonggao-list/gonggao-list"
				})
			}
		}
	}
</script>

<style>
	.lec-list>view:last-child{
		margin-top: 15rpx;
		box-sizing: border-box;
	}
	.lec-list{
		margin: 20rpx 25rpx;
		padding: 20rpx 25rpx;
		border-radius: 12rpx;
		background: #FFFFFF;
		box-sizing: border-box;
	}
	.lec-list>view:nth-child(1){
		text-align: center;
		margin: 20rpx 0;
		box-sizing: border-box;
		font-size: 35rpx;
		font-weight: 800;
	}
	.lec-list>view{
		word-break: break-all;
	}
	.ann-list>view:nth-child(2){
		font-size: 25rpx;
		color: #2e2e2e;
	}
	.al-hover{
		background: #EEEEEE!important;
	}
	.title-part{
		display: inline-block;
	}
	.ann-title{
		word-break: break-all;
		font-size: 30rpx;
	}
	.ann-top{
		font-size: 22upx;
		margin-right: 10rpx;
		line-height: 1;
		padding: 3rpx;
		box-sizing: border-box;
		border: 1px solid #eb313d;
		color: #eb313d;
		border-radius: 12rpx;
	}
	.ann-list{
		background: #FFFFFF;
		width: 100%;
		padding: 20rpx 25rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #EEEEEE;
	}
	
	.top-swiper-head{
		padding: 20upx 0 0 0;
		height: 100upx;
		box-sizing: border-box;
		border-bottom: 3upx solid #EEEEEE;
		position: fixed;
		width: 100%;
		z-index: 999;
		background: rgb(248,248,248);
	}
	
	.tsheight{
		height: 100upx;
	}
	
</style>
