<template>
	<view v-if="pageready">
		<navigation-custom :config="config" @buttonTap="buttonTap"/>

		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		<view class="index-list animated fadeIn faster200" :style="indexListStyle">
			<view style="display: flex;justify-content: center;">
				<view class="aboutuser">
					<view class="user">
						<view class="userpic">
							<image :src="eitem.userpic" mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 50%;margin-top:8rpx;" @tap.stop="browseUserPost(eitem)"></image>
							<!-- <image-cache :imgSrc="eitem.userpic" mode="aspectFill" setStyle="width: 80rpx;height: 80rpx;border-radius: 50%;margin-top:8rpx;" @tapimg="browseUserPost(eitem)"></image-cache> --> 
						</view>
						<view style="margin-top: 10rpx;"> 
							<view class="username">{{eitem.username}}</view>
							<view class="user-abouttime u-f-ac">{{eitem.time}}</view>
						</view>
					</view>
				</view>
			</view>
			<view style="display: flex;justify-content: center;">
				<view class="aboutcontent">
					<view style="display: flex;justify-content: center;">
						<view class="contenttext"><text class="ctext">{{eitem.content}}</text></view>
					</view>
					<view style="display: flex;justify-content: center;">
						<view v-if="eitem.contentimages.length>0" class="contentimages">
							<block v-for="(imagesrc,index1) in eitem.contentimages" :key="index1">
								<view>
									<image-cache :previewarr="eitem.contentimages" :previewable="true" :imgSrc="imagesrc.url" mode="aspectFill"></image-cache>
								</view>
								<!-- <image :src="imagesrc.url" @tap.stop="previewImages(eitem.contentimages,imagesrc.url)" mode="widthFix"></image> -->
							</block>
						</view>
					</view>
				</view>
			</view>
			<view class="aboutzpz">
				<view>
					<view class="icon iconfont icon-pinglun"></view><view class="pinglun">评论</view><view>{{eitem.commentnum}}</view>
				</view>
				<view v-if="[2,-1].indexOf(eitem.infonum.index)>-1" @tap.stop="switchislike(eitem)">
					<view class="icon iconfont icon-xihuan"></view><view class="dianzan">点赞</view><view>{{eitem.infonum.dingnum}}</view>
				</view>
				<view class="zanle" v-else-if="eitem.infonum.index==0" @tap.stop="switchislike(eitem)">
					<view class="icon iconfont icon-aixin2"></view><view class="dianzan">点赞</view><view>{{eitem.infonum.dingnum}}</view>
				</view>
			</view>
		</view>
		
		<view class="comment-body index-list animated fadeIn faster200" :style="indexListStyle">
			<view>评论</view>
			<view class="uni-comment u-comment">
				<view v-if="comment.list.length==0" style="text-align: center;color: #989898;">{{commentload?'暂无评论':'加载中...'}}</view>
				<block v-else v-for="(item,index) in comment.list" :key="index">
					<view class="uni-comment-list" :class="{'u-comment-list-child':(item.fid>0)}">
						<view class="comment-userpic">
							<!-- <image :src="item.userpic" mode="aspectFill"></image> -->
							<image :src="item.userpic" mode="aspectfill" style="width: 70rpx;height: 70rpx;margin-right: 20rpx;margin-top: 10rpx;border-radius: 50%;" @tap.stop="browseUserPost(item)"></image>
							<!-- <image-cache :imgSrc="item.userpic" mode="aspectfill" setStyle="width: 70rpx;height: 70rpx;margin-right: 20rpx;margin-top: 10rpx;border-radius: 50%;" @tapimg="browseUserPost(item)"></image-cache> -->
						</view>
						<view class="uni-comment-body">
							<view class="comment-top">
								<view style="color: #000000;font-size: 30upx;" class="u-f-ac">
									{{item.username}}
									<view v-if="item.userid==eitem.userid" style="color: #00AAFF;font-size: 22upx;">(楼主)</view>
								</view>
								<view class="abouttime u-f-ac">{{item.time}}</view>
							</view>
							<view v-if="item.fid>0" class="comment-reply u-f-ac">回复 
								<block v-for="(gitem,m) in comment.list" :key="m">
									<view v-if="gitem.id==item.fid" style="color: #00AAFF;padding-right: 10upx;" class="u-f-ac" hover-class="comment-list-hover" hover-stay-time="100" @tap.stop="browseUserPost(gitem)">
										{{gitem.username}}
										<view v-if="gitem.userid==eitem.userid" style="color: #00AAFF;font-size: 22upx;">(楼主)</view>
									</view>
								</block>：
							</view>
							<view v-if="item.data==null" class="uni-comment-content" style="color: #909090;">（该评论已被删除）</view>
							<view v-else class="uni-comment-content" hover-class="comment-list-hover" hover-stay-time="100"  @tap="replyComment(item)" @longtap="optionAboutComment(item)">{{item.data}}</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<view class="bottominputH" :style="{height:screenHeight/4+'px'}"></view>
		
		<view class="input-reply">
			<view>
				<view class="comment-reply u-f-ac" v-if="reply_comment!=null">回复
					<block v-for="(fitem,m) in comment.list" :key="m">
						<view v-if="fitem.id==reply_comment.id" style="color: #00AAFF;" class="u-f-ac">
							{{fitem.username}}
							<view v-if="fitem.userid==eitem.userid" style="color: #00AAFF;font-size: 22upx;">(楼主)</view>
						</view>
					</block>：<view style="color: #00AAFF;margin: 10upx 20upx;padding: 0 10upx;" @tap="cancelreplycomment" hover-class="cancel-hover" hover-stay-time="100">取消</view>
				</view>
			</view>
			<view class="u-f-ac">
				<textarea show-confirm-bar="false" auto-height="true" v-model="text" placeholder="评论一下" maxlength="200"/>
				<view class="u-f-ajc submit-button" hover-class="submit-hover" hover-stay-time="100" @tap="submit(text)"><view>发表</view></view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import imageCache from '../../components/image-cache/image-cache.vue';
	import commentList from "../../components/detail/comment-list.vue";
	import time from "../../common/time.js";
	export default {
		components:{
			imageCache,
			commentList
		},
		data(){
			return{
				text:'',
				reply_comment:null, // 回复评论条目
				commentload:false,
				eitem:Object,
				index:Number,
				indexListStyle:{
					'border-bottom': '1upx solid #f5f5f5',
					'border-top': '1upx solid #f5f5f5',
					'box-shadow': '0 0 1upx 1upx #f5f5f5'
				},
				comment:{
					count:0,
					list:[]
				},
				screenHeight:0,
				fromBUP:false,
				pageready:false,
				config:{
					title:"动态详情", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							iconfont:"icon-gengduo",
						}
					]
				}

			}
		},
		watch:{
			text(){
				if(this.text.length == 200){
					return uni.showToast({
						title:"最长200个字符",
						icon:"none"
					})
				}
			},
		},
		onLoad(e) {
			// console.log(e)
			uni.getSystemInfo({
				success: (res) => {
					this.screenHeight =res.screenHeight
				}
			})
			if(e.type=='postid'){
				this.getdetail(parseInt(e.postid))
				// console.log(parseInt(e.postid))
			} else {
				// this.eitem = JSON.parse(e.detailData)
				this.eitem = uni.getStorageSync('postDetail')
				uni.removeStorageSync('postDetail')
				console.log(this.eitem)
				this.fromBUP = e.fromBUP
				this.pageready = true
				this.getcomment()
			}
			
			uni.$on('updateData',this.updateData)
		},
		async onPullDownRefresh() {
			this.commentload=false
			this.comment={
				count:0,
				list:[]
			},
			await this.getcomment()
			uni.stopPullDownRefresh()
		},
		methods:{
			updateData(data){
				switch (data.type){
					case "guanzhu":
					this.updateGuanZhu(data);
						break;
					case "support":
					if(data.post_id == this.eitem.id){
						let type = this.eitem.infonum.index
						if(type!=0){
							this.eitem.infonum.index=0
							this.eitem.infonum.dingnum++
						} else {
							this.eitem.infonum.index=2
							this.eitem.infonum.dingnum--
						}
					}
						break;
					case "updateList":
					this.updateList(data);
						break;
					case "deletePost":
					this.deletePost(data);
						break;
					case 'CommentNum':
					this.updateCommentNum(data);
						break;
				}
			},
			buttonTap(e){
				if(e.index==0){
					this.publicM.back1()
				}
				else if(e.index==1){
					var opt_arr = []
					if(this.eitem.userid==this.User.userinfo.id){
						opt_arr = ['删除']
					} else {
						opt_arr = ['举报']
					}
					uni.showActionSheet({
						itemList:opt_arr,
						success: (res) => {
							if(res.tapIndex==0){
								if(opt_arr[0] === '删除'){
									this.deleteMyPost(this.eitem)
								} else if(opt_arr[0] === '举报'){
									this.reportPost(this.eitem)
								}
							}
						}
					})
				}
			},
			async getdetail(postid){
				let [err,res] = await this.$http.get('/post/'+postid,{
					userId:this.User.userinfo.id
				});
				// 错误处理
				if (!this.$http.errorCheck(err,res)) return;
				console.log(res)
				var detail = res.data.data.detail
				this.eitem = this.__format(detail)
				// console.log(this.eitem)
				this.pageready = true
				this.getcomment()
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
				if(!this.eitem.isguanzhu){
					this.eitem.isguanzhu=true
					uni.showToast({title:"关注成功",icon:"none"})
				} else {
					this.eitem.isguanzhu=false
					uni.showToast({title:"取消关注成功",icon:"none"})
				}
			},
			async switchislike(eitem){
				// console.log(eitem.infonum.index)
				let type = Number
				if(eitem.infonum.index==-1||eitem.infonum.index == 2){
					type = 0
				} else if(eitem.infonum.index == 0){
					type = 2
				}
				// console.log(type)
				// 0赞，1踩（不开放），2赞过或踩过后又取消 !important
				let [err,res] = await this.$http.post('/support',{
					post_id:this.eitem.id,
					type:type
				},{
					token:true,
					checkToken:true,
				});
				
				// console.log(res)
				uni.$emit('updateData',{
					type:'support',
					post_id:this.eitem.id
				});
				// 错误处理
				if (!this.$http.errorCheck(err,res)) return;
				// if(type==0){
				// 	eitem.infonum.index=0
				// 	eitem.infonum.dingnum++
				// } else {
				// 	eitem.infonum.index=2
				// 	eitem.infonum.dingnum--
				// }
			},
			async submit(data){
				if(data.length==0){
					return uni.showToast({title:"不能发送空的内容",icon:"none"})
				}
				uni.showLoading({
					title:'发表中...'
				})
				let reply_id = this.reply_comment==null?0:this.reply_comment.id;
				let postmessage = {
					type : 'post', 	//
					mtype : 2,		// 评论
					from_id : this.User.userinfo.id,	// 来自用户id
					to_id : this.reply_comment==null?this.eitem.userid:this.reply_comment.userid,		// 发送给用户id
					from_userpic : this.User.userinfo.userpic,		// 来自用户的头像
					from_username : this.User.userinfo.username,	// 来自用户头像 
					from_post : reply_id==0?this.eitem.content:this.reply_comment.data, 	// 来自文章（文字内容）
					from_postid : this.eitem.id, 	// 来自文章id
					data : data, 	// 评论内容
				}
				if(this.reply_comment==null?this.eitem.userid:this.reply_comment.userid!=this.User.userinfo.id){
					this.$message.send(postmessage)
				}
				let [err,res] = await this.$http.post('/post/comment',{
					post_id:this.eitem.id,
					fid:reply_id,
					data:data
				},{
					// new bug backend notyet
					token:true,
					checkToken:true,
				});
				// 错误处理
				if (err || res.data.errorCode) {
					let msg = res.data.errorCode ? res.data.msg : '评论失败，请检查网络';
					uni.hideLoading();
					return uni.showToast({title:msg,icon:"none"})
				}
				// 发送成功
				uni.hideLoading()
				uni.showToast({title:"评论成功",icon:"none"})
				var id = parseInt(res.data.data.id)
				let result = {
					id:id,
					fid:reply_id,
					fnum:0,
					userid:this.User.userinfo.id,
					userpic:this.User.userinfo.userpic,
					username:this.User.userinfo.username,
					time:time.gettime.gettime(new Date().getTime()),
					data:data,
				};
				// console.log(result)
				// 评论数+1
				this.text = ''
				this.eitem.commentnum++
				// 通知首页更新评论数，通知会员中心更新评论数
				uni.$emit('updateData',{
					type:'CommentNum',
					post_id:this.eitem.id,
					data:this.eitem.commentnum
				});
				// 一级评论
				if (reply_id === 0) {
					uni.pageScrollTo({
						duration:100,
						scrollTop:999999999999999
					})
					return this.comment.list.push(result);
				}
				// 二级评论
				// 找出被评论id的索引
				this.UpdateFnumAdd(reply_id)
				let index = this.comment.list.findIndex((val)=>{
					return val.id === reply_id;
				});
				if (index > -1) {
					// 中间插入
					this.comment.list.splice(index+1,0,result);
				}
			},
			// f回复 更新fnum
			UpdateFnumAdd(id){
				// console.log(id)
				let index = this.comment.list.findIndex((val)=>{
					return val.id === id;
				});
				this.comment.list[index].fnum++
				if(this.comment.list[index].fid>0){
					this.UpdateFnumAdd(this.comment.list[index].fid)
				}
			},
			// 删除 更新fnum
			UpdateFnumDesc(id){
				let index = this.comment.list.findIndex((val)=>{
					return val.id === id;
				});
				this.comment.list[index].fnum--
				if(this.comment.list[index].fid>0){
					this.UpdateFnumDesc(this.comment.list[index].fid)
				}
			},
			// 获取评论
			async getcomment(){
				let [err,res] = await this.$http.get('/post/'+this.eitem.id+'/comment');
				// console.log(res)
				// console.log(this.comment)
				if (!this.$http.errorCheck(err,res)) return;
				let list = res.data.data.list;
				// console.log(list.length)
				uni.$emit('updateData',{
					type:'CommentNum',
					post_id:this.eitem.id,
					data:list.length
				});
				this.eitem.commentnum = list.length
				let sortlist = this.__ArrSort(list)
				this.comment.list = this.comment.list.concat(sortlist);
				// console.log(JSON.stringify(this.comment.list))
				this.commentload=true
			},
			__ArrSort(arr,id = 0){
				var temp = [],lev=0;
				var forFn = function(arr, id,lev){
					for (var i = 0; i < arr.length; i++) {
						var item = arr[i];
						if (item.fid==id) {
							item.lev=lev;
							temp.push({
								id:item.id,
								fid:item.fid,
								fnum:item.fnum,
								userid:item.user.id,
								userpic:item.user.userpic,
								username:item.user.username,
								time:time.gettime.gettime(item.create_time),
								data:item.data,
							});
							forFn(arr,item.id,lev+1);
						}
					}
				};
				forFn(arr, id,lev);
				return temp;
			},
			replyComment(item){
				// console.log(item)
				this.reply_comment = item
				// console.log(this.reply_comment)
			},
			cancelreplycomment(){
				this.reply_comment = null
				// console.log(this.reply_comment)
			},
			optionAboutComment(item){
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
								this.deleteMyComment(item)
							} else if(opt_arr[0] === '举报'){
								this.reportComment(item)
							}
						}
					}
				})
			},
			async deleteMyComment(item){
				// console.log(item)
				let [err,res] = await this.$http.post('/user/delmycomment',{
					commentid:item.id,
				},{
					token:true,
					checkToken:true,
					checkAuth:true
				});
				if (!this.$http.errorCheck(err,res)) return;
				// console.log(res)
				let index = this.comment.list.findIndex((val)=>{
					return val.id === item.id;
				});
				if(item.fnum==0 && item.fid==0){
					this.comment.list.splice(index,1);
					this.eitem.commentnum--
				}
				if(item.fnum>0 && item.fid==0){
					this.comment.list[index].data=null;
				}
				if(item.fnum==0 && item.fid>0){
					let index1 = this.comment.list.findIndex((val)=>{
						return val.id === item.fid;
					});
					this.UpdateFnumDesc(item.fid);
					this.comment.list.splice(index,1);
					this.eitem.commentnum--
					this.DelNullComment(item.fid)
				}
				if(item.fnum>0 && item.fid>0){
					let index2 = this.comment.list.findIndex((val)=>{
						return val.id === item.fid;
					});
					this.UpdateFnumDesc(item.fid);
					this.comment.list[index].data=null;
					this.DelNullComment(item.fid)
				}
				// this.eitem.commentnum--
				if (!this.$http.errorCheck(err,res)) return;
				uni.$emit('updateData',{
					type:'CommentNum',
					post_id:this.eitem.id,
					data:this.eitem.commentnum
				});
				// this.getcomment()
				return uni.showToast({title:"删除成功",icon:"none"});
			},
			async reportComment(item){
				uni.showLoading({title:"提交中"})
				let [err,res] = await this.$http.post('/user/report/2',{
					id:item.id,
				},{
					token:true,
					checkToken:true,
				});
				if (!this.$http.errorCheck(err,res)) return;
				uni.hideLoading()
				return uni.showToast({title:"举报成功",icon:"none"});
			},
			DelNullComment(id){
				let index = this.comment.list.findIndex((val)=>{					return val.id === id;				});
				var fid = this.comment.list[index].fid
				if(this.comment.list[index].fnum==0 && this.comment.list[index].data==null){
					this.comment.list.splice(index,1);
					this.eitem.commentnum--
					if(fid>0){
						let index1 = this.comment.list.findIndex((val)=>{
							return val.id === fid;
						});
						if(this.comment.list[index1].data==null){
							this.DelNullComment(fid)
						}
					}
				}
				return true
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
					post_id:item.id
				});
				uni.hideLoading()
				uni.showToast({
					title:"删除成功",
					icon:"none"
				})
				uni.navigateBack({
					delta:1
				})
			},
			async reportPost(eitem){
				uni.showLoading({title:"提交中"})
				let [err,res] = await this.$http.post('/user/report/1',{
					id:eitem.id,
				},{
					token:true,
					checkToken:true,
					checkAuth:true
				});
				if (!this.$http.errorCheck(err,res)) return;
				uni.hideLoading()
				return uni.showToast({
					title:"举报成功",
					icon:"none"
				})
			},
			browseUserPost(item){
				// console.log(this.fromBUP)
				if(this.fromBUP == 'true'&&item.userid==this.eitem.userid){
					return uni.navigateBack({
						delta:1,
					})
				}
				var data = {}
				data.userid = item.userid
				data.username = item.username
				data.fromPost = this.eitem.id
				uni.setStorageSync('userDetail', data)
				console.log(data.fromPost)
				if(data.userid==this.User.userinfo.id){
					uni.navigateTo({
						url:'../user-space/my-post/my-post'
					})
				} else {
					uni.navigateTo({
						url:'../../pages/browse-user-post/browse-user-post'
					})
				}
			},
			__format(item){
				// console.log(JSON.stringify(item))
				return {
					userid:item.user.id,
					userpic:item.user.userpic,
					username:item.user.username,
					isguanzhu:item.user.fens?!!item.user.fens.length:false,
					id:item.id,
					title:item.title,
					content:item.content,
					type:"img", // img:图文,video:视频
					titlepic:item.titlepic,
					contentimages:item.images,
					video:false,
					path:item.path,
					share:!!item.share,
					infonum:item.support?{
						index:item.support.length>0?item.support[0].type:-1,//0:赞，1踩,2:赞或踩后又取消；
						dingnum:item.ding_count,
						cainum:item.cai_count,
					}:{
						index:-1,//0:赞，1踩,2:赞或踩后又取消；
						dingnum:0,
						cainum:0,
					},
					commentnum:item.comment_count,
					sharenum:item.sharenum,
					time:item.create_time==null?'':time.gettime.gettime(item.create_time)
				}
			},
			
		}
	}
