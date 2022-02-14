<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		<view class="options">
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="''" :listtext="'新教务系统'" :navigateTo="optlistnavgates[0]"></option-list>
			<option-list :listicon="''" :listtext="'图书馆'" :navigateTo="optlistnavgates[1]"></option-list>
			<!-- <view style="width: 100%;height: 60upx;background: rgb(242,246,245);"></view> -->
		</view>
	</view>
</template>

<script>
	import optionList from '../../components/option-list/option-list.vue'
	export default {
		components: {
			optionList
		},
		data() {
			return {
				optlistnavgates:[
					"jiaowu/jiaowu",
					"tushuguan/tushuguan",
				],
				config:{
					title:"我的绑定", //title
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
		methods: {
			
		}
	}
</script>

<style>
	.options{
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		width: 100%;
		position: absolute;
	}
</style>
