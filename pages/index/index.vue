<template>
	<view>
		<navigation-custom :config="barConfig()?barConfig():barConfig1" :scrollTop="scrollTop" @buttonTap="navBarTap" :scrollMaxHeight="scrollMaxHeight" style="position: fixed;z-index: 9999999;"/>

		<index-top-bg :scrollTop="scrollTop"></index-top-bg>

		<view class="courselist-body" :style="{height:courselistHeight}">
			<view class="u-f weekinfo">
				<view class="week">星期{{day===null?"":week[day]}} / {{schoolww?("第"+schoolww+"周"):"假期中"}}</view>
			</view>

			<view class="courselist">
				<view v-if="!islogin" class="courselist-tips">未登录</view>
				<view v-else class="courselist-tips">{{timetabletitle}}</view>
				
				<view class="courseitems">
					<view  v-if="courseitemsLoading" class="course-item empty-courselist u-f-ajc">
						loading ...
					</view>
					
					<view v-else>
						<view v-if="courseList.length==0" class="course-item empty-courselist u-f-ajc">
							<view v-if="(!ischoolbind)||(!islogin)">
								{{islogin?(ischoolbind?"":"请先绑定教务"):"请先登录"}}
							</view>
							<view v-else>今天没有课哦 ~</view>
						</view>
						
						<view v-else v-for="(item,index) in courseList" :key="index">
							<view class="course-item u-f" @tap="showCourseDetail(item)">
								<view class="courseseq">
									<view>{{item.sections[0]}}</view>
									<view style="border-right: 2rpx solid #404040;height: 36rpx;width: 50%;"></view> 
									<view>{{item.sections[1]?item.sections[1]:item.sections[0]}}</view>
								</view>
								<view class="u-f-column" style="width: 85%;">
									<view class="coursename">{{coursesObject[item.id].course}}</view>
									<view class="coursetime">
										{{courseOnTime[item.sections[0]-1]}}-{{courseOverTime[(item.sections[1]?item.sections[1]:item.sections[0])-1]}}
									</view>
									<view class="courseloc">
										{{coursesObject[item.id].loc?coursesObject[item.id].loc:"未填写"}}
									</view>
								</view>
							</view>
						</view>
					</view>
					
				</view>
				
			</view>
		</view>
		
		<view class="detailMask" v-if="showDetail" @tap="closePop" @touchmove.prevent>
			<view class="detailPop animated zoomIn faster200" @tap.stop>
				<view class="detailTitle u-f-ajc">课程详情</view>
				<view class="courseName">课程：{{detailContent.course?detailContent.course:"未填写"}}</view>
				<view class="courseId">节次：{{detailContent.sections}}</view>
				<view class="couresTeacher">老师：{{detailContent.teacher?detailContent.teacher:"未填写"}}</view>
				<view class="courseLoc">地点：{{detailContent.loc?detailContent.loc:"未填写"}}</view>
				<view class="courseActive">周次：{{detailContent.active?detailContent.active:"未填写"}}</view>
				<view class="closeButton u-f-ajc" hover-class="button-hover" hover-stay-time="100" @tap="closePop"><view class="icon iconfont icon-guanbi"></view></view>
			</view>
		</view>
		
		<index-weather ref="indexWeather"></index-weather>
		
		<view style="height: 30rpx;opacity: 0;">{{scrollTop}}</view>
		
		<likeAndShare :pageId='1' placeHolder="130rpx"></likeAndShare>
		
		<view style="height: 30rpx;"></view>
		
	</view>
</template>



