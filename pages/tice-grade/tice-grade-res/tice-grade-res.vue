<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.back1()"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		<view class="mini-title">{{tdata.name}}</view>
		<view class="mini-title" style="font-size: 32rpx!important;padding-top: 0!important;padding-bottom: 10rpx!important;">{{tdata.stunum}}</view>
		
		<view class="miditem">
			<block v-for="(item, m) in tdata.data" :key="m">
				<view class="glist-item u-f-ac" style="flex-wrap: wrap;">
					<block v-for="(e, n) in item" :key="n">
						<view :class="n==0?'ann-item':'gra-item'" :style="{'padding-top':isZongFen(e)?'8rpx':'0'}"> 
							{{e}}
						</view>
					</block>
				</view>
				
			</block>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tdata:Object,
				config:{
					title:"体测成绩", //title
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
			isZongFen(e){
				return function(e){
					if(e.indexOf("总分")>-1){
						return true
					} else {
						return false
					}
				}
			}
		},
		onLoad() {
			this.tdata = uni.getStorageSync("ticeGradeTmp")
			uni.removeStorageSync("ticeGradeTmp")
			console.log(this.tdata)
			console.log(JSON.stringify(this.tdata))
			
		},
		methods: {
			
		}
	}
</script>

<style>
	.glist-item{
		margin: 30rpx 0;
		padding: 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 12rpx;
	}
	.miditem{
		margin: 0 30rpx;
		box-sizing: border-box;
	}
	.ann-item{
		/* text-align: center; */
		margin: 10rpx 0;
		width: 100%;
		color: #000;
		font-size: 36upx;
	}
	.gra-item{
		min-width: 50%;
		color: #060606;
	}

	.mini-title{
		color: #323232!important;
		font-size: 36upx;
		text-align: center;
		box-sizing: border-box;
		padding: 20upx 0 0 0;
	}
</style>
