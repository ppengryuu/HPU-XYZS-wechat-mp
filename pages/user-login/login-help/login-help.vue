<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		<view class="bodyq">
			<view class="uni-h4">1.邮件服务商未发送通知</view>
			<view class="uni-h5">请登陆邮箱，查看收件箱</view>
			<view class="uni-h4">2.邮件被服务商视为垃圾邮件</view>
			<view class="uni-h5">登陆邮箱，以电脑网页版QQ邮箱为例，在左侧操作栏中点击垃圾箱，查看是否有验证码邮件，如果有，请获取验证码后取消标记垃圾邮件，如果仍然没有验证码，建议换一个邮箱账号进行操作</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				config:{
					title:"登录帮助", //title
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
	.bodyq{
		box-sizing: border-box;
		padding: 20upx 25upx;
	}
</style>