</script>

<style scoped>
	.submit-hover{
		background: #0093DC!important;
	}
	.comment-body>view:nth-child(1){
		padding: 20upx;
		box-sizing: border-box;
	}
	.comment-body>view:nth-child(1)>view{
		/* font-size: 36upx; */
		padding-left: 10upx;
		color: #242424;
	}
	.comment-body>view:nth-child(1){
		font-size: 36upx;
		padding-bottom: 10upx;
		color: #242424;
	}
	.input-reply{
		position: fixed;
		bottom: 0;
		padding: 0 20upx 20upx 20upx;
		box-sizing: border-box;
		background: rgb(236, 239, 240);
		border-top: 3upx solid #e6e6e6;
		width: 100%;
		z-index: 9999;
	}
	.input-reply>view:nth-child(1){
		/* background: #2AD19B; */
		padding: 10upx;
	}
	.input-reply>view:nth-child(2){
		width: 100%;
		/* background: #2AD19B; */
	}
	.input-reply>view:nth-child(2)>textarea{
		width: 90%;
		border-bottom: 1upx solid #dcdcdc;
		padding: 10upx;
		font-size: 28upx!important;
		/* border-radius: 3upx; */
	}
	.input-reply>view:nth-child(2)>view{
		width: 10%;
		/* background: #00A075; */
		color: #ffffff;
		background: #00AAFF;
		padding: 5upx 10upx;
		margin-left: 20upx;
		border-radius: 30upx;
		/* border-radius: 16upx; */
	}
	.aboutuser{
		width: 95%;
		/* background: #007AFF; */
		padding: 10upx;
		margin: 15upx 10upx 20upx 10upx;
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
		display: flex;
		align-items: center;
	}
	.aboutcontent{
		display: flex;
		width: 95%;
		flex-direction: column;
		/* background: #09BB07; */
	}
	.contenttext{
		/* background: #007AFF; */
		font-size: 33upx;
		width: 95%;
		margin-bottom: 8upx;
		/* background: #d3c5b0; */
		word-break: break-all;  /* break-all(允许在单词内换行。) */
	}
	.contentimages{
		/* background: #2AD19B; */
		width: 100%;
		/* height: auto; */
	}
	.contentimages>view{
		/* flex: 1; */
		width: 95%;
		/* height: 100%; */
		margin-left: 2.5%;
		/* background: #007AFF; */
	}
	.contentimages>view>image{
		border-radius: 16upx;
		background: #f0f0f0;
		width: 100%;
		/* height: 100%; */
	}
	.aboutzpz{
		margin-top: 20upx;
		border-top: 1upx solid #e6e6e6;
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
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
		margin-bottom: 30upx!important;
	}
	.u-comment{
		padding: 20upx 0;
	}
	.u-comment-list-child{
		padding: 20upx;
		/* background: #F4F4F4; */
		border-left: 3upx solid #EEEEEE;
		box-sizing: border-box;
		margin: 0;
		margin-left: 70upx;
		width: auto;
	}
	.comment-reply>view:nth-child(1){
		padding-left: 10upx;
	}
	.bottominputH{
		/* height: 250upx; */
	}
	.user-abouttime{
		line-height: 1.8;
		margin-left: 15upx;
	}
	.abouttime ,.user-abouttime{
		font-size: 22upx;
		color: #989898;
	}
	.comment-list-hover{
		background: #EEEEEE!important;
	}
	.cancel-hover{
		background: #c8c8c8!important;
	}
	.uni-comment-list{
		padding-left: 20upx;
		box-sizing: border-box;
	}
	.uni-comment-content{
		margin-right: 20upx;
	}
</style>