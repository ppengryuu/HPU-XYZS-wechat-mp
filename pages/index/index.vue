<template>
	<view class="body">
		<navigation-custom :config="barConfig()?barConfig():config" :scrollTop="scrollTop1" @buttonTap="navBarTap" :scrollMaxHeight="scrollMaxHeight" style="position: fixed;z-index: 9999999;"/>
		<!-- <view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view> -->
		
		<view :class="schoolNameClassFlag?'schoolNameStart':'schoolNameEnd'"><text :style="{color:indexfontcolor}">河南理工大学</text></view>
		<view class="topNav" @tap="changebg">
			<view class="top-background">
				<image :style="{opacity:imgloaded?1:0}" :src="indexbackground" mode="aspectFill" @error="cusbgerror" @load="bgload()"></image>
				<view class="toolstitle oftitle">
					<view class="toolstitletop">
						<image src="../../static/icons/jinri.png" mode="scaleToFill"></image>
						<text>今天</text>
					</view>
				</view> 
			</view>
		</view>


		<view class="kcbbg" :style="{height:timetableH}">
			<view class="u-f weekinfo">
				<view class="week">星期{{day=='none'?'':week[day]}} / 第{{schoolww?schoolww:""}}周</view>
			</view>

			<view class="kcb">
				<view class="nextcoursetitle">{{timetabletitle}}</view>
				
				<view class="nextcourse" v-if="switchAllandNext">
					<view v-if="!ischoolbind || !islogin" class="courseinfo nextnocourse u-f-ajc">{{islogin?ischoolbind?"":"请先绑定教务":"请先登录"}}</view>
					<view v-else class="courseinfo nextnocourse u-f-ajc">loading ...</view>
				</view>
				
				<view class="course" v-if="!switchAllandNext">
					<view class="courseinfo todaynocourse u-f-ajc" v-if="courseList.length==0">今天没有课哦~<view class="u-f-ajc" style="font-size: 24upx;line-height: 24upx;">&emsp;≥ω≤</view></view>
					<view v-else v-for="(item,index) in courseList" :key="index">
						<view class="courseinfo u-f" @tap="showCourseDetail(item)">
							<view class="courseseq">
								<view>{{item.section}}</view>
								<view style="border-right: 2rpx solid #404040;height: 36rpx;width: 50%;"></view> 
								<view>{{item.section+item.length-1}}</view>
							</view>
							<view class="u-f-column" style="width: 85%;">
								<view class="coursename">{{item.course}}</view>
								<view class="coursetime">
									{{courseOnTime[item.section-1]}}-{{courseOverTime[item.section+item.length-2]}}
								</view>
								<view class="courseloc">
									{{item.loc?item.loc:"未填写"}}
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
				<view class="courseId">节次：{{courseSections()}}</view>
				<view class="couresTeacher">老师：{{detailContent.teacher?detailContent.teacher:"未填写"}}</view>
				<view class="courseLoc">地点：{{detailContent.loc?detailContent.loc:"未填写"}}</view>
				<view class="courseActive">周次：{{detailContent.active?detailContent.active:"未填写"}}</view>
				<view class="closeButton u-f-ajc" hover-class="button-hover" hover-stay-time="100" @tap="closePop"><view class="icon iconfont icon-guanbi"></view></view>
			</view>
		</view>
		
		
		<view class="toolstitle oftitle" style="position: unset!important;">
			<view class="toolstitletop">
				<image src="../../static/icons/weather.png" mode="scaleToFill"></image>
				<text>天气</text>
			</view>
		</view>
		<view style="width: 100%;height: 300rpx;color: #909090;" class="u-f-ajc" v-if="!weatherData">天气信息加载中</view>
		<view class="weather-part" v-else>
			<view class="wp-top">
				<view class="u-f-ac u-f-jsb">
					<view class="acc-loc">{{isSchoolWea?'河南理工大学':' '}}</view>
					<!-- <view class="switch-loc iconfont">&#xe8bc;我的位置</view> -->
				</view>
				<view class="u-f-ac u-f-jsb">
					<view>{{weatherData.location.name}}</view>
					<view>{{weatherData.now.uptime.slice(8,10)+':'+weatherData.now.uptime.slice(10,12)+' 更新'}}</view>
				</view>
			</view>
			<view class="wp-mid">
				<view class="now-weather u-f-ac">
					<view class="weather-img">
						<!-- <image-cache :imgSrc="'https://hpubox.oss-cn-shanghai.aliyuncs.com/appsource/Static/weather/icons/256/zh_CN/'+weatherEn[weatherImgUrl()]+'.png'" mode="widthFix" setStyle="width: 50%;height: auto;" class="u-f-ajc"></image-cache> -->
						<view class="u-f-ajc" style="width: 100%;height: auto;">
							<image :src="'../../static/weather/'+weatherEn[weatherImgUrl()]+'.png'" mode="widthFix" style="width: 50%;height: auto;"></image>
						</view>
						
						<view class="u-f-ajc">
							<view class="weather-name" style="word-break: break-all;">{{weatherData.now.text+' '+weatherData.now.temp+'℃'}}</view>
						</view>
					</view>
					<view class="now-weather-info">
						<view class="weather-feels-like" v-if="weatherData.now.pm25">PM2.5：{{weatherData.now.pm25}}</view>
						<view class="weather-rh">相对湿度：{{weatherData.now.rh+'%'}}</view>
						<view class="weather-rh">体感温度：{{weatherData.now.feels_like+'℃'}}</view>
						<view class="weather-wind">风力：{{weatherData.now.wind_dir+' '+weatherData.now.wind_class}}</view>
					</view>
				</view>
			</view>
			<view class="wp-middescribe u-f-ac" v-if="weatherData.now.describes">
				<block v-for="(d,m) in weatherData.now.describes" :key="m">
					<view class="desc-item-box" hover-class="d-hover" hover-stay-time="100" @tap="showDesc(m)">
						<view :class="'icon iconfont '+descIcons[m]"></view>
						<view>{{d.tipt}}</view>
						<view>{{d.zs}}</view>
					</view>
				</block>
			</view>
			<view class="wp-bot">
				<block v-for="(item,index) in weatherData.forecasts" :key="index">
					<view class="u-f-ac wea-list">
						<view class="f-weather-date">{{index==0?"今天":item.week}}</view>
						<view class="f-weather-name">{{item.text_day==item.text_night?item.text_day:item.text_day+'转'+item.text_night}}</view>
						<view class="f-weather-temp">{{item.low+'~'+item.high+'℃'}}</view>
					</view>
				</block>
			</view>
		</view>
		
		<view style="height: 100rpx;"></view>
		
		<view class="detailMask" v-if="showWeatherDetail" @tap="closeWeatherPop" @touchmove.prevent>
			<view class="detailPop animated zoomIn faster200" @tap.stop style="top:40%!important">
				<view class="detailTitle u-f-ajc">{{detailWeather.title}}</view>
				<view>{{detailWeather.des}}</view>
				<view class="closeButton u-f-ajc" hover-class="button-hover" hover-stay-time="100" @tap="closeWeatherPop"><view class="icon iconfont icon-guanbi"></view></view>
			</view>
		</view>
		<!-- <view class="icon iconfont icon-caidan"></view> -->
		<!-- <image src="" mode=""></image> -->
		<view style="opacity: 0;position: fixed;bottom: 0;">{{scrollTop+scrollTop1}}</view>
	</view>
