<template>
	<view class="bodypart2" id="boaypart2">
		<navigation-custom :config="config"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<view class="functionzone" :style="{opacity: pageReady?1:0}">
			<view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="entergradepage">
				<view>
					<image src="../../static/icons/chwngji_icon.png" mode="scaleToFill"></image>
				</view>
				<view><text>成绩</text></view>
			</view>
			
			<view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="entercspage">
				<view>
					<image src="../../static/icons/kcb_icon.png" mode="scaleToFill"></image>
				</view>
				<view><text>课程表</text></view>
			</view>
			
			<view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="enterkjspage">
				<view>
					<image src="../../static/icons/kjs_icon.png" mode="scaleToFill"></image>
				</view>
				<view><text>空教室</text></view>
			</view>
			
			<view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="entertushu">
				<view>
					<image src="../../static/icons/library_icon.png" mode="scaleToFill"></image>
				</view>
				<view><text>图书馆</text></view>
			</view>
			
			
			<view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="enterww_zsxq">
				<view >
					<image src="../../static/icons/huati_icon2.png" mode="scaleToFill"></image>
				</view>
				<view><text>校园白墙</text></view>
			</view>
		
			<!-- <view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="enterww">
				<view >
					<image src="../../static/icons/huati_icon2.png" mode="scaleToFill"></image>
				</view>
				<view class="red-dot" v-if="wwhaveMessageUnread"></view>
				<view><text>白墙</text></view>
			</view> -->
			
			<view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="enterfc">
				<view>
					<image src="../../static/icons/find_school_card_icon.png" mode="scaleToFill"></image>
				</view>
				<view><text>捡到校园卡</text></view>
			</view>
			<view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="enterdl">
				<view >
					<image src="../../static/icons/electric.png" mode="scaleToFill"></image>
				</view>
				<view><text>电费查询</text></view>
			</view>
			
			<view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="nNavgate('../school-map/school-map')">
				<view>
					<image src="../../static/icons/Map-Icon.png" mode="scaleToFill"></image>
				</view>
				<view><text>学校地图</text></view>
			</view>
			<view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="nNavgate('../school-calender/school-calender')">
				<view>
					<image src="../../static/icons/school-calender.png" mode="scaleToFill"></image>
				</view>
				<view><text>校历</text></view>
			</view>
			
			<!-- <view class="function" :style="{width:screenWidth/3+'px',height:screenWidth/3+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="nNavgate('../test/test')">
				<view>
					<image src="../../static/icons/school-calender.png" mode="scaleToFill"></image>
				</view>
				<view><text>校历</text></view>
			</view> -->
			
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageReady:false,
				screenWidth:0,
				config:{
					title:"全部功能", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
				}
			}
		},
		onReady() {
			this.pageReady = true
		},
		onLoad() {
			this.screenWidth = uni.getSystemInfoSync().screenWidth
		},
		methods: {
			navCheckLogin(url){
				if(!this.User.token){
					return uni.showModal({
						title:"提示",
						content:"请先登录",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({url:"../user-login/user-login"})
							}
						}
					})
				} else {
					return uni.navigateTo({url:url});
				}
			},
			nNavgate(url){
				uni.navigateTo({url:url})
			},
			enterdl(){
				this.navCheckLogin("../electricity/electricity")
			},
			enterfc(){
				this.navCheckLogin("../find-school-card/find-school-card")
			},
			enterww(){
				uni.switchTab({url:"../white-wall/white-wall"})
			},
			enterww_zsxq(){
				uni.navigateToMiniProgram({
					appId: 'wx4f706964b979122a',
					path: "pages/topics/topics?group_id=88512482842822"
				})
			},
			enterkjspage(){
				this.navCheckLogin("../empty-classroom/empty-classroom")
			},
			entertushu(){
				this.navCheckLogin("../tushu/tushu")
			},
			entercspage(){
				uni.switchTab({url:"../class-schedule/class-schedule"})
			},
			entergradepage(){
				if(!this.User.token){
					return uni.showModal({
						title:"提示",
						content:"请先登录",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({url:"../user-login/user-login"})
							}
						}
					})
				}
				if(this.User.schoolbind){
					uni.showLoading({title:'获取数据中',mask:true,})
					return uni.navigateTo({url:'../chengji/chengji'})
				} else {
					return uni.showModal({
						title:"提示",
						content:"请先绑定教务",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({url:"../bangding/jiaowu/jiaowu"})
							}
						}
					})
				}
			},
		}
	}
</script>

<style>
	.f-hover{
		background: #EEEEEE!important;
	}
	.function {
		background: #FFFFFF; 
		position: relative;
		/* background: #007AFF; */
		display: flex;
		box-sizing: border-box;
		border: 1px solid #EEEEEE;
		/* flex: 1; */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.function>view:last-child {
		font-size: 28upx;
		color: #3e3e3e;
	}
	
	.functionzone {
		display: flex;
		flex-direction: row;
		/* justify-content: center; */
		/* background: #00A075; */
		margin-top: 10upx;
		flex-wrap: wrap;
	}
	.functionzone image {
		width: 80upx;
		height: 80upx;
	}
</style>
