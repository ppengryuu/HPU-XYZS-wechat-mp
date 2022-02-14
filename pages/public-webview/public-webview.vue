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
		onLoad(e) {
			if(e.proxy){
				this.url = 'https://proxy.hpubox.top/proxy.html?url='+e.data
			} else {
				this.url = e.data
			}
			console.log(this.url)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
