<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:''
			}
		},
		onLoad(e) {
			uni.hideLoading();
			uni.showToast({title:'修改头像成功',icon:'none'})
			this.data = e.data
		},
		onReady() {
			console.log(this.data)
			this.emitdata()
			
		},
		methods: {
			async emitdata(){
				await uni.$emit('userpicChange',{newpic:this.data})
				uni.redirectTo({
					url:'../user-set-userinfo',
				})
			}
		}
	}
</script>

<style>

</style>
