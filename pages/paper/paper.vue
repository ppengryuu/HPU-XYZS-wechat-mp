<template>
	<view :style="{height:contentHeight+'px',width:screenWidth+'px',background:'rgb(242,246,245)'}">
		<navigation-custom :config="{title:'消息',bgcolor:'#f8f8f8',fontcolor:'#0c0c0c',type:3,share:false,menuIcon:[{icon:'../../static/icon/back_.png',text:'返回'}],menuText:'返回'}" @customConduct="publicM.back1()"/>
		<view class="options">
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="''" :listtext="'系统消息'" rightreddot="2" :navigateTo="optlistnavgates[0]"></option-list>
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="''" :listtext="'表白墙'" rightreddot="2" :navigateTo="optlistnavgates[1]"></option-list>
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="''" :listtext="'失物招领'" :navigateTo="optlistnavgates[2]"></option-list>
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
				screenHeight:Number,
				screenWidth:Number,
				contentHeight:Number,
				optlistnavgates:[
					"system-messages/system-messages",
					"bbq-messages/bbq-messages",
					"swzl-messages/swzl-messages",
				],
			}
		},
		onLoad() {
			this.userpic=this.User.userinfo.userpic
			this.username=this.User.userinfo.username
			uni.getSystemInfo({
				success: (res) => {
					this.screenWidth =res.screenWidth
					this.screenHeight =res.screenHeight
					this.contentHeight =res.screenHeight-44-uni.getSystemInfoSync().statusBarHeight
				}
			})
		},
		onShow() {
			console.log(this.User.token)
			console.log(this.User.userinfo)
		},
		methods:{
			
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
