<template>
	<view class="user-space-userinfo">
		<view class="user-space-userinfo-item">
			<view>账号信息</view>
			<view class="u-f-ajc" style="width: 100%;">
				<image :src="userinfo.userpic" mode="aspectFill" style="width: 150rpx;height: 150rpx;border-radius: 50%;" @tap.stop="previewImages(userinfo.userpic)"></image>
				<!-- <image-cache :imgSrc="userinfo.userpic" mode="aspectFill" setStyle="width: 150rpx;height: 150rpx;border-radius: 50%;" :previewable="true"></image-cache> -->
				<!-- <image :src="userinfo.userpic" mode="aspectFill" @tap="previewImages(userinfo.userpic)"></image> -->
			</view>
			<view class="u-f-ajc" style="width: 100%;"><tag-sex-age :age="userinfo.age" :sex="userinfo.sex"></tag-sex-age></view>
			<view style="text-align: center;">{{userinfo.username}}</view>
		</view>
		<view class="user-space-userinfo-data">
			<view>个人信息</view>
			<view>星座：{{getXingZuo}}</view>
			<view>情感：{{userinfo.qg}}</view>
			<view>家乡：{{userinfo.path}}</view>
			<view>个人简介：</view>
			<view v-if="userinfo.userresume==null" style="color: #909090;">(未填写)</view>
			<view v-else>{{userinfo.userresume}}</view>
		</view>
	</view>
</template>

<script>
	import imageCache from '../image-cache/image-cache.vue';
	import tagSexAge from '../common/tag-sex-age.vue';
	import t from "../../common/time.js";
	export default {
		components:{
			imageCache,
			tagSexAge
		},
		props:{
			userinfo:Object
		},
		// mounted() {
		// 	console.log(this.userinfo)
		// },
		computed:{
			getRegAge(){
				return t.gettime.sumAge(this.userinfo.regtime)
			},
			getXingZuo(){
				if(this.userinfo.birthday=='未知'){return '未知'}
				return t.gettime.getHoroscope(this.userinfo.birthday)
			}
		},
		methods:{
			previewImages(url){
				var url_arr = []
				url_arr.push(url)
				uni.previewImage({
					urls: url_arr
				});
			}
		}
	}
</script>

<style scoped>
	.user-space-userinfo-data>view:nth-child(1){
		color: #333333;
		font-size: 35upx;
		padding: 15upx 0;
	}
	.user-space-userinfo-data{
		color: #909090;
	}
	.user-space-userinfo{
		padding: 0 30upx;
	}
	.user-space-userinfo-item{
		padding: 20upx 0;
		border-bottom: 1upx solid #EEEEEE;
	}
	.user-space-userinfo-item>view:nth-child(3){
		margin-top: 20upx;
	}
	.user-space-userinfo-item>view:nth-child(4){
		/* margin-top: 10upx; */
		color: #1a1a1a;
		font-size: 35upx;
		font-weight: bold;
	}
	.user-space-userinfo-item>view:first-child{
		color: #333333;
		font-size: 35upx;
		padding: 15upx 0;
	}
</style>
