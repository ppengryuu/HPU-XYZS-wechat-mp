<template>
	<view class="user-chat-item">
		
		<view v-if="item.gstime" class="user-chat-time u-f-ajc">{{item.gstime}}</view>
		<view class="user-chat-list u-f" :class="{'user-chat-me':item.isme}">
			<image v-if="!item.isme" :src="item.userpic" mode="scaleToFill" lazy-load></image>
			<view :class="!item.isme?'user-chat-list-body':'me-chat-list-body'">
				<!-- 文字 -->
				<text selectable="true" v-if="item.type=='text'">{{item.data}}</text>
				<!-- 图片 -->
				<image class="imgs" v-if="item.type=='img'" :src="item.data" mode="widthFix" @tap="previewpic(item.date)" @load="imgdone"></image>
			</view>
			<image v-if="item.isme" :src="item.userpic" mode="scaleToFill" lazy-load></image>
		</view>
		
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			index:Number
		},
		methods:{
			imgdone(imginfo){
				this.$emit('imgdone',true,imginfo)
			},
			previewpic(e){
				uni.previewImage({
					longPressActions:[],
					urls:[this.item.data]
				})
			}
		}
	}
</script>

<style scoped>
.user-chat-list{
	padding: 20upx;
	/* background: #007AFF; */
	/* border: 2upx solid #000000; */
}
.user-chat-list>image{
	width: 80upx;
	height: 80upx;
	border-radius: 100%;
	flex-shrink: 0;
}
.user-chat-list-body,.me-chat-list-body{
	flex-wrap: wrap;
	position: relative;
	font-size: 30upx;
	padding: 8upx 8upx;
	margin-left: 20upx;
	border-radius: 20upx;
	margin-right: 100upx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.user-chat-list-body{
	background: rgb(236, 236, 240);
}
.me-chat-list-body{
	background: rgb(94, 205, 90);
}
.user-chat-list-body>text{
	margin: 0 10upx;
}
.me-chat-list-body>text{
	margin: 0 10upx;
	color: #f8f8f8;
}
.user-chat-list-body:after,.me-chat-list-body:after{
	position: absolute;
	top: 25upx;
	content: '';
	width: 0;
	height: 0;
}
.user-chat-list-body:after{
	left: -30upx;
	right: 0;
	border: 16upx solid rgb(236, 236, 240);
	border-color: transparent rgb(236, 236, 240) transparent transparent;
}
.me-chat-list-body:after{
	left: auto;
	right: -30upx;
	border: 16upx solid rgb(94, 205, 90);
	border-color: transparent transparent transparent rgb(94, 205, 90);
}
.user-chat-me{
	justify-content: flex-end;
}
.me-chat-list-body{
	margin-right: 20upx;
	margin-left: 100upx;
}
.user-chat-list-body>image,.me-chat-list-body>image{
	max-width: 180upx;
	height: auto;
	border-radius: 16upx;
}
.user-chat-time{
	padding: 36upx 0;
	color: #a2a2a2;
	font-size: 24upx;
}
</style>
