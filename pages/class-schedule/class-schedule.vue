<template>
	<view>
		<!-- <web-view src="http://preview.binlive.cn/Timetables/example.html"></web-view> -->
		
		
		<navigation-custom :config="barConfig()" @buttonTap="buttonTap"/>

		<view class="timetable-bg">
			<image v-if="timetablebg" :style="{height:screenHeight+'px','opacity':imgloaded?1:0}" :src="timetablebg" mode="aspectFill" @load="bgload()" @error="bgloaderror()"></image>
		</view>
		
		<view id="coursesTable" :style="{opacity:onReady?1:0}">
			<view id="courseWrapper">
				<view class="Courses-head u-f-ac">
				    <view :class="day==1?'highlight-week':''">一</view>
				    <view :class="day==2?'highlight-week':''">二</view>
				    <view :class="day==3?'highlight-week':''">三</view>
				    <view :class="day==4?'highlight-week':''">四</view>
				    <view :class="day==5?'highlight-week':''">五</view>
				    <view :class="day==6?'highlight-week':''">六</view>
				    <view :class="day==0?'highlight-week':''">日</view>
				</view>
				
				<view class="Courses-leftHand">
				    <view class="left-hand-TextDom" :style="{height:courseheadheight+'px'}"></view>
				    <view class="left-hand" v-for="(item,index) in lefttime" :key="index">
				        <view style="margin: 0px;" class="left-hand-index">{{index+1}}</view>
				        <view style="margin: 0px;" class="left-hand-name">{{item}}</view>
				    </view>
				    
				</view>
				
				<view class="Courses-content" :style="{height:10*upx2px105+'px'}">
					<!-- <view class="u-f-column course-lines-body">
						<view class="course-lines" v-for="(c,ci) in cols" :key="ci"></view>
					</view> -->
					<view v-for="(col,m) in cols" :key="m" class="u-f" style="width: 100%;">
						<view v-for="(row,n) in rows" :key="n" style="width: 14.2857%;">
							<view class="course-box" :style="{'z-index':100-m}">
								<block v-for="(item,index) in courseslist" :key="index">
									<view class="course-style" v-if="item.row==row&&item.col==col" @tap="showCourseDetail(item.data)">
										<view class="course-content" :style="{height:item.length*(upx2px105)-rpx2px(8)+'px',background:item.color?Palette[col+row+customTheme]:'#b6b6b6'}">
											<view>{{item.data[item.frontIndex].course}}</view>
											<view>@{{item.data[item.frontIndex].loc?item.data[item.frontIndex].loc:"未填写"}}</view>
										</view>
									<view v-if="item.row==row&&item.col==col&&item.data.length>1" class="morecDot"></view>
									</view>
									
								</block>
							</view>
						</view>
					</view>
				</view>
				
			</view>
		</view>
		<view class="detailMask" v-if="showDetail" @tap="closePop" @touch.prevent>
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
		<view class="weekchengeMask u-f-ajc" v-if="chengeweek" @touch.prevent @tap.stop></view>
		
		<active-week-picker themeColor="#00A0F0" ref="AWPicker" :schoolww="schoolww" :pickerValueDefault="schoolww" @onConfirm="onConfirm"></active-week-picker>
		
	</view>
</template>