</template>



<script>
	// import navigationCustom from "../../components/struggler-navigationCustom/navigation-custom.vue";
	// import imageCache from "../../components/image-cache/image-cache.vue";
	import DateUtil from '../../common/dateutil.js';
	import t from '../../common/time.js';
	export default {
		components: {
			// imageCache,
			// navigationCustom
		},
		data() {
			return {
				islogin:false,
				ischoolbind:false,
				day:'none',
				indexbackground:'../../static/school/index_title_img.png',
				indexfontcolor:'white',
				imgloaded:false,
				schoolww:Number,
				schoolwwAdjust:Number,
				showDetail:false,
				showWeatherDetail:false,
				detailContent:{},
				detailWeather:{},
				isSchoolWea:true,
				schoolNameClassFlag:true,
				schoolNameClass:"schoolName",
				switchAllandNext:true, // true 下节课，false 今天的课
				timetableH: "140px",
				timetabletitle: "",
				week:['日','一','二','三','四','五','六'],
				courseOnTime:[],
				courseOverTime:[],
				courseList: [],
				// newsList: [{
				// 	date: "building",
				// 	title: "建设中..."
				// }],
				descIcons:['icon-chuanyi','icon-ganmaozhishu','icon-yundong','icon-jiadian_ziwaixian'],
				weatherData:'',
				weatherEn:Object,
				// 导航栏配置
				config:{
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
				scrollTop1:0,
				scrollMaxHeight:200 ,//滑动的高度限制，超过这个高度即背景全部显示
			}
		},
		watch:{
			scrollTop(){
				this.scrollTop1 = this.scrollTop>0?this.scrollTop:0
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
			},
			weatherImgUrl(){
				return function(){
					if(this.weatherData){
						var c = this.weatherData.now.text
						console.log(c.split('转').length>1?c.split('转')[1]:c)
						return c.split('转').length>1?c.split('转')[1]:c
					}
				}
			},
			courseSections(){
				return function(){
					// console.log("调用了")
					var data = this.detailContent
					var arr = []
					for(var i=parseInt(data.section);i<parseInt(data.section)+parseInt(data.length);i++){
						arr.push(i)
					}
					// console.log(arr.toString())
					return arr.toString()
				}
			}
		},
		onBackPress(e) {
			if(this.showDetail){
				this.showDetail=false
				return true
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			console.log(this.scrollTop1)
			if(e.scrollTop>0){
				this.schoolNameClassFlag=false
			} else {
				this.schoolNameClassFlag=true
			}
		},
		onPullDownRefresh() {
			// console.log(this.User.schoolbind)
			this.closePop()
			this.closeWeatherPop()
			this.getWeather()
			this.updatepage()
			uni.stopPullDownRefresh()
		},
		onShow() {
			this.updatepage(true)
		},
		onHide() {
			this.closePop()
			this.closeWeatherPop()
		},
		onReady() {
			
		},
		onLoad() {
			this._initIndex()
			this.weatherEn = this.publicM.weatherEnName
			// console.log(uni.upx2px(330)+"px")
			uni.$on('schoolbinddone',this.updatepage)
			uni.$on('logindone',this.updatepage)
			uni.$on('logoutdone',this.updatepage)
			uni.$on('updateTimetable',this.updatepage)
			uni.$on('newMessage',this.updateUnread)
			let timer = setInterval(()=>{this.updatepage(true);console.log("refersh page")},10000)
		},
		methods: {
			closeWeatherPop(){
				this.showWeatherDetail = false
			},
			showDesc(m){
				this.detailWeather = this.weatherData.now.describes[m]
				this.showWeatherDetail = true
			},
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
				var bgpath = uni.getStorageSync('indexbgpath')
				if(bgpath){
					this.indexbackground = bgpath
				} else {
					this.indexbackground = '../../static/school/index_title_img.png'
				}
				var indexfontcolor = uni.getStorageSync('indexfontcolor')
				if(indexfontcolor){
					this.indexfontcolor = indexfontcolor
				} else {
					this.indexfontcolor = 'white'
				}
				this.updatepage()
				this.getWeather()
			},
			async getWeather(){
				
				let [err,res] = await this.$http.get('/app/weather');
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				
				let t = res.data.data.result
				this.weatherData = t
				console.log(JSON.stringify(t))
				
			},
			updatepage(checkday){
				if(!checkday){checkday = false}
				console.log("index->updatepage->"+checkday)
				// this.ischoolbind = true 
				
				let date = new Date()
				if(this.day == date.getDay() && checkday) return;
				this.day = date.getDay()
				console.log(this.day)
				
				// 如果是重新登录，就要更新状态和数据
				this.ischoolbind = this.User.schoolbind
				this.islogin = this.User.token
				console.log(this.ischoolbind)
				this.courseOnTime = uni.getStorageSync('courseOnTime')
				this.courseOverTime = uni.getStorageSync('courseOverTime')
				this.schoolwwAdjust = uni.getStorageSync('schoolwwAdjust')
				
				this.schoolww = DateUtil.dateutil.getWeekNumber(date.getFullYear(),date.getMonth()+1,date.getDate()) - this.schoolwwAdjust
				this.switchAllandNext = true
				this.timetableH = uni.upx2px(330)+"px"
				this.getdaytimetable()
			},
			showCourseDetail(item){
				this.showDetail=true
				console.log(item)
				this.detailContent = item
			},
			closePop(){
				this.showDetail=false
				this.detailContent={}
			},
			getdaytimetable(){
				
				this.ischoolbind = this.User.schoolbind
				// console.log(this.ischoolbind) 
				this.todayhavecourse=false
				this.todaycoursenum = 0
				if(!this.ischoolbind){
					this.courseList = false;
					return this.kcbmodeact()
				}
				let date = new Date()
				// console.log(date.getDay())
				var timetableList = uni.getStorageSync('timetable') 
				// console.log(JSON.stringify(timetableList))
				let data = []
				var regnum = /[0-9]+/g;
				for(var i=0;i<timetableList.length;i++){
					var item = timetableList[i]
					if(item.week == (date.getDay()==0?"7":date.getDay().toString()) && item.active&&item.active.match(regnum).indexOf(this.schoolww.toString())>=0){
						item.week = parseInt(item.week)
						item.section = parseInt(item.section)
						item.length = parseInt(item.length)
						// data.push(item)
						if(data.length==0 || item.section>=data[data.length-1].section && item.id!=data[data.length-1].id){
							data.push(item)
						} else {
							console.log(item)
							console.log(data.length)
							var len = data.length
							for(var j=0;j<len;j++){
								if(item.section>=data[j].section && item.id!=data[j].id){
									console.log(item.section,j,data[j].section)
									data.splice(j+1,0,item)
								}
							}
						}
					}
				}
				console.log(JSON.stringify(data))
				this.courseList = data
				setTimeout(() => {
				  this.kcbmodeact()
				}, 200);
				return true;
			},
			
			kcbmodeact(){
				if(this.courseList) {
					this.switchAllandNext=false
				}
				// console.log(this.courseList)
				this.timetabletitle=this.courseList.length>0?"今天有"+(this.courseList.length)+"门课":"今天没有课"
				if(this.courseList.length>0){
					this.timetableH = uni.upx2px(330) + (this.courseList.length-1) * uni.upx2px(200) +"px"
				}else{
					this.timetableH = uni.upx2px(330)+"px"
				}
			},
			async changebg(){
				// console.log('dianle')
				uni.showActionSheet({
					itemList:['自定义背景','默认背景','文字颜色：黑','文字颜色：白'],
					success: (res) => {
						if(res.tapIndex==0){
							this.chooseimg()
						} else if(res.tapIndex==1){
							var sto = uni.getStorageSync("indexbgpath")
							if(sto){
								uni.removeStorage({
									key:'indexbgpath'
								})
								this.imgloaded = false
								uni.showLoading({
									title:"加载中"
								})
								this.indexbackground = '../../static/school/index_title_img.png'
								uni.removeSavedFile({
									filePath: sto
								})
							}
						} else if(res.tapIndex==2){
							this.indexfontcolor = 'black'
							uni.setStorageSync('indexfontcolor','black')
						} else if(res.tapIndex==3){
							this.indexfontcolor = 'white'
							uni.setStorageSync('indexfontcolor','white')
						} 
					}
				})
			},
			async chooseimg(){
				uni.chooseImage({
					count:1,
					sizeType:['compressed'],
					sourceType:['album'],
					success: (res) => {
						// console.log(res)
						var stimg = res.tempFilePaths[0]
						
						// console.log(stimg)
						// const fs = wx.getFileSystemManager()
						// fs.readFile({
						// 	filePath: stimg,
						// 	encoding:"base64",
						// 	complete:(res)=>{
						// 		console.log(res)
						// 	}
						// })
						
						uni.getFileInfo({
							filePath:stimg,
							success: (r) => {
								if(r.size>2097152){
									return uni.showToast({
										title:"文件大小超出限制",
										icon:"none"
									})
								}
						
								uni.removeSavedFile({
									filePath:this.indexbackground
								})
								
								uni.saveFile({
									tempFilePath: stimg,
									success: (res1) => {
										uni.setStorageSync('indexbgpath',res1.savedFilePath)
										this.imgloaded = false
										uni.showLoading({
											title:"加载中"
										})
										this.indexbackground = uni.getStorageSync('indexbgpath')
									},
									fail: (e) => {
										console.log(e)
										uni.showToast({
											title:"选取图片失败("+e.errMsg+")",
											icon:"none"
										})
									}
								})
							}
						})
						
						
					},
					fail: (err) => {
						// console.log(err)
					}
				});
				
			},
			bgload(){
				this.imgloaded = true
				uni.hideLoading()
			},
			cusbgerror(){
				uni.showToast({title:"自定义背景图片可能已被移动或删除",icon:"none"})
				uni.removeStorageSync('indexbgpath')
				this.indexbackground = '../../static/school/index_title_img.png'
			},
		}
	}
</script>

<style>
	.acc-loc{
		font-size: 35upx;
	}
	.switch-loc{
		font-size: 24upx!important;
		color: #00AAFF;
	}
	.d-hover{
		background: #EEEEEE!important;
	}
	.wp-middescribe{
		background: #FFFFFF;
		border-bottom: 1px solid #EEEEEE;
		margin: 0 30rpx;
	}
	.desc-item-box>view:first-child{
		font-size: 35upx!important;
		line-height: 2!important;
	}
	.desc-item-box>view:nth-child(2), .desc-item-box>view:nth-child(3){
		font-size: 24upx!important;
	}
	.desc-item-box>view{
		text-align: center;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.desc-item-box{
		border-left: 1px solid #EEEEEE;
		width: 25%;
	}
	.wp-middescribe>view:last-child{
		border-right: 1px solid #EEEEEE;
	}
	.wea-list{
		background: #FFFFFF;
		border: 1px solid #EEEEEE;
		border-top: none!important;
		box-sizing: border-box;
	},
	.wea-list>view{
		width: calc(100%/3);
		text-align: center;
		padding: 13rpx 0;
		box-sizing: border-box;
	}
	.wp-bot>view:last-child{
		border-radius: 0 0 8rpx 8rpx;
		margin-bottom: 100rpx;
	}
	.wp-bot{
		margin: 0 30rpx;
	}
	.weather-img >image{
		
	}
	.weather-img{
		width: 55%;
	}
	.now-weather{
		margin: 0 30rpx;
		padding: 20rpx;
		border: 1px solid #EEEEEE;
		background: #FFFFFF;
		box-sizing: border-box;
		border-radius: 8rpx 8rpx 0 0;
	}
	.now-weather-info{
		width: 40%;
	}
	.now-weather-info>view{
		word-break: break-all;
	}
	.weather-part{
		
	}
	.wp-top{
		margin: 10rpx 40rpx;
	}
	
	.red-dot{
		position: absolute;
		top: 12upx;
		right: 55upx;
		border-radius: 50%;
		height: 20upx;
		width: 20upx;
		background: red;
	}
	.oftitle{
		width: 100%;
		box-sizing: border-box;
		position: absolute;
		bottom: 0;
	}
	.top-background{
		width: 100%;
		height: 500upx;
		position: relative;
		z-index: -1;
	}
	.top-background>image{
		width: 100%;
		height: 500upx;
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
	.nextnocourse,.todaynocourse{
		width: 100%;
		height: 100%;
		color: #9E9E9E;
	}
	.schoolNameStart{
		position: absolute;
		font-size: 45upx;
		opacity: 1;
		top: 140upx;
		left: 40upx;
		transition: linear 0.2s; 
	}
	.schoolNameEnd{
		position: absolute;
		font-size: 43upx;
		opacity: 0;
		top: 140upx;
		left: 40upx;
		transition: linear 0.2s; 
	}
	.navfloor{
		
	}
	.ggtitle {
		font-size: 32upx;
		color: #101010;
	}
	.ggdate {
		color: #808080;
	}

	.gonggaozone {
		border-top: 1upx solid #cccccc;
	}

	.gonggaoitem {
		/* background: #007AFF; */
		padding: 20upx 30upx;
		border-bottom: 1upx solid #cccccc;
	}
	.toolstitle {
		background: linear-gradient(rgba(243,246,248, 0), rgba(243,246,248, 1));
		color: #101010;
		padding: 30upx 0 0 3%;
		height: 115upx;
	}

	.toolstitletop {
		font-size: 45upx;
		display: flex;
		align-items: center;
		color: #282828;
	}
	
	.toolstitletop >text {
		margin-left: 20upx;
		/* line-height: 1; */
	}

	.toolstitle>image {
		position: absolute;
		z-index: -1;
		width: 100%;
		height: auto;
		top: -1120upx;
		margin-left: -3%; /* toolstitle中有padding-left:3% */
	}

	.toolstitletop image {
		width: 60upx;
		height: 60upx;
	}

	.bodypart2 {
		/* height: 1500upx; */
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
	
	.courseinfo {
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
	.nextcourse {
		display: flex;
		flex-direction: column;
	}

	.iconfont {
		font-size: 15px;
	}

	.kcb {
		margin: 30upx 20upx;
		/* background: #0093DC; */
	}

	.kcbmiddlepart {
		height: 45upx;
		padding-bottom: 22upx;
	}
	
	.nextcoursetitle {
		height: 45upx;
		margin: -20rpx 0 20rpx 20rpx;
		font-size: 35upx;
	}

	.allcourse {
		margin-top: -30upx;
		margin-right: 0;
		font-size: 50upx;
	}

	.kcbbg {
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
