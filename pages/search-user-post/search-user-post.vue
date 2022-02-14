<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>
		
		<template v-if="firstload">
			
			<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
			<uni-search-bar radius="5" placeholder="搜索动态 | 用户" clearButton="auto" cancelButton="none" v-model="searchtext" bodyBgColor="rgb(243,246,248)" @confirm="search" />
			<view v-if="firstload" class="u-f-ajc" style="height: 100upx;width: 100%;color: #909090;">输入关键词，按回车键搜索</view>
		</template>
		<template v-else>
			
			<view class="top-swiper-head">
				<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap"></swiper-tab-head>
			</view>
			<view class="tsheight"></view>
			<view class="uni-tab-bar">
				<swiper 
				:style="{'height': swiperheight + 'px'}"
				style="background: rgb(243,246,248);"
				:current="tabIndex"
				:duration="200"
				@change="currentchange"
				>
					<swiper-item>
						<scroll-view scroll-y class="list" @scrolltolower="postloadmore()">
							<block v-for="(item,n) in postlist" :key="n">
								<index-list-dongtai :item="item" :index="n" :preable="true"></index-list-dongtai>
							</block>
							<mix-load-more :status="postlistloadMoreStatus"></mix-load-more>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view scroll-y class="list" @scrolltolower="userloadmore()">
							<block v-for="(item,m) in userlist" :key="m">
								<user-list :item="item" :index="m" hidden></user-list>
							</block>
							<mix-load-more :status="userlistloadMoreStatus"></mix-load-more>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</template>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
	import indexListDongtai from '../../components/index/index-list-dongtai.vue';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	import SwiperTabHead from '../../components/index/swiper-tab-head.vue';
	import userList from "../../components/user-list/user-list.vue";
	import time from "../../common/time.js";
	export default {
		components:{
			uniSearchBar,
			indexListDongtai,
			mixLoadMore,
			SwiperTabHead,
			userList
		},
		data() {
			return {
				screenWidth:Number,
				swiperheight:Number,
				screenHeight:Number,
				userlist:[],
				postlist:[],
				searchtext:'',
				userlistpage:1,
				postlistpage:1,
				userlistloadMoreStatus:0,
				postlistloadMoreStatus:0,
				firstload:true,
				tabIndex: 0,
				tabBars: [{
						name: "动态",
						id: "post"
					},
					{
						name: "用户",
						id: "user"
					}
				],
				config:{
					title:"搜索", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							text:"返回"
						}
					]
				},

			}
		},
		onLoad() {
			uni.$on('updateData',this.updateData)
			uni.getSystemInfo({
				success: (res) => {
					this.screenWidth =res.screenWidth
					this.swiperheight = this.screenHeight =res.screenHeight-uni.getSystemInfoSync().statusBarHeight-44-uni.upx2px(100)
				}
			})
		},
		onNavigationBarSearchInputChanged(e) {
			// console.log(e)
			this.searchtext = e.text
		},
		async onNavigationBarSearchInputConfirmed() {
			// console.log('搜索')
			uni.hideKeyboard()
			uni.showLoading({title:"搜索中..."});
			await this.getdata('user')
			await this.getdata('post')
			this.firstload = false
			uni.hideLoading();
			// console.log(JSON.stringify( this.userlist))
			// console.log( JSON.stringify(this.postlist))
		},
		methods: {
			buttonTap(e){
				if(e.index == 0){
					if(this.firstload){
						this.publicM.back1()
					} else {
						this.firstload = true
						this.searchtext = {}
					}
				}
			},
			async search(){
				// console.log(this.searchtext)
				// console.log('搜索')
				if(!this.searchtext.value) return uni.showToast({title:"搜索内容不能为空",icon:"none"})
				uni.hideKeyboard()
				uni.showLoading({title:"搜索中..."});
				await this.getdata('user')
				await this.getdata('post')
				this.firstload = false
				uni.hideLoading();
				// console.log(JSON.stringify( this.userlist))
				// console.log( JSON.stringify(this.postlist))
			},
			tabtap(e){
				this.tabIndex=e
			},
			currentchange(e){
				this.tabIndex=e.detail.current;
			},
			userloadmore(){
				//修改状态
				if(this.userlistloadMoreStatus === 2){
					return;
				}
				this.userlistloadMoreStatus = 1;
				//获取数据
				this.userlistpage++
				this.getdata('user')
				//this.loadmoretext="没有了~"
			},
			postloadmore(){
				//修改状态
				if(this.postlistloadMoreStatus === 2){
					return;
				}
				this.postlistloadMoreStatus = 1;
				//获取数据
				this.postlistpage++
				this.getdata('post')
				//this.loadmoretext="没有了~"
			},
			async getdata(searchType){
				// console.log(searchType,this.postlistpage,this.userlistpage)
				if(!searchType&&this.postlistpage&&this.userlistpage) return;
				console.log('提交：'+ JSON.stringify( this.searchtext))
				let url = '/search/'+searchType;
				let [err,res] =await this.$http.post(url,{
					keyword:this.searchtext.value,
					page:searchType=='user'?this.userlistpage:searchType=='post'?this.postlistpage:''
				},{token:true});
				console.log(res)
				let error = this.$http.errorCheck(err,res,()=>{
					uni.hideLoading();
				},()=>{
					uni.hideLoading();
				});
				if (!error) return;
				let arr = [];
				let list = res.data.data.list;
				// console.log(res)
				for (let i = 0; i < list.length; i++) {
					arr.push(this.__format(list[i],searchType));
				}
				if(searchType=='user'){
					this.userlist = this.userlistpage > 1 ? this.userlist.concat(arr) : arr;
					list.length < 10?this.userlistloadMoreStatus=2:this.userlistloadMoreStatus=0
				} else if(searchType=='post'){
					this.postlist = this.postlistpage > 1 ? this.postlist.concat(arr) : arr;
					list.length < 10?this.postlistloadMoreStatus=2:this.postlistloadMoreStatus=0
				}
			},
			// 格式转化
			__format(item,searchType){
				switch (searchType){
					case "post":
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
						break;
					case "topic":
					return {
						id:item.id,
						titlepic:item.titlepic,
						title:item.title,
						desc:item.desc,
						totalnum:item.post_count,
						todaynum:item.todaypost_count,
					}
						break;
					case "user":
					return {
						id:item.id,
						userpic:item.userpic,
						username:item.username,
						age:item.userinfo.age,
						sex:item.userinfo.sex,
						isguanzhu:false
					}
						break;
				}
				
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
				let obj = this.postlist.find(value =>{
					return value.id === data.post_id;
				});
				if (!obj) return;
				obj.commentnum = data.data // 更新
			},
			// 更新关注信息
			updateGuanZhu(data){
				this.postlist.forEach((item,index)=>{
					if (item.userid === data.userid) {
						item.isguanzhu = data.data;
					}
				})
			},
			// 更新顶踩数据状态
			updateSupport(data){
				// 拿到当前对象
				// console.log(data)
				let obj = this.postlist.find(value =>{
					return value.id === data.post_id;
				});
				// console.log(obj)
				if (!obj) return;
				let oldindex = obj.infonum.index; // 操作前的状态
				// console.log(oldindex)
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
				let index = this.postlist.findIndex(value =>{
					return value.id === data.post_id;
				});
				this.postlist.splice(index,1);
				if(this.postlist.length<10){
					this.page = 1
					this.getdata()
				}
				// obj.commentnum++; // 评论数+1
			},
			// 更新用户发布信息
			updateList(data){
				// 第一种，直接追加
				
				// this.newslist.push(this.__format(data.data));
				// 第二种，重新加载当前post_class_id信息
				this.postlistpage=1
				this.getdata()
			},
		}
	}
</script>

<style>
	.top-swiper-head{
		padding: 20upx 0 0 0;
		height: 100upx;
		box-sizing: border-box;
		border-bottom: 3upx solid #EEEEEE;
		position: fixed;
		width: 100%;
		z-index: 999;
		background: rgb(248,248,248);
	}
	.tsheight{
		height: 100upx;
	}
</style>
