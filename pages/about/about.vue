<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		<view class="icon u-f-ajc">
			<image src="../../static/icon.png" mode="aspectFill"></image>
		</view>
		<view class="appname">HPU盒子</view>
		<view class="appversion">v1.0.7</view>
		<!-- <view class="options">
			<view style="width: 100%;height: 50upx;background: rgb(242,246,245);"></view>
			<option-list :listtext="'合作与联系'" :navigateTo="optlistnavgates[0]"></option-list>
		</view> -->
		<!-- <view>{{wu}}</view> -->
		<view class="version-rec">
			<view class="v-title">更新日志</view>
			<view class="v-list">v1.0.7</view>
			<view class="v-detail">
				<text>
					修复主页状态栏渐变显示错误
					修复部分内容显示错误
					修复自定义图片失效问题
				</text>
			</view>
			<view class="v-list">v1.0.6</view>
			<view class="v-detail">
				<text>
					新增宿舍电费查询功能（目前仅支持南校区）
				</text>
			</view>
			<view class="v-list">v1.0.5</view>
			<view class="v-detail">
				<text>
					新增校园社区功能，和同学们一起分享生活吧！
				</text>
			</view>
			<view class="v-list">v1.0.4</view>
			<view class="v-detail">
				<text>
					修复课程详情弹窗显示错误
				</text>
			</view>
			<view class="v-list">v1.0.3</view>
			<view class="v-detail">
				<text>
					修复搜索图书馆馆藏时结果重复问题；
					修复绑定账号界面显示错误；
					优化天气图标加载，添加更多天气信息
				</text>
			</view>
			<view class="v-list">v1.0.2</view>
			<view class="v-detail">
				<text>
					修复课程表边框高度问题；
					修复天气图标加载问题；
					修复加载框显示问题
				</text>
			</view>
			<view class="v-list">v1.0.1</view>
			<view class="v-detail">
				<text>
					修复编辑课程时，课程时间选择器无法选择时间的问题
				</text>
			</view>
			
			
		</view>
		
		
		
	</view>
</template>

<script>
	import optionList from '../../components/option-list/option-list.vue';
	export default {
		components: {
			optionList
		},
		data() {
			return {
				wu:'',
				screenWidth:Number,
				contentHeight:Number,
				// optlistnavgates:[
				// 	"../public-webview/public-webview?data=https://www.hpubox.top/cooperation.html",
				// ],
				config:{
					title:"关于", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					// fontcolor:"red", //文字颜色，默认白色
					type:1, //type 1胶囊 2无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							text:"返回" 
						}
					], //当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"lala", // 当type为3或4的时候icon右边的文字
					// menuClass:"icon iconfont icon-caidan"
				},
			}
		},
		onReady() {
			this.wu = this.config.webUrl+JSON.stringify(this.User) 
		},
		methods: {
			buttonTap(e){
				if(e.index==0){
					this.publicM.back1()
				}
			}
		}
	}
</script>

<style scoped>
	.v-detail{
		margin-bottom: 20rpx;
	}
	.version-rec>view{
		word-break: break-all;
	}
	.version-rec{
		color: #101010;
		box-sizing: border-box;
		padding: 20rpx 60rpx;
	}
	.v-title{
		font-size: 35rpx;
		margin: 20rpx 0;
	}
	.icon{
		height: 300upx;
		width: 100%;
	}
	.icon >image{
		width: 200upx;
		height: 200upx;
	}
	.appname{
		font-size: 35upx;
		text-align: center;
	}
	.appversion{
		font-size: 25upx;
		text-align: center;
		color: #909090;
	}
	.options{
		background: #FFFFFF;
	}
</style>
