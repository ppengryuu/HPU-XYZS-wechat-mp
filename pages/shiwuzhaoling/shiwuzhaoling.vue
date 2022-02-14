<template>
	<view>
		<view class="txnavfloor" :style="{display:isshowtxnavfloor}">
			<view class="swipertab">
				<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap"></swiper-tab-head>
			</view>
		</view>
		<view class="abtxnavfloor" :style="{'z-index':nf1i2zindex}">
			<view class="swipertab">
				<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap"></swiper-tab-head>
			</view>
		</view>
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll" :style="{height:swiperheight-abtxnavfloorheight+'px!important'}">
			
			<view class="uni-tab-bar">
				<swiper :duration="200" class="swiper-box" :current="tabIndex" @change="tabchange">
					<swiper-item v-for="(items,index) in newslist" :key="index">
						<scroll-view class="list" :scroll-y="enableScroll" @scrolltolower="loadmore(index)" :lower-threshold="50" enable-back-to-top="true">
							<view v-for="(item,index1) in items.list" :key="index1">
								
								<view class="swzlist">
									<view class="aboutuser">
										<view class="userpic"><image :src="item.userpic" mode="aspectFill"></image><view class="username">{{item.username}}</view></view>
									</view>
									<view class="aboutdate">2020-1-1 12:37</view>
									<view class="aboutcontent">
										<view class="img"><image :src="item.contentimages[0]" @tap.stop="previewImages(item)" mode="aspectFill"></image></view>
										<view class="contenttext">{{item.contenttext}}</view>
									</view>
								</view>
								
								
								
								
								
								
								<!-- <index-list-dongtai :item="item" :index="index" :imagemargin="imagemargin"></index-list-dongtai> -->
							</view>
							<view class="blankpage" v-if="items.list.length==0"><view>什么都没有</view><view>╮(╯▽╰)╭</view></view>
							<view class="loadmore">{{loadmoretext}}</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</mix-pulldown-refresh>
		
		
	</view>
</template>

<script>
	import swiperTabHead from '../../components/index/swiper-tab-head.vue';
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	export default {
		components:{
			swiperTabHead,
			mixPulldownRefresh,
		},
		data() {
			return {
				abtxnavfloorheight:Number,
				enableScroll: true,
				swiperheight:Number,
				loadmoretext:"",
				tabIndex:0,
				tabBars:[
					{name:"寻物启事",id:"xunwu"},
					{name:"招领启示",id:"zhaoling"}
				],
				newslist:[
					{
						list:[
							{
								userpic:"../../static/demo/datapic/33.jpg",
								username:"昵称",
								contenttext:"我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，我今天发现了一个有趣的事，快来看看",
								contentimages:[
									"../../static/background/kcbbgi.jpg",
								],
							}
						],
					},
					{
						list:[
							{
								userpic:"../../static/demo/datapic/33.jpg",
								username:"昵称",
								contenttext:"我今天发现了一个有趣的事，快来看看",
								contentimages:[
									"../../static/background/kcbbgi.jpg",
								],
							},{
								userpic:"../../static/demo/datapic/33.jpg",
								username:"昵称在此",
								contenttext:"32333333333333332222233333333333333222223333333333333322222333333333333332222233333333333333222222222222222",
								contentimages:[
									"../../static/background/kcbbgi.jpg",
								],
							},{
								userpic:"../../static/demo/datapic/33.jpg",
								username:"昵称在此",
								contenttext:"我今天发现了一个有趣的事，快来看看",
								contentimages:[
									"../../static/background/kcbbgi.jpg",
								],
							},{
								userpic:"../../static/demo/datapic/33.jpg",
								username:"昵称在此",
								contenttext:"我今天发现了一个有趣的事，快来看看",
								contentimages:[
									"../../static/background/kcbbgi.jpg",
								],
							},{
								userpic:"../../static/demo/datapic/33.jpg",
								username:"昵称在此",
								isguanzhu:false,
								contenttext:"我今天发现了一个有趣的事，快来看看",
								contentimages:[
									"../../static/background/kcbbgi.jpg",
								],
							},
						],
					}
				]
			}
		},
		onReady() {
			var view = uni.createSelectorQuery().select(".abtxnavfloor");
			view.boundingClientRect(data => {
			this.abtxnavfloorheight=data.height
			}).exec();
		},
		onLoad() {
			this.imagewidthpx=uni.upx2px(220)
			uni.getSystemInfo({
				success: (res) => {
					this.swiperheight=res.screenHeight-uni.getSystemInfoSync().statusBarHeight-44
					this.screenHeight=res.screenHeight
				}
			})
		},
		methods: {
			tabtap(index){
				this.tabIndex=index
				console.log(index)
				this.loadmoretext=""
			},
			tabchange(e){
				this.tabIndex=e.detail.current
			},
			previewImages(item) {
				//预览图片
				uni.previewImage({
					urls: item.contentimages,
					current: item.contentimages[0]
				});
			},
			loadmore(index){
				this.loadmoretext="上拉加载更多"
				if(this.loadmoretext!="上拉加载更多"){return;}
				//修改状态
				this.loadmoretext="加载中..."
				//获取数据
				setTimeout(()=>{
					//获取完成
					let obj={
						userpic:"../../static/demo/datapic/33.jpg",
						username:"昵称在此",
						contenttext:"我今天发现了一个有趣的事，快来看看",
						contentimages:[
							"../../static/background/kcbbgi.jpg",
						]
					}
					this.newslist[index].list.push(obj)
					this.loadmoretext=""
				},1000)
				//this.loadmoretext="没有了~"
				
			},
		}
	}
</script>

<style>
	.swzlist{
		border-bottom: 1upx solid #EEEEEE;
	}
	.aboutdate{
		width: 96%;
		margin-left: 2%;
		color: #888888;
	}
	.img>image{
		width: 220upx;
		height: 140upx;
	}
	.aboutcontent{
		display: flex;
		width: 96%;
		margin-left:2%;
	}
	.contenttext{
		margin-left: 20upx;
		flex-wrap: wrap;
		word-break: break-all;  /* break-all(允许在单词内换行。) */
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 3; /** 显示的行数 **/
		overflow: hidden;
	}
	.userpic{
		/* background: #04A1C8; */
		display: flex;
	}
	.userpic>image{
		width: 50upx;
		height: 50upx;
		margin-right: 16upx;
		border-radius: 50%;
	}
	.aboutuser{
		/* background: #4A73BA; */
		width: 96%;
		margin: 16upx 2% 0 2%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.blankpage{
		color: #AAAAAA;
		justify-content: center;
		margin-top: 50upx;
		display: flex;
	}
	.blankpage>view:last-child{
		font-size: 20upx;
		padding: 10upx 0 0 15upx;
	}
	.loadmore{
		text-align: center;
		padding: 10upx 0;
		color: #AAAAAA;
	}
	.txnavfloor{
		/* height: 400upx; */
		position: fixed;
		width: 100%;
		background: #FFFFFF;
		z-index: 1000;
		border-bottom: 1upx solid #EEEEEE;
	}
	.swipertab{
		width: 100%;
		padding-top: 30upx;
	}
	.abtxnavfloor{
		opacity: 0;
		/* position: absolute; */
		width: 100%;
		background: #FFFFFF;
		z-index: 999;
		border-bottom: 1upx solid #EEEEEE;
	}
</style>
