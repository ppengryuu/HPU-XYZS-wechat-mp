<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>

		<view class="content-pic">
			<image src="../../static/content/school-bus-timet.png" mode="widthFix"></image>
		</view>
		<view class="content-text">
			<view>1.周一至周五，红色字体的班次为教职工专车，谢绝学生乘坐。</view>
			<view>2.周一至周五，南校区7:10、11:50、13:50、18:00、19:00的公交班点在荷花池站发车，其他班点均在新体育场站发车。</view>
			<view>3.遇道路施工或恶劣天气等不确定因素，发车时间按临时通知时间执行。</view>
			<view>4.以上班车时间表运行时间为10月1日至次年4月30日。</view>
			<view>班车服务电话：3980019       班车监督电话：3980020</view>
			<view>后勤管理处（集团）</view>
			<view>更新时间：2019年9月30日</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				config:{
					title:"通勤班车", //title
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
	.content-text>view:nth-child(7){
		text-align: right;
		padding-bottom: 20upx;
	}
	.content-text>view:nth-child(6){
		text-align: right;
		padding-top: 30upx;
	}
	.content-text{
		width: 100%;
		padding: 0 30upx;
		box-sizing: border-box;
	}
	.content-pic>image{
		width: 100%;
		height: auto;
	}
	.content-pic{
		width: 100%;
		padding: 60upx;
		box-sizing: border-box;
	}
</style>
