<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<block v-for="(item,m) in list" :key="m">
			<mini-message-list :item="item"></mini-message-list>
		</block>
	</view>
</template>

<script>
	import miniMessageList from "../../../components/paper/mini-message-list.vue";
	export default {
		components:{
			miniMessageList,
		},
		data() {
			return {
				screenHeight:Number,
				screenWidth:Number,
				contentHeight:Number,
				list:[],
				config:{
					title:"消息", //title
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
		onShow() {
			this.$message.isMessagePage = true
			uni.setStorageSync('haveUnread',false)
		},
		onHide() {
			this.$message.isMessagePage = false
		},
		onUnload() {
			this.$message.isMessagePage = false
		},
		onLoad() {
			uni.$on('messageListUpdate',this.updateData)
			uni.getSystemInfo({
				success: (res) => {
					this.screenWidth =res.screenWidth
					this.screenHeight =res.screenHeight
					this.contentHeight =res.screenHeight-44-uni.getSystemInfoSync().statusBarHeight
				}
			})
			var list = uni.getStorageSync('postMessages_'+this.User.userinfo.id)
			// console.log(JSON.stringify(list) )
			this.list = list
		},
		methods: {
			updateData(){
				var list = uni.getStorageSync('postMessages_'+this.User.userinfo.id)
				// console.log(JSON.stringify(list) )
				this.list = list
			}
		}
	}
</script>

<style>

</style>
