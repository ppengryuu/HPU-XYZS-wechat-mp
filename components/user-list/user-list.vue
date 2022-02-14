<template>
	<view class="user-list u-f-ac animated fadeIn faster200" @tap="browseuserpost(item)">
		<view class="u-f-ac">
			<view class="u-f-ac">
				<image :src="item.userpic" mode="aspectFill" style="background: #f0f0f0;width: 80rpx;height: 80rpx;border-radius: 100%;margin-right: 20rpx;flex-shrink: 0;" @tap.stop="browseuserpost(item)"></image>
				<!-- <image-cache :imgSrc="item.userpic" mode="aspectFill" setStyle="background: #f0f0f0;width: 80rpx;height: 80rpx;border-radius: 100%;margin-right: 20rpx;flex-shrink: 0;" @tapimg="browseuserpost(item)"></image-cache> -->
			</view>
			<!-- <image :src="item.userpic" mode="aspectFill" lazy-load></image> -->
			<view class="u-f-column">
				<view class="username">{{item.username}}</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import imageCache from '../image-cache/image-cache.vue';
	export default {
		components:{
			imageCache
		},
		props:{
			item:Object,
			index:Number
		},
		methods:{
			browseuserpost(item){
				// console.log(item)
				var data = {}
				data.userid = item.id
				data.username = item.username
				if(data.userid==this.User.userinfo.id){
					uni.navigateTo({
						url:'/pages/user-space/my-post/my-post'
					})
				} else {
					uni.navigateTo({
						url:'/pages/browse-user-post/browse-user-post?info='+JSON.stringify(data),
					})
				}
			}
		}
	}
</script>

<style scoped>
.user-list{
	/* background: #00A075; */
	display: flex;
	/* margin: 20upx 0; */
	border-bottom: 1upx solid #EEEEEE;
	background: #FFFFFF;
	padding: 20upx;
}
.user-list >view>view:nth-child(1) {
	width: 80upx;
}
.username{
	margin-left: 10upx;
	/* font-weight: 600; */
	font-size: 32upx;
	overflow: hidden;
	word-break: break-all;
	text-overflow: ellipsis;  /* 超出部分省略号 */
	display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
	-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
	-webkit-line-clamp: 1; /** 显示的行数 **/
}

</style>
