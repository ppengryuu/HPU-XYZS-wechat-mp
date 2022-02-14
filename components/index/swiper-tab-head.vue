<template>
	<view class="uni-tab-bar">
		<scroll-view scroll-x class="uni-swiper-tab" :style="scrollStyle">
			<view class="tabcontainer">
				<block v-for="(tab,index) in tabBars" :key="tab.id">
					<view class="swiper-tab-list" 
					:class="{'active':tabIndex==index}"
					@tap="tabtap(index)"
					:style="scrollItemStyle">
						{{tab.name}} {{tab.num?tab.num:''}}
						<view class="swiper-tab-line"></view>
					</view>
				</block>
			</view>
				
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props:{
			tabBars:Array,
			tabIndex:Number,
			scrollStyle:{
				type:String,
				default:""
			},
			scrollItemStyle:{
				type:String,
				default:""
			}
		},
		return:{
			
		},
		methods:{
			tabtap(index){
				this.$emit('tabtap',index);
			//	console.log(index)
			},
		},
		onLoad() {
			
		}
	}
</script>

<style>
.tabcontainer{
	width: 50%;
}
.uni-swiper-tab{
	background: rgb(248,248,248);
	border-bottom: 1upx solid #FFFFFF;
	width: 100%;
	height: 80upx;
}
.swiper-tab-list{
	width: 100%;
	color: #969696;
	font-weight: bold;
}
.uni-tab-bar .active{
	color: #343434;
}
.active .swiper-tab-line{
	border-bottom: 12upx solid #5280fe;
	width: 70upx;
	margin: auto;
	border-radius:20upx;
}
</style>