<script>
	import Time from '../../common/time.js';
	import DateUtil from '../../common/dateutil.js';
	import ActiveWeekPicker from '../../components/active-week-picker/active-week-picker.vue';
	export default {
		components:{
			ActiveWeekPicker
		},
		data() {
			return {
				day:Number,
				schoolww:-1,
				allcourse:{},
				schoolwwAdjust:Number,
				courseslist:[],
				used_rows:[],
				used_cols:[],
				rows:[1,2,3,4,5,6,7],
				cols:[1,2,3,4,5,6,7,8,9,10],
				Palette:[
					"#f05261", "#f3db49", "#76bfcd", "#b495e1", "#ff9800", "#8bc34a","#48a8e4", 
					"#ffd061", "#52db9a", "#70d3e6", "#52db9a", "#f3d147", "#4adbc3", "#f05261",
					"#f3db49", "#76bfcd", "#b495e1", "#ff9800", "#8bc34a","#48a8e4", "#ffd061", 
					"#52db9a", "#70d3e6", "#52db9a", "#f3d147", "#4adbc3","#f05261", "#f3db49", 
					"#76bfcd", "#b495e1", "#ff9800", "#8bc34a","#48a8e4", "#ffd061", "#52db9a", 
					"#70d3e6", "#52db9a", "#f3d147", "#4adbc3", "#f05261","#f3db49", "#76bfcd", 
					"#b495e1", "#ff9800", "#8bc34a","#48a8e4", "#ffd061", "#52db9a", "#70d3e6", 
					"#52db9a", "#f3d147", "#4adbc3","#f05261", "#f3db49", "#76bfcd", "#b495e1", 
					"#ff9800", "#8bc34a","#48a8e4", "#ffd061", "#52db9a", "#70d3e6", "#52db9a", 
					"#f3d147", "#4adbc3", "#f05261","#f3db49", "#76bfcd", "#b495e1", "#ff9800", 
					"#8bc34a","#48a8e4", "#ffd061", "#52db9a", "#70d3e6", "#52db9a", "#f3d147", 
					"#4adbc3","#f05261", "#f3db49", "#76bfcd", "#b495e1", "#ff9800", "#8bc34a",
				],
				lefttime:[],
				PaleIndex:0,
				customTheme:0,
				showDetail:false,
				chengeweek:false,
				detailContent:{},
				upx2px105:50,
				courseheadheight:Number,
				onReady:false,
				screenHeight:0,
				timetablebg:'',
				imgloaded:false,
			}
		},
		computed:{
			rpx2px(e){
				return function(e){
					return uni.upx2px(e);
				}
			},
			barConfig(){ 
				return function(){
					var s = this.schoolww<0?" ":this.schoolww
					return {
						title:"课程表-第" + s + "周", //title
						bgcolor:"#f8f8f8", //背景颜色
						fontcolor:'#0c0c0c',
						type:1, //type 1，3胶囊 2，4无胶囊模式
						buttons:[
							{
								iconfont:"icon-caidan"
							}
						] 
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
		onHide() {
			this.closePop()
		},
		onShow() {
			this.checkAuth()
		},
		watch:{
			schoolww(){
				this.weekchenge()
				this.chengeweek=true
				setTimeout(()=>{
					this.chengeweek=false
				},1)
			}
		},
		onBackPress(e) {
			if(this.showDetail){
				this.showDetail=false
				return true
			}
		},
		onLoad() {
			
			uni.showLoading({title:"加载中"})
			this.lefttime = uni.getStorageSync('courseOnTime')
			this.schoolwwAdjust = uni.getStorageSync('schoolwwAdjust')
			this.screenHeight = uni.getSystemInfoSync().windowHeight
			this.timetablebg = uni.getStorageSync('timetablebg')
			this.customTheme = uni.getStorageSync('customTheme')
			this.upx2px105=uni.upx2px(105)
			this.courseheadheight=uni.upx2px(56)
			let date = new Date()
			this.day = date.getDay()
			this.schoolww = DateUtil.dateutil.getWeekNumber(date.getFullYear(),date.getMonth()+1,date.getDate()) - this.schoolwwAdjust
			// this.gettimetable()
			uni.$on('schoolbinddone',this.gettimetable)
			uni.$on('updateTimetable', this.gettimetable)
			uni.$on('logindone', this.gettimetable)
			uni.$on('logoutdone', this.gettimetable)
			
			// if(!this.User.token){
			// 	return uni.navigateTo({
			// 		url:'../user-login/user-login'
			// 	})
			// }
			// if(!this.User.schoolbind){
			// 	return uni.navigateTo({
			// 		url:'../bangding/jiaowu/jiaowu'
			// 	})
			// }
		},
		onReady() {
			uni.createSelectorQuery().select(".Courses-head").boundingClientRect(data => {
				this.courseheadheight=data.height?data.height:uni.upx2px(56)
				this.onReady=true
				uni.hideLoading()
			}).exec();
			uni.hideLoading()
		},
		methods: {
			onConfirm(e){
				// console.log(JSON.stringify(e))
				this.schoolww = e.value.index+1
			},
			bgloaderror(){
				uni.showToast({
					title:"自定义背景图片可能已被移动或删除",
					icon:"none"
				})
				uni.removeStorageSync('timetablebg')
				this.timetablebg = ''
			},
			bgload(){
				this.imgloaded = true
				uni.hideLoading()
			},
			chengebg(){
				uni.chooseImage({
					count:1,
					sourceType:['album'],
					sizeType:['compressed'],
					success: (res) => {
						var stimg = res.tempFilePaths[0]
						
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
									filePath:this.timetablebg
								})
								
								uni.saveFile({
									tempFilePath: stimg,
									success: (res1) => {
										uni.setStorageSync('timetablebg',res1.savedFilePath)
										this.imgloaded = false
										uni.showLoading({
											title:"加载中"
										})
										this.timetablebg = uni.getStorageSync('timetablebg')
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

						
					}
				})
			},
			weekchenge(){
				this.gettimetable()
			},
			closePop(){
				this.showDetail=false
				this.detailContent={}
			},
			showCourseDetail(data){
				console.log(JSON.stringify(data))
				if(data.length == 1){
					this.detailContent = data[0]
					this.showDetail = true
				} else {
					var cArr = []
					for(var i=0;i<data.length;i++){
						cArr.push(data[i].course)
					}
					uni.showActionSheet({
						itemList:cArr,
						success: (res) => {
							this.detailContent = data[res.tapIndex]
							this.showDetail = true
						}
					})
				}
				
			},
			checkAuth(){
				if(!this.User.token){
					return uni.showModal({
						title:"提示",
						content:"请先登录",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url: "../user-login/user-login"
								})
							}
						}
					})
				}
				if(!this.User.schoolbind){
					return uni.showModal({
						title:"提示",
						content:"请先绑定教务",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url: "../bangding/jiaowu/jiaowu"
								})
							}
						}
					})
				}
				return this.User.token&&this.User.schoolbind
			},
			async gettimetable(){
				console.log("getTimeTable")
				// let [err,res] = await this.$http.get('/user/gettimetable',data,{
				// 	token:true,
				// 	checkToken:true
				// });
				// console.log(res)
				// var data = res.data.data
				var data = uni.getStorageSync("timetable")
				if(!data){
					return this.courseslist = []
				}
				// console.log(JSON.stringify(this.courseslist))
				// console.log(data)
				var regBetweenSpace = /.+?\s/g;
				var regnum = /[0-9]+/g;
				var allc = []
				var used_set = []
				var counter = 0
				// allc 第一次处理结果
				data.forEach((item,index)=>{
					let acbox = {}
					let w = parseInt(item.week)
					let s = parseInt(item.section)
					let l = parseInt(item.length)
					let color
					if(item.active&&item.active.match(regnum).indexOf(this.schoolww.toString())>=0){
						color = true
					} else {
						color = false
					}
					for(var i=s;i<s+l;i++){
						let obj = allc.find((value)=>{
							return value.row === w && value.col === i
						})
						if(!obj){
							acbox.row = w
							acbox.col = i
							acbox.frontIndex = 0
							acbox.length = 1
							acbox.color = color
							acbox.ids = item.id.toString()
							acbox.data = []
							acbox.data.push(item)
							allc.push(acbox)
							acbox = {}
						} else {
							obj.ids = obj.ids+item.id.toString()
							if(!obj.color){
								obj.frontIndex++
							}
							obj.color = obj.color||color
							obj.data.push(item)
						}
					}
				})
				// console.log(allc)
				let result = []
				for (var q=0;q<allc.length;q++) {
					let data = this.getCourseLen(allc,q)
					if(data){
						result.push(data)
					}
				}
				// console.log(JSON.stringify(result))
				this.courseslist = result
				// console.log(allc)
			},
			getCourseLen(allc,index){
				if(index>0 && allc[index-1].ids == allc[index].ids){
					allc[index-1].length++
					this.getCourseLen(allc, index-1)
				} else {
					return allc[index]
				}
			},
			buttonTap(e){
				console.log(e)
				console.log(this.timetablebg)
				if(e.index==0){
					if(!this.checkAuth()) return;
					 
					var optList = ['切换当前周','编辑课程表','修改主题色','重新导入课程表','课程表背景'];
					if(this.timetablebg.length>0){
						optList.push('删除自定义背景')
					}
					console.log(optList)
					uni.showActionSheet({
						itemList: optList,
						success: (res) => {
							switch(res.tapIndex){
								// case 0:
								// let date = new Date()
								// this.day = date.getDay()
								// this.schoolww = DateUtil.dateutil.getWeekNumber(date.getFullYear(),date.getMonth()+1,date.getDate()) - this.schoolwwAdjust
								// break;
								case 0:
								this.$refs.AWPicker.show()
								break;
								case 1:
								uni.navigateTo({
									url:'edit-courses/edit-courses'
								});
								break;
								case 2:
								if(this.customTheme > 6){
									this.customTheme = 0
									uni.setStorageSync('customTheme',0)
								} else {
									this.customTheme++
									uni.setStorageSync('customTheme',this.customTheme)
								}
								console.log(this.customTheme)
								break;
								case 3:
								uni.showModal({
									title:'提示',
									content:'重新导入课程表会清空当前课表',
									success: (res) => {
										if(res.confirm){
											uni.navigateTo({
												url:'../bangding/jiaowu/jiaowu?type=1'
											})
										}
									}
								})
								break;
								case 4:
								this.chengebg()
								break;
								case 5:
								uni.removeSavedFile({
									filePath:this.timetablebg
								})
								uni.removeStorageSync('timetablebg')
								this.timetablebg = ''
								break;
							}
						}
					})
				
				}
			}
		}
	}
