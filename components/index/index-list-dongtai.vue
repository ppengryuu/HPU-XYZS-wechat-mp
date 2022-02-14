<template>
	<view class="index-list animated fadeIn faster200" :style="issystemMessages?'':indexListStyle" @tap="opendetail">
		<view style="display: flex;justify-content: center;">
			<view class="aboutuser" v-if="!issystemMessages">
				<view class="user">
					<view class="userpic">
						<image :src="item.userpic" mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 50%;margin-top:8rpx;" @tap.stop="browseUserPost(item)"></image>
						<!-- <image-cache :imgSrc="item.userpic" mode="aspectFill" v-if="updateUserpic" setStyle="width: 80rpx;height: 80rpx;border-radius: 50%;margin-top:8rpx;" @tapimg="browseUserPost(item)"></image-cache> -->
						<!-- <image :src="item.userpic" mode="scaleToFill"></image> -->
					</view>
					<view class="user-name-time">
						<view class="username">{{item.username}}</view>
						<view class="abouttime u-f-ac">{{item.time}}</view>
					</view>
				</view>
				<view class="useroption" style="display: flex;">
					<view class="moreopt icon iconfont icon-gengduo" @tap.stop="optionAboutPost(item)"></view>
				</view>
			</view>
		</view>
		<view style="display: flex;justify-content: center;">
			<view class="aboutcontent">
				<view style="display: flex;justify-content: center;">
					<view class="contenttext"><text class="ctext">{{item.content}}</text></view>
				</view>
				<view style="display: flex;justify-content: center;">
					<view v-if="item.contentimages.length>0&&!issystemMessages" class="contentimages">
						<block v-for="(imagesrc,index1) in item.contentimages.slice(0,3)" :key="index1">
							<view>
								<image-cache :previewarr="item.contentimages" :previewable="true" :imgSrc="imagesrc.url" mode="aspectFill"></image-cache>
							</view>
								<!-- <image :src="imagesrc.url" @tap.stop="previewImages(item.contentimages,imagesrc.url)" mode="aspectFill"></image></view> -->
						</block>
					</view>
					<view class="contentimages" v-if="issystemMessages">
						<image :src="item.contentimages[0]" @tap.stop="previewImages(item.contentimages)" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="aboutzpz" v-if="!issystemMessages">
			<view>
				<view class="icon iconfont icon-pinglun"></view><view class="pinglun">评论</view><view>{{item.commentnum}}</view>
			</view>
			<view v-if="item.infonum.index==2||item.infonum.index==-1" @tap.stop="switchislike(item)">
				<view class="icon iconfont icon-xihuan"></view><view class="dianzan">点赞</view><view>{{item.infonum.dingnum}}</view>
			</view>
			<view class="zanle" v-else-if="item.infonum.index==0" @tap.stop="switchislike(item)">
				<view class="icon iconfont icon-aixin2"></view><view class="dianzan">点赞</view><view>{{item.infonum.dingnum}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import imageCache from '../image-cache/image-cache.vue';
	export default {
		components:{
			imageCache
		},
		props:{
			backWhenPostId:Number,
			item:Object,
			index:Number,
			isme:false,
			issystemMessages:false,
			preable:false,
			fromBUP:false
		},
		mounted() {
			uni.$on('userpicChange',this.updateUpic)
		},
		data(){
			return{
				updateUserpic:true,
				indexListStyle:{
					'border-top': '1upx solid #f5f5f5',
					'border-bottom': '1upx solid #f5f5f5',
					'box-shadow': '0 0 1upx 1upx #f5f5f5'
				}
			}
		},
		methods:{
			updateUpic(){
				// console.log('收到全局通讯')
				if(this.item.userid == this.User.userinfo.id){
					// console.log('得到用户动态')
					this.updateUserpic = false
					setTimeout(()=>{
						this.updateUserpic = true
					},3000)
				}
			},
			previewImages(images,current) {
				let url_arr = []
				for (var i = 0;i<images.length;i++) {
					url_arr.push(images[i].url)
				}
				//预览图片
				// console.log(JSON.stringify(images))
				// console.log(url_arr)
				uni.previewImage({
					urls: url_arr,
					current: current
				});
			},
			switchisguanzhu(){
				if(!this.item.isguanzhu){
					this.item.isguanzhu=true
					uni.showToast({title:"关注成功",icon:"none"})
				} else {
					this.item.isguanzhu=false
					uni.showToast({title:"取消关注成功",icon:"none"})
				}
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
					
					uni.$emit('updateData',{
						type:'support',
						post_id:this.item.id
					});
				}catch(e){ return; }
				
			},
			// 进入详情页
			opendetail(){
				console.log(this.item.id)
				console.log(this.backWhenPostId)
				if(this.item.id == this.backWhenPostId){
					return uni.navigateBack({
						delta:1
					})
				}
				uni.setStorageSync('postDetail',this.item)
				uni.navigateTo({
					url: "/pages/detail/detail?fromBUP="+this.fromBUP
				})
			},
			optionAboutPost(item){
				// console.log(item)
				var opt_arr = []
				if(item.userid==this.User.userinfo.id){
					opt_arr = ['删除']
				} else {
					opt_arr = ['举报']
				}
				uni.showActionSheet({
					itemList:opt_arr,
					success: (res) => {
						if(res.tapIndex==0){
							if(opt_arr[0] === '删除'){
								this.deleteMyPost(item)
							} else if(opt_arr[0] === '举报'){
								this.reportPost(item)
							}
						}
					}
				})
			},
			async deleteMyPost(item){
				uni.showLoading({
					title:'删除中...'
				})
				let [err,res] = await this.$http.post('/user/delmypost',{
					postid:item.id,
				},{
					token:true,
					checkToken:true,
				});
				// console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				uni.$emit('updateData',{
					type:'deletePost',
					post_id:this.item.id
				});
				uni.hideLoading()
				return uni.showToast({title:"删除成功",icon:"none"})
			},
			async reportPost(item){
				uni.showLoading({title:"提交中"})
				let [err,res] = await this.$http.post('/user/report/1',{
					id:item.id,
				},{
					token:true,
					checkToken:true,
				});
				if (!this.$http.errorCheck(err,res)) return;
				uni.hideLoading()
				return uni.showToast({title:"举报成功",icon:"none"});
			},
			browseUserPost(item){
				// console.log('333')
				if(!this.preable){return;}
				var data = {}
				data.userid = item.userid
				data.username = item.username
				uni.setStorageSync('userDetail', data)
				if(data.userid==this.User.userinfo.id){
					uni.navigateTo({
						url:'/pages/user-space/my-post/my-post'
					})
				} else {
					uni.navigateTo({
						url:'/pages/browse-user-post/browse-user-post',
					})
				}
			}
			
		}
	}
