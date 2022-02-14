<template>
	<view>
		<web-view :src="url" :webview-styles="wvstyle"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
				wvstyle:{
					progress: {
						color: '#00A075'
					}
				}
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0){
				uni.showActionSheet({
					itemList:['复制链接'],
					success: (res) => {
						if(res.tapIndex==0){
							uni.setClipboardData({
								data:this.url,
								success() {
									plus.nativeUI.toast('复制链接成功')
									uni.hideToast()
								}
							})
						}
					}
				})
			}
		},
		onLoad(e) {
			// console.log(e)
			this.url = JSON.parse(e.data)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