</script>

<style>
	page{
		background: rgb(243,246,248);
	}
	.timetable-bg>image{
		
		width: 100%;
	}
	.timetable-bg{
		position: fixed;
		z-index: -10000;
		width: 100%;
	}
	.button-hover{
		background: #0093dc!important;
	}
	.morecDot{
		position: absolute;
		top: 1upx;
		right: 0upx;
		border-radius: 50%;
		height: 20upx;
		width: 20upx;
		background: red;
	}
	.detailTitle{
		color: #2a2a2a;
		font-size: 40upx;
		padding: 20upx 0;
	}
	.courseActive,.courseId,.courseLoc,.couresTeacher,.courseName{
		color: #2a2a2a;
		width: 100%;
		font-size: 26upx;
		padding: 6upx 0;
		border-bottom: 1upx solid #909090;
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
	.weekchengeMask{
		background: rgba(0,0,0,0)!important;
	}
	.detailMask,.weekchengeMask{
		top:0;
		right:0;
		bottom:0;
		left:0;
		position: fixed;
		z-index: 2000;
		background: rgba(0,0,0,0.1);
	}
	.left-hand{
		/* border-left: 2upx solid rgb(219, 219, 219);
		border-bottom: 3upx solid rgb(219, 219, 219); */
		width: 100%; 
		height: 105upx; 
		box-sizing: border-box;
	}
	.course-content > view{
		color: #ffffff;
		font-size: 24upx;
		line-height: 34upx;
		word-break: break-all;
	}
	.course-content{
		box-sizing: border-box;
		/* margin: 3upx; */
		width: 96%;
		margin-left: 2%;
		border-radius: 8rpx;
		padding: 3rpx;
	}
	.course-style{
		overflow: hidden;
		box-sizing: border-box;
		padding-top: 4rpx;
	}
	.course-box{
		position: relative;
		width: 100%;
		box-sizing: border-box;
		border-bottom: 3upx dashed rgb(219, 219, 219);
		/* border: 1px solid #00A075; */
		height: 105upx;
	}
	
	#coursesTable {
		padding: 25upx 20upx;
	}
	
	.course-lines{
		width: 100%;
		height: 105upx;
		box-sizing: border-box;
		border-bottom: 3upx dashed rgb(219, 219, 219);
	}
	.course-lines-body>view:last-child{
		border-bottom: none!important;
	}
	.course-lines-body{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: absolute;
		z-index: -9999;
	}
	
	.Courses-content{
		/* background-color: #00A075; */
		/* height: 10upx; */
		width: 100%;
		position: relative;
	}
	.Courses-content>view:last-child>view>view{
		border-bottom: none!important;
	}
	#courseWrapper{
		position: relative; 
		padding-left: 85upx; 
		border: 3upx solid rgb(219, 219, 219);
	}
	.Courses-head {
		background-color: #edffff;
		overflow: hidden;
	}

	.Courses-head > view {
		float: left; 
		box-sizing: border-box; 
		white-space: nowrap; 
		/* width: 14.2857%; */
		flex: 1;
		text-align: center;
		font-size: 28upx;
		line-height: 56upx;
		height: 56upx;
	}
	.left-hand-TextDom{
		/* transition: linear 3s; */
		box-sizing: border-box;
	}
	.left-hand-TextDom, .Courses-head {
		background-color: rgba(250, 254, 255, 0.8);
	}

	.Courses-leftHand {
		background-color: rgba(250, 254, 255, 0.8);
		font-size: 24upx;
		position: absolute; 
		left: 0; 
		top: 0; 
		width: 85upx;
	}

	.Courses-leftHand .left-hand-index {
		color: #9c9c9c;
		font-size: 28upx;
		line-height: 40upx;
		/* margin-bottom: 4px !important; */
	}

	.Courses-leftHand .left-hand-name {
		color: #666;
	}

	.Courses-leftHand>view>view {
		text-align: center;
		font-weight: 400;
	}

	.Courses-head > view {
		border-left: none !important;
	}

	.Courses-leftHand > view {
		padding-top: 10upx;
		border-bottom: 3upx dashed rgb(219, 219, 219);
	}

	.Courses-leftHand > view:last-child {
		border-bottom: none !important;
	}

	.left-hand-TextDom, .Courses-head {
		border-bottom: 3upx solid rgba(0, 0, 0, 0.1) !important;
	}

	.highlight-week {
		color: #02a9f5!important;
	}

</style>
