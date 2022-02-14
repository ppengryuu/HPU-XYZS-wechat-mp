<template>
	<view class="body" :style="{height:screenHeight-50+'px',width:screenWidth+'px'}">
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>

		<navigator class="userimgcover" url="../user-space/user-space" hover-class="none">
			<image :src="userbgpic" mode="aspectFill" :style="ubploading?{opacity:0}:{opacity:1}" @load="ubploadover"></image>
			<view class="userpic" :style="{'margin-left':userpicml+'px'}">
				<image :src="userpic" mode="aspectFill" :style="uploading?{opacity:0}:{opacity:1}" @load="uploadover"></image>
				<!-- <image-cache :imgSrc="userpic" mode="aspectFill" lazyLoad="true"></image-cache> -->
			</view>
			<view class="nickname">{{username}}</view>
			<view class="usersignature">
				<view style="display: flex;width: 98%;align-items: center;justify-content: space-between;">
					<view class="signature">{{usersignature}}</view>
					<view class="icon iconfont icon-jinru"></view>
				</view>
			
			</view>
		</navigator>
		
		
		<view class="options">
			<option-list :listicon="optlisticons[0]" :listtext="'我的收藏'" :navigateTo="optlistnavgates[0]"></option-list>
			<option-list :listicon="optlisticons[1]" :listtext="'浏览历史'" :navigateTo="optlistnavgates[1]"></option-list>
			<option-list :listicon="optlisticons[2]" :listtext="'认证与绑定'" :navigateTo="optlistnavgates[2]"></option-list>
			<view style="width: 100%;height: 60upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="optlisticons[3]" :listtext="'设置'" :navigateTo="optlistnavgates[3]"></option-list>
			
			
			
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
				userpic:'',
				userbgpic:'',
				username:'',
				usersignature:'',
				optlisticons:[
					"../../static/optionlist-icons/shoucang.png",
					"../../static/optionlist-icons/liulanlishi.png",
					"../../static/optionlist-icons/bangding.png",
					"../../static/optionlist-icons/shezhi.png"
				],
				optlistnavgates:[
					"../../pages/shoucang/shoucang",
					"../../pages/liulanlishi/liulanlishi",
					"../../pages/bangding/bangding",
					"../../pages/settings/settings",
				],
				screenWidth:Number,
				screenHeight:Number,
				userpicml:Number,
				uploading:true,
				ubploading:true,
				config:{
					title:"我", //title
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

			};
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.screenWidth =res.screenWidth
					this.screenHeight =res.screenHeight
					this.userpicml=(res.screenWidth-uni.upx2px(180))/2
				}
			})
		},
		onShow() {
			this.isLogin();
		},
		methods:{
			uploadover(){
				this.uploading=false
			},
			ubploadover(){
				this.ubploading=false
			},
			isLogin(){
				if (!this.User.token){
					this.loginStatus = false;
					uni.navigateTo({
						url:"../user-login/user-login"
					})
					this.homeinfo={
						userpic:"",
						username:"",
						userbgpic:"",
						usersignature:""
					};
					return;
				}
				// 用户已登录
				this.userpic = this.User.userinfo.userpic;
				this.userbgpic = this.User.userinfo.userbgpic;
				this.username = this.User.userinfo.username;
				this.usersignature = this.User.userinfo.userinfo.usersignature;
				this.loginStatus = true;
			},
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
		top: 480upx;
	}
	
	
	.nickname{
		/* background: #007AFF; */
		position: absolute;
		font-size: 36upx;
		z-index: 999;
		top: 320upx;
		width: 100%;
		text-align: center;
	}
	.usersignature{
		display: flex;
		justify-content: flex-end;
		background: rgba(0,0,0,0.4);
		position: absolute;
		height: 65upx;
		width: 100%;
		bottom: 0;
	}
	.signature{
		overflow: hidden;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.userimgcover{
		color: #F5F5F5;
		z-index: 998;
		width: 100%;
		height: 480upx;
		position: absolute;
		overflow: hidden;
	}
	.userimgcover>image{
		width: 100%;
		height: 100%;
	}
	.userpic{
		top: 135upx;
		position: absolute;
		z-index: 999;
		width: 180upx;
		height: 180upx;
		border-radius: 50%;
		overflow: hidden;
	}
	.userpic>image{
		width: 180upx;
		height: 180upx;
		border-radius: 50%;
	}
	.body{
		background: rgb(242,246,245);
		position: relative;
	}

</style>
