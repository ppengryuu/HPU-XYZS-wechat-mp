<template>
	<view>
		<!-- 操作菜单 -->
		<view class="right-top-popup-mask" v-show="show" @tap="hidepopup"></view>
		<view class="right-top-popup" v-show="show">
			<block v-for="(item,index) in options" :key="index">
				<view class="u-f-ac" hover-class="right-top-popup-h" @tap="tapoption(index)">
					<image :src="item.optionIconPath" mode="widthFix"></image>
					<view>{{item.optionText}}</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			show:Boolean,
			options:Object,
		},
		methods:{
			hidepopup(){
				this.$emit('hide');
			},
			tapoption(index){
				this.$emit('tapoption',index);
			}
		}
	}
</script>

<style>
.right-top-popup>view>image{
	width: 36upx;
	height: auto;
	margin-top: -6upx;
	/* margin-right: 10upx; */
	/* padding-left: 10upx; */
}
.right-top-popup-mask{
	position: fixed;
	right: 0;
	left: 0;
	top: 0;
	bottom: 0;
	z-index: 1999;
}
.right-top-popup{
	position: fixed;
	right: 0;
	top: 150upx;
	background: #FFFFFF;
	z-index: 2000;
	width: 36%;
	box-shadow: 1upx 1upx 20upx 2upx #CCCCCC;
}
.right-top-popup>view{
	padding: 20upx;
}
.right-top-popup>view>view{
	margin-right: 10upx; 
	font-size: 30upx;
	padding-left: 10upx;
}
.right-top-popup-h{
	background: #EEEEEE;
}
</style>
