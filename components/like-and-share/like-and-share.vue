<template>
	<view>
		<view class="like-and-share" v-if="likeInfo.status">
			<view class="las-title">
				<rich-text type="text" :nodes="likeInfo.description"></rich-text>
			</view>
			<view class="u-f-jsb">
				<likeButton class="like-b" 
				:style="{
					'background':!likeBTaped?'#ff5768':'#e14c65'
				}" 
				:site='likeSiteArr'
				:large="2" 
				@handleClick="LikeButtClicked()" 
				>
					<view class="u-f-ajc like" hover-stay-time="100" hover-class="like-h" @touchstart="touchstartLb()" @touchend="touchendLb()">
						<view class="icon iconfont icon-aixin2"></view>
							<view>
								已收到
								<text style="margin: 0 5rpx;">
									<!-- {{formatNumber(likeInfo.num)}} -->
									{{likeInfo.num?likeInfo.num:'?'}}
								</text>
								个赞
							</view>
					</view>
				</likeButton> 
				<button open-type="share" class="share-b" hover-stay-time="100" hover-class="share-b-h">
					<view class="u-f-ajc share" hover-stay-time="100" hover-class="share-h">
						<view class="icon iconfont icon-zhuanfa2"></view>
						<view>分享</view>
					</view>
				</button>
				
			</view>
		</view>
		<view v-else :style="'height: ' + placeHolder + '!important;'"></view>
	</view>
</template>

<script>
	import likeButton from '../../components/like-button/like-button.vue';
	export default {
		components: {
			likeButton
		},
		props:{
			pageId:{
				type:Number,
				default: 1
			},
			placeHolder:{
				type: String,
				default: '0rpx'
			}
		},
		data() {
			return {
				likeInfo: {},
				likeBTaped: false,
				likeNum: 0,
				likeSiteArr: [100,20]
			};
		},
		created() {
			this.getData(this.pageId, 0)
		},
		computed:{
			
		},
		methods:{
			touchstartLb(){
				this.likeBTaped = true
			},
			touchendLb(){
				this.likeBTaped = false
			},
			LikeButtClicked(){
				console.log('点了like')
				this.getData(this.pageId, 1)
			},
			// calLikeSite(){
			// 	uni.createSelectorQuery().in(this).select(".share-b").boundingClientRect((res)=>{
			// 	    console.log(res)
			// 		var x = res.left + res.width/2
			// 		x = x/(uni.upx2px(x)/x)
			// 		var y = res.top - res.height - 20
			// 		y = y/(uni.upx2px(y)/y)
			// 		this.likeSiteArr = [x, y]
			// 	}).exec()
			// },
			async getData(pageId, type){
				let [err,res] = await this.$http.post('/app/supportme',{
					page_id: pageId,
					type: type
				});
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				
				let t = res.data.data
				this.likeInfo = t
			}
		}
	}
</script>

<style>
	.like-and-share{
		margin: 30rpx;
		border: 1rpx solid #EEEEEE;
		border-radius: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
	}
	.like-h, .share-h{
		scale: 0.95;
		opacity: 0.9;
	}
	.like-b, .share-b{
		border-radius: 60rpx;
		border: 1px solid #EEEEEE;
		margin: 20rpx;
		padding: 16rpx;
		box-sizing: border-box;
		color: #FFFFFF;
	}
	.like-b{
		width: 70%;
	}
	.share-b{
		width: 30%;
		background: #00B9FF;
	}
	.share-b-h{
		background: #00a5e1!important;
	}
	.like>view, .share>view{
		margin: 6rpx;
	}
	.like>view:nth-child(1){
		font-size: 34rpx!important
	}
	.share>view:nth-child(1){
		font-size: 38rpx!important
	}
	
	.las-title{
		margin: 0 34rpx;
		color: #282828;
	}
</style>
