<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		
		<view class="mini-title">剩余电量</view>
		<view class="grade-detail">
			<view>购买剩余电量：{{data.now.buyR?data.now.buyR+"度":"加载中..."}}</view>
			<view>补助剩余电量：{{data.now.graR?data.now.graR+"度":"加载中..."}}</view>
			<view>剩余电量：{{data.now.sumR?data.now.sumR+"度":"加载中..."}}</view>
		</view>
		
		<view class="mini-title">近期使用情况</view>
		<view class="grade-detail" v-if="data.recent.length>0">
			<block v-for="(item,index) in data.recent" :key="index">
				<view class="recentList u-f-ac">
					<view>{{item.date}}</view>
					<view>{{item.name}}</view>
					<view>{{item.usel}}度</view>
				</view>
			</block>
		</view>
		<view style="height: 300upx;font-size: 26upx;color: #909090;" class="u-f-ajc" v-else>近期无使用数据</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:Object,
				config:{
					title:"电费详情", //title
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
		onLoad() {
			this.data = uni.getStorageSync("electricityData")
			uni.removeStorageSync("electricityData")
		},
		methods: {
			
		}
	}
</script>

<style>
	.recentList>view:first-child{
		text-align: unset!important;
	}
	.recentList>view:last-child{
		text-align: end!important;
	}
	.recentList>view{
		/* border: 1upx solid #EEEEEE;
		box-sizing: border-box; */
		text-align: center;
		width: 33.333333%;
		word-break: break-all;
	}
	.recentList{
		
	}
	.grade-detail>view{
		padding: 10upx 30upx;
		border-top: 1upx dashed #e4e4e4;
		color: #323232;
		word-break: break-all;
	}
	.grade-detail>view:last-child{
		border-bottom: 1upx dashed #e4e4e4;
	}
	.mini-title{
		color: #323232!important;
		font-size: 36upx;
		text-align: center;
		box-sizing: border-box;
		padding: 20upx 0;
	}
</style>
