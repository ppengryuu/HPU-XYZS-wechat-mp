<template>
	<view>
		<!-- 操作菜单 -->
		<view class="papar-left-popup-mask" v-show="show" @tap="hidepopup"></view>
		<view class="papar-left-popup" v-show="show">
			<view class="u-f-ac" hover-class="papar-left-popup-h" @tap="addfriend">
				<view class="icon iconfont icon-sousuo"></view> 
				<view>加好友</view>
			</view>
			<view class="u-f-ac" hover-class="papar-left-popup-h" @tap="clear">
				<view class="icon iconfont icon-qingchu"></view> 
				<view>清除未读</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			show:Boolean,
		},
		methods:{
			hidepopup(){
				this.$emit('hide');
			},
			addfriend(){
				this.$emit('addfriend');
			},
			clear(){
				this.$emit('clear');
			}
		}
	}
</script>

<style>
.papar-left-popup-mask{
	position: fixed;
	right: 0;
	left: 0;
	top: 0;
	bottom: 0;
	z-index: 1999;
}
.papar-left-popup{
	position: fixed;
	right: 0;
	top: 10upx;
	background: #FFFFFF;
	z-index: 2000;
	width: 36%;
	box-shadow: 1upx 1upx 20upx 2upx #CCCCCC;
}
.papar-left-popup>view{
	padding: 20upx;
}
.papar-left-popup>view>view{
	margin-right: 10upx; 
	font-size: 30upx;
	padding-left: 10upx;
}
.papar-left-popup-h{
	background: #EEEEEE;
}
</style>
