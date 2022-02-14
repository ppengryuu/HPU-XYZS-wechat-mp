<template>
	<view class="uni-comment-list">
		<view class="comment-userpic"><image :src="item.userpic" mode="aspectFill"></image></view>
		<view class="uni-comment-body">
			<view class="uni-comment-top"><text>{{item.username}}</text>
			</view>
			<view v-if="item.fid>0">回复 {{item.fid}}</view>
			<view class="uni-comment-content">{{item.data}}</view>
			<view class="uni-comment-date">
				<view>{{item.time}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			index:Number
		},
		mounted() {
			// console.log(this.item)
		},
		methods:{
			
		}
	}
</script>

<style scoped>
	.u-comment-list-child{
		padding: 20upx;
		background: #F4F4F4;
		border-bottom: 1upx solid #EEEEEE;
		box-sizing: border-box;
		margin: 0;
		margin-left: 70upx;
		width: auto;
	}
	.comment-userpic>image{
		width: 70upx;
		height: 70upx;
		margin-right: 20upx;
		border-radius: 50%;
	}
</style>
