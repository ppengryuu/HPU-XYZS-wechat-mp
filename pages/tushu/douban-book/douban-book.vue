<template>
	<view>
		<view v-if="bookpage==null" style="width: 100%;height: 500upx;color: #999999;" class="u-f-ajc">页面失效</view>
		<web-view v-else :webview-styles="wvstyle" :src="bookpage"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bookpage:'',
				wvstyle:{
					progress: {
						color: '#00A075'
					}
				}
			}
		},
		onNavigationBarButtonTap(e) {
			
		},
		onLoad(e) {
			// console.log(e)
			this.bookpage = e.url
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
