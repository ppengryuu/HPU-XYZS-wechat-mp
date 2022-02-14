<template>
	<view class="body1">
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		
		<block v-for="(item,index) in imgurl" :key="index">
			<image :src="item" mode="widthFix" style="width: 90%;height: auto;margin:20rpx 5%;box-sizing:border-box"></image>
			<!-- <image-cache :imgSrc="item" mode="widthFix" setStyle="width: 90%;height: auto;margin:20rpx 5%;box-sizing:border-box"></image-cache> -->
		</block> 
		
	</view>
</template>

<script>
	// import imageCache from '../../components/image-cache/image-cache.vue';
	export default {
		components:{
			// imageCache
		},
		data() {
			return {
				imgurl:[],
				config:{
					title:"校历", //title
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
		onLoad() {
			this.imgurl = uni.getStorageSync('canlenderUrl')
			this.getdata()
		},
		methods: {
			async getdata(){
				let [err,res] = await this.$http.get('/app/schoolcalender');
				// 请求失败处理
				// console.log(res)
				if (!this.$http.errorCheck(err,res)) return uni.hideLoading();
				uni.setStorageSync('canlenderUrl',res.data.data)
				this.imgurl = res.data.data
			}
		}
	}
</script>

<style>
	.body1{
		width: 100%;
	}
</style>
