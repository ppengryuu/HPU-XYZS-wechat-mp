<template>
	<view class="body">
		<navigation-custom :config="config" @buttonTap="buttonTap"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<template v-if="firstload">
			<view class="u-f-ajc" style="height: 100upx;width: 100%;color: #909090;">loading...</view>
		</template>
		<template v-else>
			<view v-for="(item,index) in newslist" :key="index">
				<index-list-dongtai :item="item" :index="index" :preable="true" :updateUserpic="updateuserpic"></index-list-dongtai>
			</view>
			<mix-load-more :status="loadMoreStatus"></mix-load-more>
		</template>
		
		<view class="refbuttom" :style="{transform:rftapanimation}" @touchstart="rfbamp" @touchend="rfbshr" @tap="refreshPage"><view :class="refreshing?'refreshAnim icon iconfont icon-ziyuan':'icon iconfont icon-ziyuan'"></view></view>
		
		<navigator url="../fabudongtai/fabudongtai" class="fabubuttom" :style="{transform:fbtapanimation}" @touchstart="fbbamp" @touchend="fbbshr"><view class="icon iconfont icon-zengjia1"></view></navigator>
		
	</view>
</template>

<script>
	import indexListDongtai from '../../components/index/index-list-dongtai.vue';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	import time from '../../common/time.js';
	export default {
		components:{
			indexListDongtai,
			mixLoadMore,
		},
		data() {
			return {
				page:1,
				updateuserpic:true,
				firstload:true,
				loadMoreStatus:0,
				fbtapanimation: "scale(1)",
				rftapanimation: "scale(1)",
				enableScroll: true,
				screenHeight:Number,
				swiperheight:Number,
				userpic:'',
				newslist:[],
				refreshing:false,
				config:{
					title:"白墙", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-sousuo1",
							width:"60px",
							text:"搜索"
						},{
							iconfont:"icon-wode"
						}
					]
				}

			}
		},
		onShow() {
			var haveUnread
			uni.getStorage({
				key:'havaUnread',
				success: (res) => {
					haveUnread = res.data
				}
			})
			if(haveUnread){
				this.setStyle(0,true);
			} else {
				this.setStyle(0,false)
			}
		},
		onLoad() {
			// 开启监听
			uni.$on('logindone',this.updataPage)
			uni.$on('logoutdone',this.updataPage)
			uni.$on('updateData',this.updateData)
			uni.$on('userinfoChanged',this.updateUserinfo)
			uni.$on('userpicChange',this.updateUserpic)
			uni.$on('newMessage',this.updateUnread)
			this.getnewslist()
		},
		onReachBottom() {
			this.loadmore()
		},
		onReady() {
			// console.log(this.newslist.length)
			
		},
		methods:{
			updataPage(){
				this.page = 1
				this.getnewslist()
			},
			async refreshPage(showToast){
				console.log('刷新')
				this.refreshing = true
				this.page=1
				let res = await this.getnewslist()
				if(res){
					uni.showToast({
						title:"刷新成功",
						icon:"none"
					})
				} else {
					uni.showToast({
						title:"加载失败",
						icon:"none"
					})
				}
				this.refreshing = false
			},
			buttonTap(e){
				if(e.index == -1){
					this.publicM.back1()
				} else if(e.index==0){
					uni.navigateTo({
						url:"../search-user-post/search-user-post"
					})
				} else if(e.index==1){
					if(!this.User.token){
						return uni.navigateTo({
							url:"../user-login/user-login"
						})
					}
					uni.navigateTo({
						url:"../user-space/user-space"
					})
				}
			},
			updateUnread(){
				var haveUnread = uni.getStorageSync('haveUnread')
				if(haveUnread){
					this.setStyle(0,true);
				}
			},
			async getnewslist(){
				console.log(this.User.userinfo)
				let [err,res] = await this.$http.get('/postclass/1/post/' + this.page,{
					userid:this.User.userinfo?this.User.userinfo.id:0
				});
				// 请求失败处理
				// console.log(res)
				if (!this.$http.errorCheck(err,res)) return false;
				let arr = [];
				let list = res.data.data.list;
				for (let i = 0; i < list.length; i++) {
					arr.push(this.__format(list[i]));
				}
				// console.log(JSON.stringify(arr))
				this.newslist = this.page > 1 ? this.newslist.concat(arr) : arr;
				this.firstload = true;
				if (list.length < 10) {
					this.loadMoreStatus=2
				}else{
					this.loadMoreStatus=0
				}
				this.firstload=false;
				return true
			},
			//上拉加载
			loadmore(index){
				//修改状态
				if(this.loadMoreStatus === 2){
					return;
				}
				this.loadMoreStatus = 1;
				//获取数据
				this.page++
				this.getnewslist()
				//this.loadmoretext="没有了~"
			},
			rfbamp(){
				this.rftapanimation="scale(1.1)"
			},
			rfbshr(){
				this.rftapanimation="scale(1)"
			},
			fbbamp(){
				this.fbtapanimation="scale(1.1)"
			},
			fbbshr(){
				this.fbtapanimation="scale(1)"
			},
			updateUserinfo(data){
				this.newslist.forEach((item,index)=>{
					if (item.userid === this.User.userinfo.id) {
						item.username=data.data.name;
					}
				})
			},
			updateUserpic(data){
				this.userpic = data.newpic
				this.newslist.forEach((item,index)=>{
					if (item.userid === this.User.userinfo.id) {
						item.userpic=data.newpic;
					}
				})
			},
			updateData(data){
				switch (data.type){
					case "guanzhu":
					this.updateGuanZhu(data);
						break;
					case "support":
					this.updateSupport(data);
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
			//删除评论
			updateCommentNum(data){
				// 拿到当前对象
				let obj = this.newslist.find(value =>{
					return value.id === data.post_id;
				});
				if (!obj) return;
				obj.commentnum = data.data // 更新
			},
			// 更新关注信息
			updateGuanZhu(data){
				this.newslist.forEach((item,index)=>{
					if (item.userid === data.userid) {
						item.isguanzhu = data.data;
					}
				})
			},
			// 更新顶踩数据状态
			updateSupport(data){
				// 拿到当前对象
				console.log(data)
				let obj = this.newslist.find(value =>{
					return value.id === data.post_id;
				});
				console.log(obj)
				if (!obj) return;
				let oldindex = obj.infonum.index; // 操作前的状态
				console.log(oldindex)
				if(oldindex==2||oldindex==-1){
					obj.infonum.index = 0
					obj.infonum.dingnum++
				}else if(oldindex==0){
					obj.infonum.index = 2
					obj.infonum.dingnum--
				}
			},
			deletePost(data){
				// 拿到当前对象
				let index = this.newslist.findIndex(value =>{
					return value.id === data.post_id;
				});
				this.newslist.splice(index,1);
				if(this.newslist.length<10){
					this.page = 1
					this.getnewslist()
				}
				// obj.commentnum++; // 评论数+1
			},
			// 更新用户发布信息
			updateList(data){
				// 第一种，直接追加
				
				// this.newslist.push(this.__format(data.data));
				// 第二种，重新加载当前post_class_id信息
				this.page=1
				this.getnewslist()
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

<style>
	.refreshAnim{
		animation: refresh 0.8s infinite linear;
	}
	.refbuttom{
		bottom: 180upx!important;
	}
	.fabubuttom, .refbuttom{
		display: flex;
		width: 100upx;
		height: 100upx;
		background: linear-gradient(#0bacf0,#04a1c8);
		position: fixed;
		justify-content: center;
		align-items: center;
		bottom: 50upx;
		right: 50upx;
		border-radius: 50%;
		transition: ease 0.2s;
	}
	.fabubuttom>view{
		color: white;
		font-size: 55upx;
	}
	.refbuttom>view{
		color: white;
		font-size: 50upx;
	}
	
	@keyframes refresh{
		from{
			transform: rotateZ(0deg);
		}
		to{
			transform: rotateZ(360deg);
		}
	}
</style>
