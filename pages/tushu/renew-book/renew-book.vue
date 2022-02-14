<template>
	<view :style="{height: screenH + 'px'}">
		<view v-if="rn_url==''">
			<view class="login_title">
				关联微信图书馆
			</view>
			<view class="step1body">
				<view class="input-line">
					<textarea class="uni-textarea" adjust-position="true" auto-height="true" v-model="url" placeholder="输入微信图书馆链接"/>
				</view>
				<navigator url="help/help">如何关联？</navigator>
			</view>
		</view>
		
		<web-view v-else :webview-styles="wvstyle" :src="rn_url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				screenH:Number,
				rn_url:'',
				url:'',
				wvstyle:{
					progress: {
						color: '#00A075'
					}
				}
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.screenH = res.screenHeight - uni.getSystemInfoSync().statusBarHeight
				}
			})
			var rn_url = uni.getStorageSync('rn_url')
			if(rn_url){
				this.rn_url = rn_url
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0){
				var rn_url = uni.getStorageSync('rn_url')
				if(rn_url != ''){
					uni.setStorageSync('rn_url','')
					this.rn_url = ''
				} else {
					var reg = /\?id=.+/g;
					var get_id = this.url.match(reg)
					this.rn_url = 'http://lib.hpu.edu.cn:81/M_Borrowing.aspx' + get_id
					uni.setStorageSync('rn_url',this.rn_url)
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.login_title{
		padding: 50upx;
		box-sizing: border-box;
		height: 80upx;
		font-size: 35upx;
		font-weight: bold;
		/* background: #007AFF; */
	}
	.step1body{
		width: 100%;
		position: absolute;
		padding: 30upx;
		box-sizing: border-box;
		z-index: 999;
	}
	.step1body>navigator{
		font-size: 25upx;
		padding-left: 25upx;
		color: #00AAFF;
		background: rgb(255, 255, 255)!important;
	}
	.input-line>textarea{
		/* background: #09BB07; */
		padding: 10upx 20upx;
		font-size: 32upx;
	}
	.input-line{
		margin-bottom: 50upx;
		display: flex;
		border-bottom: 1upx solid #eeeeee;
		align-items: center;
	}
</style>
