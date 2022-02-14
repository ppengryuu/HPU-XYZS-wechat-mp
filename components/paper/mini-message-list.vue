<template>
	<view class="mini-list" @tap="gotodetail(item)">
		<view class="aboutuser u-f-ac">
			<view class="userpic u-f-ac">
				<view class="u-f-ac">
					<image-cache :imgSrc="item.from_userpic"  mode="aspectFill" @tapimg="browseUserPost(item)"></image-cache>
				</view>
			</view>
			<view class="username u-f-ac">{{item.from_username}}</view>
		</view>
		<view class="u-f-jsb u-f-ac" style="width: 97%;"> 
			<view class="aboutType u-f">{{item.mtype=='2'?'回复了我':'赞了我'}}</view>
			<view class="aboutdate">{{gettime}}</view>
		</view>
		<view class="aboutcontent">
			<view class="contenttext">{{item.from_post}}</view>
		</view>
		<view class="aboutreply"  v-if="item.mtype=='2'">{{item.data}}</view>
	</view>
</template>

<script>
	import imageCache from '../image-cache/image-cache.vue';
	import time from '../../common/time.js';
	export default {
		components:{
			imageCache
		},
		props:{
			item:Object
		},
		computed:{
			gettime(){
				return time.gettime.gettime(this.item.time)
			}
		},
		methods:{
			gotodetail(item){
				uni.navigateTo({
					url: '/pages/detail/detail?type=postid&postid='+this.item.from_postid,
				});
			},
			browseUserPost(item){
				var data = {}
				data.userid = item.from_id
				data.username = item.from_username
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

<style>
	.aboutreply{
		width: 96%;
		font-size: 30upx;
		flex-wrap: wrap;
		word-break: break-all;  /* break-all(允许在单词内换行。) */
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 2; /** 显示的行数 **/
		overflow: hidden;
	}
	.aboutType{
		font-size: 32upx;
	}
	.aboutcontent{
		width: 98%;
		background: rgb(244, 245, 244);
		border-radius: 10upx;
	}
	.username{
		font-size: 35upx;
		margin-left: 16upx;
	}
	.aboutdate{
		color: #929292;
	}
	.aboutuser{
		width: 100%;
		padding-bottom: 20upx;
	}
	.userpic{
		width: auto;
	}
	.userpic>view{
		width: 60upx;
	}
	.userpic>view>image{
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
	}
	.mini-list{
		background: #FFFFFF;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-top: 10upx solid rgb(247, 248, 247);
		padding: 20upx 20upx;
	}
	.contenttext{
		padding: 10upx;
		flex-wrap: wrap;
		word-break: break-all;  /* break-all(允许在单词内换行。) */
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 2; /** 显示的行数 **/
		overflow: hidden;
	}
</style>
