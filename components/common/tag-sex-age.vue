<template>
	<view style="display: inline-block;">
		<view class="tag-sex" style="background: #282828" v-if="sex==0"><view class="icon iconfont">{{age}}岁</view></view>
		<view class="tag-sex" style="background: #007AFF" v-if="sex==1">
			<view class="icon iconfont icon-nan">{{age}}</view>
		</view>
		<view class="tag-sex" style="background: #FF698D" v-if="sex==2">
			<view class="icon iconfont icon-nv">{{age}}</view> 
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			sex:Number,
			age:Number
		}
	}
</script>

<style scoped>
.tag-sex view{
	font-size: 23upx;
	color: #FFFFFF;
	line-height: 1;
}
.tag-sex{
	padding: 16upx 8upx;
	margin-left: 10upx;
	border-radius:20upx;
}
</style>