</script>

<style scoped>
	.user-name-time{
		margin-top: 10rpx;
	}
	.aboutuser{
		width: 95%;
		/* background: #007AFF; */
		padding: 15upx 10upx 10upx 10upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.user{
		display: flex;
		flex-direction: row;
		align-items: center;
		/* background: #0A98D5; */
	}
	.weiguanzhu{
		font-size: 30upx;
		background: #F5F5F5;
		margin-right: 30upx;
		border-radius: 10upx;
		padding: 0 20upx;
	}
	.yiguanzhu{
		color: #AAAAAA;
		font-size: 30upx;
		background: #F5F5F5;
		margin-right: 30upx;
		border-radius: 10upx;
		padding: 0 20upx;
	}
		
	.moreopt{
		font-size: 30upx;
	}
	.username{
		margin-left: 16upx;
		/* font-weight: 600; */
		font-size: 32upx;
		line-height: 1.8;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.useroption{
		display: flex;
		flex-direction: row;
	}
	.userpic{
		width: 80upx;
		display: flex;
		align-items: center;
	}
	.aboutcontent{
		display: flex;
		width: 95%;
		flex-direction: column;
		padding-bottom: 20upx;
		/* background: #09BB07; */
	}
	.contenttext{
		/* background: #007AFF; */
		overflow: hidden;
		font-size: 33upx;
		width: 95%;
		margin-bottom: 8upx;
		/* background: #d3c5b0; */
		word-break: break-all;  /* break-all(允许在单词内换行。) */
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 3; /** 显示的行数 **/
	}
	.contentimages{
		/* background: #2AD19B; */
		width: 100%;
		height: 220upx;
		display: flex;
		flex-wrap: wrap;
		text-align: center;
		flex-direction: row;
	}
	.contentimages>view{
		/* flex: 1; */
		width: 30%;
		height: 100%;
		margin-left: 2.5%;
		/* background: #007AFF; */
	}
	.contentimages>view>image{
		border-radius: 16upx;
		background: #f0f0f0;
		width: 100%;
		height: 100%;
	}
	.contentimages>image{
		width: 100%;
		height: 220upx;
		border-radius: 16upx;
	}
	.aboutzpz{
		/* margin-top: 20upx; */
		border-top: 1upx solid #e6e6e6;
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		/* background: #F0AD4E; */
	}
	.aboutzpz view{
		color: #1a1a20;
	}
	.aboutzpz>view{
		/* background: #007AFF; */
		justify-content: center;
		align-items: center;
		display: flex;
		flex: 1;
		text-align: center;
		width: auto;
		padding: 15upx 0;
	}
	.aboutzpz>view>view:nth-child(1){
		font-size: 28upx;
	}
	.aboutzpz>view>view:nth-child(2){
		margin: 0 10upx;
		font-size: 25upx;
	}
	.aboutzpz>view>view:nth-child(3){
		font-size: 25upx;
	}
	.zanle view{
		color: rgb(255, 100, 100);
	}
	.index-list{
		background: rgb(255, 255, 255);
		margin: 15upx 0;
		margin-bottom: 30upx!important;
	}
	.index-list-hover{
		background: #f5f5f5!important;
	}
	.abouttime{
		line-height: 1.8;
		margin-left: 15upx;
		font-size: 22upx;
		color: #989898;
	}
</style>