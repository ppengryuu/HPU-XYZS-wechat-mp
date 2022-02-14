<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		<view class="icon u-f-ajc">
			<image src="../../static/icon.png" mode="aspectFill"></image>
		</view>
		<view class="appname">HPU校园助手</view>
		<view class="appversion">v2.1.3</view>
		<!-- <view class="options">
			<view style="width: 100%;height: 50upx;background: rgb(242,246,245);"></view>
			<option-list :listtext="'合作与联系'" :navigateTo="optlistnavgates[0]"></option-list>
		</view> -->
		<!-- <view>{{wu}}</view> -->
		<view class="version-rec">
			<view class="v-title">更新日志</view>
			<view class="v-list">v2.1.3</view>
			<view class="v-detail">
				<text>
					修复了一些已知问题；
					修复教学周计算错误的问题
				</text>
			</view>
			<view class="v-list">v2.1.0</view>
			<view class="v-detail">
				<text>
					修复了一些已知问题；
					优化和调整了一些界面；
					课程表导入现在支持选择学期；
					修复图书馆功能；
				</text>
			</view>
			<view class="v-list">v2.0.2</view>
			<view class="v-detail">
				<text>
					优化了空教室搜索速度；
					修复了一些已知问题；
				</text>
			</view>
			<view class="v-list">v2.0.1</view>
			<view class="v-detail">
				<text>
					优化和调整了一些界面；
					修复了一些已知问题；
					现在空教室、公告和讲座等功能将保留你最近的登录状态，避免不必要的重复登录
				</text>
			</view>
			<view class="v-list">v2.0.0</view>
			<view class="v-detail">
				<text>
					优化了性能；
					优化和调整了一些界面；
					全新课程表界面，更加方便的查看课程安排；
				</text>
			</view>
			<view class="v-list">v1.3.4</view>
			<view class="v-detail">
				<text>
					优化和调整了一些界面；
					修复公告文件打开无响应的问题；
					新版空教室查询，上自习的好帮手
				</text>
			</view>
			<view class="v-list">v1.3.3</view>
			<view class="v-detail">
				<text>
					修复了一些已知问题
				</text>
			</view>
			<view class="v-list">v1.3.2</view>
			<view class="v-detail">
				<text>
					优化和调整了一些界面；
					修复了一些已知问题
				</text>
			</view>
			<view class="v-list">v1.3.1</view>
			<view class="v-detail">
				<text>
					修复了一些已知问题
				</text>
			</view>
			<view class="v-list">v1.3.0</view>
			<view class="v-detail">
				<text>
					新增体测成绩查询功能，支持查询体测成绩；
					新增校园报修功能，支持向学校后勤报修，以及查看报修记录；
					新增公告和讲座功能，可以查看学校的公告和讲座信息；
					修复了一些已知问题
				</text>
			</view>
			<view class="v-list">v1.2.2</view>
			<view class="v-detail">
				<text>
					优化和调整了一些界面；
					修复了一些已知问题
				</text>
			</view>
			<view class="v-list">v1.2.1</view>
			<view class="v-detail">
				<text>
					修复主页状态栏渐变显示错误；
					修复部分界面内容显示错误；
					修复自定义图片失效问题
				</text>
			</view>
			<view class="v-list">v1.2.0</view>
			<view class="v-detail">
				<text>
					新增宿舍电费查询功能（目前仅支持南校区）
				</text>
			</view>
			<view class="v-list">v1.1.0</view>
			<view class="v-detail">
				<text>
					修复了一些已知问题
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
