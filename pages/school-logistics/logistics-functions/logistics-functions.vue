<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.back1()"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		
		<view class="top-myinfo">
			<view class="infopart u-f-ac">
				<image :src="wdata.avatar" mode="widthFix"></image>
				<view>{{wdata.nickname}}</view>
			</view>
			<view class="school-info">
				<view>学院：{{wdata.academy}}</view>
				<view>住宿：{{wdata.dorm}}</view>
			</view>
			
		</view>
		
		<view class="mid-functions">
			<option-list :listicon="''" :listtext="'快速报修'" :navigateTo="optlistnavgates[0]"></option-list>
			<option-list :listicon="''" :listtext="'报修记录'" :navigateTo="optlistnavgates[1]"></option-list>
		</view>
		
	</view>
</template>

<script>
	import optionList from '../../../components/option-list/option-list.vue';
	export default {
		components: {
			optionList,
			// navigationCustom 
		},
		data() {
			return {
				wdata:String,
				config:{
					title:"报修平台", //title
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
				optlistnavgates:[
					"../post-repair/post-repair",
					"../post-list/post-list"
				]
			}
		},
		onLoad() {
			this.wdata = uni.getStorageSync("zhhqSessionData")
		},
		methods: {
			
		}
	}
</script>

<style>
	.mid-functions{
		background: #fff;
	}
	.school-info{
		margin: 10rpx;
		color: #1A1A1A;
	}
	.infopart>image{
		width: 22%;
		height: auto;
		border-radius: 50%;
	}
	.infopart>view{
		width: 78%;
		font-size: 45rpx;
		font-weight: bold;
		margin-left: 20rpx;
		word-break: break-all;
		line-height: 1.2;
	}
	.top-myinfo{
		margin: 50rpx 36rpx;
	}

</style>
