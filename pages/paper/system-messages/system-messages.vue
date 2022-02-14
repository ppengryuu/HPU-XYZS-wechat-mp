<template>
	<view class="body" :style="{'mini-height':contentHeight+'px',width:screenWidth+'px',background:'rgb(242,246,245)'}">
		<navigation-custom :config="{title:'系统消息',bgcolor:'#f8f8f8',fontcolor:'#0c0c0c',type:3,share:false,menuIcon:[{icon:'../../static/icon/back_.png',text:'返回'}],menuText:'返回'}" @customConduct="publicM.back1()"/>
		<view class="newsitem" v-for="(item,index) in list" :key="index">
			<index-list-dongtai :item="item" :index="index" :issystemMessages="true"></index-list-dongtai>
		</view>
	</view>
</template>

<script>
	import indexListDongtai from "../../../components/index/index-list-dongtai.vue"
	export default {
		components:{
			indexListDongtai
		},
		data() {
			return {
				contentimageswidth:Number,
				imagemargin:Number,
				screenHeight:Number,
				screenWidth:Number,
				contentHeight:Number,
				list:[
					{
						contenttext:"我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看",
						contentimages:[
							"../../../static/background/kcbbgi.jpg",
							"../../../static/background/1.jpg",
						],
					
					},{
						contenttext:"我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看",
						contentimages:[
							"../../../static/background/kcbbgi.jpg",
							"../../../static/background/1.jpg",
						],

					},{
						contenttext:"我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看",
						contentimages:[
							"../../../static/background/kcbbgi.jpg",
							"../../../static/background/1.jpg",
						],

					},{
						contenttext:"我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看",
						contentimages:[
							"../../../static/background/kcbbgi.jpg",
							"../../../static/background/1.jpg",
						],

					},{
						contenttext:"我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看我今天发现了一个有趣的事，快来看看",
						contentimages:[
							"../../../static/background/kcbbgi.jpg",
							"../../../static/background/1.jpg",
						],

					},
				]
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.screenWidth =res.screenWidth
					this.screenHeight =res.screenHeight
					this.contentHeight =res.screenHeight-44-uni.getSystemInfoSync().statusBarHeight
				}
			})
		},
		methods: {
			
		}
	}
</script>

<style>
	.newsitem{
		border-radius: 16upx;
		overflow: hidden;
		background: #ffffff;
		box-shadow: 0 0 1upx 1upx #EEEEEE;
		margin: 10upx 0 50upx 0;
	}
	.body{
		padding: 20upx;
		box-sizing: border-box;
	}
</style>
