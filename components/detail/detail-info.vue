<template>
	<view class="common-list">
		<view class="aboutuser u-f-ac">
			<image :src="item.userpic" mode="aspectFill"></image>
			<view class="userinfo">
				<view>{{item.username}}</view>
				<tag-sex-age :age="item.age" :sex="item.sex"></tag-sex-age>
			</view>
		</view>
		<view class="common-list-r">
			<view>{{item.content}}</view>
			<view class="u-f-ajc" style="flex-direction: column;">
				<!-- 图片 -->
				<block v-for="(pic,index) in item.morepic" :key="index">
					<image :src="pic" 
					mode="widthFix" 
					lazy-load 
					style="margin-bottom: 20upx;"
					@tap="imgdetail(index)"></image>
				</block>
				<!-- 视频 -->
				<template v-if="item.video">
					<view class="common-list-play icon iconfont icon-bofang">
					</view>
					<view class="common-list-playinfo">
						{{item.video.looknum}} 次播放 {{item.video.long}}
					</view>
				</template>
				<!-- 分享 -->
				<view class="common-list-share u-f-ac" v-if="item.share">
					<image :src="item.share.titlepic" 
					mode="widthFix" lazy-load></image>
					<view>{{item.share.title}}</view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import tagSexAge from "../common/tag-sex-age.vue"
	export default {
		components:{
			tagSexAge
		},
		props:{
			item:Object,
		},
		data() {
			return {
				isguanzhu: this.item.isguanzhu,
			}
		},
		methods:{
			guanzhu(){
				this.isguanzhu=true;
				uni.showToast({
					title: '关注成功',
				});
			},
			imgdetail(index){
				uni.previewImage({
					current:index,
					urls:this.item.morepic
				})
			},
			async switchislike(item){
				console.log(item.infonum.index)
				try{
					let type = Number
					if(item.infonum.index==-1||item.infonum.index == 2){
						type = 0
					} else if(item.infonum.index == 0){
						type = 2
					}
					console.log(type)
					// 0 无操作，1赞 ,2取消赞
					let [err,res] = await this.$http.post('/support',{
						post_id:this.item.id,
						type:type
					},{
						token:true,
						checkToken:true,
					});
					console.log(res)
					// 错误处理
					if (!this.$http.errorCheck(err,res)) return;
					if(type==0){
						uni.showToast({title:'点赞成功',icon:'none'})
					}
					if(type==0){
						item.infonum.index=0
						item.infonum.dingnum++
					} else {
						item.infonum.index=2
						item.infonum.dingnum--
					}
					let resdata = {
						type:"support",
						post_id:this.item.id,
						do:type
					};
					// 通知父组件
					this.$emit('changeevent',resdata);
					// 通知全局
					uni.$emit("updateData",resdata);
				}catch(e){ return; }
				
			},
		}
	}
</script>

<style scoped>
	@import "../../common/list.css";
	.aboutuser>image{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
	}
	.userinfo>view:nth-child(1){
		line-height: 28upx;
		padding-left: 10upx;
	}
	.userinfo{
		padding-top: 15upx;
	}
	.aboutuser{
		box-sizing: border-box;
		width: 100%;
		padding: 20upx 0;
		padding-left: 3%;
		/* border-bottom: 1upx solid #EEEEEE; */
	}
	.common-list-r{
		border-bottom: 0;
	}
	.common-list-r>view:nth-child(1){
		padding: 0 20upx 10upx 20upx;
	}
	.common-list{
		border-bottom: 1upx solid #EEEEEE;
		/* background: #0BACF0; */
	}
	.common-list-r-time{
		padding: 15upx 0;
		color: #CCCCCC!important;
		font-size: 25upx;
		background: #FFFFFF!important;
	}
	.common-list-r>view:nth-child(1)>view:nth-child(1)>view:first-child{
		color: #999999;
		font-size: 32upx;
	}
	.common-list-r>view:nth-child(2)>image{
		border-radius: 16upx;
		height: auto;
	}
	.common-list-r>view:nth-child(1)>view:nth-child(1)>view:last-child{
		/* background: #EEEEEE; */
		padding: 0 10upx;
		font-size: 26upx;
	}
	 
</style>
