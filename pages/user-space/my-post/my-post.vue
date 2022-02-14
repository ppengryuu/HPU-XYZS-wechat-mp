<template>
	<view class="body">
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>

		<template v-if="firstload">
			<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
			<view class="u-f-ajc" style="height: 100upx;width: 100%;color: #909090;">loading...</view>
		</template>
		<template v-else>
			<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
			<view v-for="(item,index) in newslist" :key="index">
				<index-list-dongtai :item="item" :index="index" :fromBUP="true"  :updateUserpic="updateuserpic" :backWhenPostId="fromPost"></index-list-dongtai>
			</view>
			<mix-load-more :status="loadMoreStatus"></mix-load-more>
				
		</template>
		
		
		
	</view>
</template>

<script>
	import indexListDongtai from '../../../components/index/index-list-dongtai.vue';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	import time from '../../../common/time.js';
	export default {
		components:{
			indexListDongtai,
			mixLoadMore,
		},
		data() {
			return {
				page:1,
				fromPost:0,
				firstload:true,
				loadMoreStatus:0,
				updateuserpic:true,
				fbtapanimation: "scale(1)",
				enableScroll: true,
				screenHeight:Number,
				swiperheight:Number,
				userpic:'',
				newslist:[],
				config:{
					title:"我发布的动态", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							text:"返回"
						}
					]
				}

			}
		},
		onLoad() {
			// 开启监听
			uni.$on('updateData',this.updateData)
			uni.$on('userinfoChanged',this.updateUserinfo)
			uni.$on('userpicChange',this.updateUserpic)
			var data = uni.getStorageSync('userDetail')
			console.log(data)
			this.fromPost = data.fromPost
			this.getnewslist()
		},
		async onPullDownRefresh() {
			this.page=1
			await this.getnewslist()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			this.loadmore()
		},
		onReady() {
			// console.log(this.newslist.length)
			
		},
		methods:{
			async getnewslist(){
				let [err,res] = await this.$http.get('/user/post/' + this.page,{},
				{
					token:true,
					checkToken:true,
				});
				// 请求失败处理
				// console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					return uni.showToast({title:res.data.msg,icon:'none'})
				}
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
				return this.firstload=false;
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
			updateUserinfo(data){
				this.newslist.forEach((item,index)=>{
					if (item.userid === this.User.userinfo.id) {
						item.username=data.data.name;
					}
				})
			},
			updateUserpic(data){
				this.updateuserpic=false
				// console.log(data)
				this.userpic = data.newpic
				this.newslist.forEach((item,index)=>{
					if (item.userid === this.User.userinfo.id) {
						item.userpic=data.newpic;
					}
				})
				setTimeout(() => {
					this.updateuserpic=true
				}, 600)
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
				// console.log(data)
				let obj = this.newslist.find(value =>{
					return value.id === data.post_id;
				});
				// console.log(obj)
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
</style>