<script>
	import indexTopBg from '../../components/index/index-top-bg.vue';
	import indexWeather from '../../components/index/index-weather.vue';
	import likeAndShare from '../../components/like-and-share/like-and-share.vue';
	import DateUtil from '../../common/dateutil.js';
	import t from '../../common/time.js';
	export default {
		components: {
			indexTopBg,
			indexWeather,
			likeAndShare
		},
		data() {
			return {
				day:null,
				islogin:false,
				ischoolbind:false,
				showDetail:false,
				schoolww:Number,
				schoolwwAdjust:Number,
				courseitemsLoading:true, // true 加载中，false 加载完成
				detailContent:{},
				courselistHeight:"",
				timetabletitle: "",
				week:['日','一','二','三','四','五','六'],
				courseOnTime:[],
				courseOverTime:[],
				courseList: [],
				coursesObject:{},
				// 导航栏配置
				barConfig1:{
					title:'河南理工大学', //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					transparent:true, //是否背景透明 默认白色
					linear:true, //是为开启下滑渐变
					buttons:[{
						iconfont: "icon-caidan"
					}] 
				},
				scrollTop:0 ,// 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight:200 ,//滑动的高度限制，超过这个高度即背景全部显示
			}
		},
		computed:{
			barConfig(){
				return function(){
					var islogin = this.User.token
					let obj = {}
					if(islogin){
						obj.iconfont = "icon-caidan"
					} else {
						obj.text = "登录"
					}
					return {
						title:'河南理工大学', //title
						bgcolor:"#f8f8f8", //背景颜色
						fontcolor:'#0c0c0c',
						type:1, //type 1，3胶囊 2，4无胶囊模式
						transparent:true, //是否背景透明 默认白色
						linear:true, //是为开启下滑渐变
						buttons:[obj] 
					}
				}
			}
			
		},
		onShareAppMessage(options) {
			
		},
		onBackPress(e) {
			if(this.showDetail){
				this.showDetail=false
				return true
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop; 
		},
		onPullDownRefresh() {
			this.closePop()
			this.$refs.indexWeather.closeWeatherPop()
			this.$refs.indexWeather.getWeather()
			this.updatepage()
			uni.stopPullDownRefresh()
		},
		onShow() {
			this.updatepage(true)
		},
		onHide() {
			this.closePop()
			this.$refs.indexWeather.closeWeatherPop()
		},
		onReady() {
			
		},
		onLoad() {
			this._initIndex()
			// console.log(uni.upx2px(330)+"px")
			uni.$on('schoolbinddone',this.updatepage)
			uni.$on('logindone',this.updatepage)
			uni.$on('logoutdone',this.updatepage)
			uni.$on('updateTimetable',this.updatepage)
			uni.$on('newMessage',this.updateUnread)
			let timer = setInterval(()=>{
				this.updatepage(true);
				console.log("refersh index-page")
			},10000)
		},
		methods: {
			
			navBarTap(e){
				console.log(e)
				if(e.index==0){
					if(!this.User.token){
						return uni.navigateTo({
							url:"../user-login/user-login"
						})
					}
					uni.navigateTo({
						url:'../settings/settings'
					})
				}
			},
			_initIndex(){
				
				this.updatepage()
			},
			
			updatepage(checkday){
				if(!checkday){checkday = false}
				
				// 刷新主页
				
				this.ischoolbind = this.User.schoolbind
				this.islogin = this.User.token
				
				this.courseOnTime = uni.getStorageSync('courseOnTime')
				this.courseOverTime = uni.getStorageSync('courseOverTime')
				
				this.schoolww = this.publicM.calcSchoolww()
				
				// 检查是否是第二天
				let date = new Date()
				if(this.day == date.getDay() && checkday) return;
				
				this.day = date.getDay()
				console.log("index -> 周"+this.day)
				
				this.courseitemsLoading = true
				this.courselistHeight = uni.upx2px(330)+"px"
				this.getdaytimetable()
			},
			showCourseDetail(item){
				this.showDetail=true
				console.log(item)
				this.detailContent = this.coursesObject[item.id]
			},
			closePop(){
				this.showDetail=false
				this.detailContent={}
			},
			getdaytimetable(){
				if(!this.ischoolbind){
					this.courseList = [];
					this.refreshCourseList()
					return false
				}
				var data = uni.getStorageSync("timeTable")
				if(!data) {
					this.courseList = [];
					this.refreshCourseList()
					return false
				} 
				
				// 将数据改为字典类型，并计算出本周是否有课
				var coursesObject = {}
				data.forEach(element => {
					var id = element.id
					element.color = element.vaildWeeks[this.schoolww]=="1"?true:false,
					coursesObject[id] = element
				});
				
				this.coursesObject = coursesObject
				
				// 将课程拆分为单节
				var courseList = []
				for(var key in coursesObject){
					var sectionArr = coursesObject[key].sections.split(",").map(Number)
					sectionArr.forEach(a => {
						courseList.push({
							weekday:coursesObject[key].weekday,
							section:a,
							color:coursesObject[key].color,
							id:key
						})
					})
				}
					
				// 将本周有课无课归类
				var colorTrueArr = []
				courseList.forEach(b => {
					if(b.color){
						colorTrueArr.push(b)
					}
				}); 
					
				// let taweekday = 2
				let taweekday = new Date().getDay()
				taweekday = taweekday==0?7:taweekday
				var res1 = []
				colorTrueArr.forEach(ta => {
					if(ta.weekday==taweekday){
						res1.push(ta)
					}
				})
				
				var res2 = []
				res1.forEach(e => {
					let f = res2.find(g => {
						return e.weekday==g.weekday&&e.id==g.id&&this.publicM.isContinuationInteger(g.sections.concat([e.section]))
					})
					if(!f){
						res2.push({
							weekday:e.weekday,
							sections:[e.section],
							color:true,
							id:e.id
						})
					} else {
						f.sections.push(e.section)
						f.sections.sort(this.publicM.lsy)
					}
				})
				
				console.log(res2)
				
				this.courseList = res2.sort(this.coursesSort)
				setTimeout(() => {
				  this.refreshCourseList()
				}, 200);
				return true;
			},
			coursesSort(a,b){
				return a.sections[0]-b.sections[0]
			},
			refreshCourseList(){
				// console.log(this.courseList)
				this.timetabletitle=this.courseList.length>0?"今天有"+(this.courseList.length)+"门课":"今天没有课"
				if(this.courseList.length>0){
					this.courselistHeight = uni.upx2px(330) + (this.courseList.length-1) * uni.upx2px(200) +"px"
				}else{
					this.courselistHeight = uni.upx2px(330)+"px"
				}
				this.courseitemsLoading = false
			},
			
			
		}
	}
</script>

<style>
	.partTitle {
		box-sizing: border-box;
		background: linear-gradient(rgba(243,246,248, 0), rgba(243,246,248, 1));
		width: 100%;
		height: 120upx;
		padding-left: 10rpx;
		bottom: -10rpx;
	}
	.partTitle>view>image{
		height: 60rpx;
		width: 60rpx;
	}
	.partTitle>view{
		margin-left: 20upx;
		font-size: 45rpx;
		color: #282828;
	}
	
	
	.button-hover{
		background: #0093dc!important;
	}
	.closeButton{
		position: absolute;
		border-radius: 0 8upx 0 0;
		width: 60upx;
		height: 60upx;
		color: #FFFFFF;
		background: #00AAFF;
		right: 0;
		top: 0;
	}
	.courseActive,.courseId,.courseLoc,.couresTeacher,.courseName{
		color: #2a2a2a;
		width: 100%;
		font-size: 26upx;
		padding: 3px 0;
		border-bottom: 1upx solid #909090;
	}
	.detailTitle{
		color: #2a2a2a;
		font-size: 40upx;
		padding: 20upx 0;
	}
	.detailMask,.updateMask{
		top:0;
		right:0;
		bottom:0;
		left:0;
		position: fixed;
		z-index: 2000;
		background: rgba(0,0,0,0.1);
	}
	.detailPop>view{
		word-break: break-all;
	}
	.detailPop{
		background: #FFFFFF;
		right:10%;
		left:10%;
		top:30%;
		border-radius: 8upx;
		padding: 0 50upx 50upx 50upx;
		position: fixed;
		z-index: 2001;
	}
	.empty-courselist{
		width: 100%;
		height: 100%;
		color: #9E9E9E;
	}

	.courseseq {
		text-align: center;
		position: relative;
		top: -1rpx;
		min-width: 13%;
		height: 100%;
		margin-right: 20upx;
	}
	.courseseq >view{
		font-size: 26upx;
	}
	.courseseq>view>view{
		line-height: 40upx;
	}
	.coursetime {
		position: relative;
		top: -5upx;
		font-size: 24upx;
		/* background: #00B9FF!important; */
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}

	.coursename {
		/* background: #343434; */
		position: relative;
		top: -10upx;
		font-size: 32upx;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}

	.courseloc {
		/* background: #09BB07; */
		padding-bottom: 15upx;
		border-bottom: 1upx solid #EEEEEE;
		position: relative;
		top: -5upx;
		font-size: 23upx;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	
	.course-item {
		/* overflow: hidden; */
		padding: 20upx;
		box-sizing: border-box;
		/* background: rgba(255, 85, 0, 76); */
		border-radius: 8upx;
		height: 180upx;
		width: 100%;
		margin-top: 20upx;
	}

	.course,
	.courseitems {
		display: flex;
		flex-direction: column;
	}

	.iconfont {
		font-size: 15px;
	}

	.courselist {
		margin: 30upx 20upx;
		/* background: #0093DC; */
	}
	
	.courselist-tips {
		height: 45upx;
		margin: -20rpx 0 20rpx 20rpx;
		font-size: 35upx;
	}

	.courselist-body {
		overflow: hidden;
		/* background: #00A075; */
		padding-top: 30upx;
		padding-bottom: 30upx;
		transition: ease 0.3s;
	}

	.weekinfo{
		margin-left: 40rpx;
		margin-bottom: 20rpx;
	}
	.weekinfo>view{
		font-size: 36upx;
	}
	
	page {
		background: rgb(243,246,248);
	} 
	
	
</style>
