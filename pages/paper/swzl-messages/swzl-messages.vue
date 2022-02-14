<template>
	<view :style="{height:contentHeight+'px',width:screenWidth+'px',background:'rgb(242,246,245)'}">
		<navigation-custom :config="{title:'失物招领-消息',bgcolor:'#f8f8f8',fontcolor:'#0c0c0c',type:3,share:false,menuIcon:[{icon:'../../static/icon/back_.png',text:'返回'}],menuText:'返回'}" @customConduct="publicM.back1()"/>
		<mini-message-list :list="list"></mini-message-list>
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
				list:[
					{
						userpic:"",
						username:"昵称",
						type:1,
						contenttext:"我今天发现了一个有趣的事，快来看看",
						replytext:'!!!',
					},{
						userpic:"../../../static/demo/datapic/33.jpg",
						username:"昵称在此",
						contenttext:"32333333333333332222233333333333333222223333333333333322222333333333333332222233333333333333222222222222222",
						
					},{
						userpic:"../../../static/demo/datapic/33.jpg",
						username:"昵称在此",
						contenttext:"我今天发现了一个有趣的事，快来看看",
						
					},{
						userpic:"../../../static/demo/datapic/33.jpg",
						username:"昵称在此",
						contenttext:"我今天发现了一个有趣的事，快来看看",
						
					},{
						userpic:"../../../static/demo/datapic/33.jpg",
						username:"昵称在此",
						contenttext:"我今天发现了一个有趣的事，快来看看",
						
					},
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
		methods: {
			
		}
	}
</script>

<style>

</style>
