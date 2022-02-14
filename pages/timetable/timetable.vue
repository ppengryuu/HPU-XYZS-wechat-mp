<template>
	<view>
		<!-- <web-view src="http://preview.binlive.cn/Timetables/example.html"></web-view> -->
		<navigation-custom :config="barConfig()" @buttonTap="buttonTap" @navHeight="getnavH" />

		<view class="timetable-bg">
			<image v-if="timetablebg" :style="{height:screenHeight+'px','opacity':imgloaded?1:0}" :src="timetablebg" mode="aspectFill"
			 @load="bgload()" @error="bgloaderror()"></image>
		</view>

		<view :style="{
			'height':contentHeight+'px',
			'width':screenWidth+'px',
			'opacity':onReady?1:0
		}">

			<view :style="{
				'height':0.08*contentHeight+'px',
				'width':'100%',
				'background':'rgba(250, 254, 255, 0.8)'
			}"
			 class="u-f-ac">
				<view class="u-f-ajc" :style="{
					'width':0.09*screenWidth+'px',
					'height':'100%',
					'color':'#282828'
				}"></view>
				<view class="u-f-ac">
					<view class="u-f-ajc" :style="{
						'width':0.13*screenWidth+'px',
						'height':'100%',
						'color':'#282828'
					}"
					 v-for="(item,m) in ['一','二','三','四','五','六','日']" :key="m">
						<view class="u-f-ajc">
							<view :style="{
								'color':weekdayDateArr[m].isToday?'#02a9f5':'#666'
							}">
								<view class="u-f-ajc" style="font-size: 25rpx;">
									周{{item}}
								</view>
								<view class="u-f-ajc" style="font-size: 22rpx;">
									{{weekdayDateArr[m].text}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<swiper :indicator-dots="false" :autoplay="false" :duration="200" :style="{
				'height':0.92*contentHeight+'px',
				'width':'100%' 
			}"
			 :current="ttIndex" @animationfinish="currentchange">
				<block v-for="(sww,o) in schoolwwArr" :key="o">
					<swiper-item>

						<timetable v-if="sww&&showTimetable" :schoolww="sww" :coursesObject="coursesObject" :courseslist="courseslist"
						 :contentWidth="screenWidth" :contentHeight="contentHeight" :lefttime="lefttime" :customTheme="customTheme"
						 @tapCourse="showCourseDetail" @created="timetableCreated" @timetableReady="test"></timetable>
						<view v-else class="u-f-ajc" :style="{
							'height':contentHeight+'px',
							'width':contentWidth+'px'
						}">
							<view class="u-f-ajc" style="width: 140rpx;height: 100rpx;border-radius: 10rpx;background-color: #FFFFFF;">
								<view class="refreshAnim icon iconfont icon-ziyuan" style="color: #00AAFF;font-size: 50rpx;">
								</view>
							</view>
						</view>
					</swiper-item>
				</block>

			</swiper>


		</view>

		<view class="detailMask" v-if="showDetail" @tap="closePop" @touch.prevent>
			<view class="detailPop animated zoomIn faster200" @tap.stop>
				<view class="detailTitle u-f-ajc">课程详情</view>
				<view class="courseName">课程：{{detailContent.course?detailContent.course:"未填写"}}</view>
				<view class="courseId">节次：{{detailContent.sections}}</view>
				<view class="couresTeacher">老师：{{detailContent.teacher?detailContent.teacher:"未填写"}}</view>
				<view class="courseLoc">地点：{{detailContent.loc?detailContent.loc:"未填写"}}</view>
				<view class="courseActive">周次：{{detailContent.active?detailContent.active:"未填写"}}</view>
				<view class="closeButton u-f-ajc" hover-class="button-hover" hover-stay-time="100" @tap="closePop">
					<view class="icon iconfont icon-guanbi"></view>
				</view>
			</view>
		</view>

		<active-week-picker themeColor="#00A0F0" ref="AWPicker" :schoolww="schoolww" :pickerValueDefault="schoolww"
		 @onConfirm="onConfirm"></active-week-picker>



	</view>
</template>

<script>
	var easydate = require("../../common/easydate.js")
	import Time from '../../common/time.js';
	import DateUtil from '../../common/dateutil.js';
	import ActiveWeekPicker from '../../components/active-week-picker/active-week-picker.vue';
	import Timetable from '../../components/timetable/timetable.vue';
	export default {
		components: {
			ActiveWeekPicker,
			Timetable
		},
		data() {
			return {
				day: Number,
				schoolww: 1,
				schoolwwAdjust: Number,
				courseslist: [],
				coursesObject: {},
				lefttime: [],
				customTheme: 0,
				showDetail: false,
				detailContent: {},
				onReady: false,
				timetablebg: '',
				imgloaded: false,

				schoolwwArr: Array,
				screenHeight: Number,
				screenWidth: Number,
				contentHeight: Number,
				showTimetable: true,
				ttIndex: Number,
				edited: false,
				coursesChooseArr: Array,

				weekdayDateArr: [],
				trueSchoolww: 1


			}
		},
		computed: {
			isBoxColor(item) {
				return function(item) {
					// console.log(item) 
				}
			},
			dump(e) {
				return function(e) {
					console.log(e)
				}
			},
			rpx2px(e) {
				return function(e) {
					return uni.upx2px(e);
				}
			},
			barConfig() {
				return function() {
					var s = this.schoolww <= 0 ? false : this.schoolww
					return {
						title: "课程表" + (s ? "-第" + s + "周" : ""), //title
						bgcolor: "#f8f8f8", //背景颜色
						fontcolor: '#0c0c0c',
						type: 1, //type 1，3胶囊 2，4无胶囊模式
						buttons: this.schoolww == this.trueSchoolww ? [{
							iconfont: "icon-caidan"
						}] : [{
							iconfont: "icon-caidan"
						}, {
							text: "本周",
							width: "50px"
						}]
					}
				}

			},
		},
		onHide() {
			this.edited = false
			// this.onReady = false
			this.closePop()
		},
		onShow() {
			if (this.edited) {
				this.schoolwwArr = new Array(30).fill(false)
				this.showTimetable = false
				setTimeout(() => {
					this.showTimetable = true
				}, 1)
				this.refreshTimetable()
			}

		},
		watch: {

		},
		onBackPress(e) {
			if (this.showDetail) {
				this.showDetail = false
				return true
			}
		},
		onLoad() {
			this.checkAuth()
			uni.showLoading({
				title: "加载中"
			})

			this.schoolwwArr = new Array(30).fill(false)

			this.__init()

			// this.gettimetable()
			uni.$on('schoolbinddone', this.timetableEdited)
			uni.$on('updateTimetable', this.timetableEdited)
			uni.$on('logindone', this.timetableEdited)
			uni.$on('logoutdone', this.timetableEdited)
			// uni.$on('appshow', this.__init)
			// uni.$on('appshow', this.refreshTimetable)

			// setInterval(this.checkttIndex,100)

		},
		onReady() {
			this.onReady = true
			uni.hideLoading()
		},
		methods: {
			timetableEdited() {
				this.edited = true
			},
			test(e) {
				console.log(e)
			},
			__init() {
				this.lefttime = uni.getStorageSync('courseOnTime')
				this.schoolwwAdjust = uni.getStorageSync('schoolwwAdjust')
				this.timetablebg = uni.getStorageSync('timetablebg')
				this.customTheme = uni.getStorageSync('customTheme')
				let date = new Date()
				this.day = date.getDay()

				this.schoolww = this.publicM.calcSchoolww()
				this.schoolww = this.schoolww ? this.schoolww : 1
				this.trueSchoolww = this.schoolww

				this.ttIndex = this.schoolww - 1

				this.screenWidth = this.publicM.screenWidth
				this.screenHeight = this.publicM.screenHeight

				this.refreshTimetable()
			},
			refreshTimetable() {
				uni.showLoading({
					title: "加载中"
				})
				this.courseslist = this.publicM.formatTimeTable()
				this.coursesObject = this.publicM.coursesObject

				var pay = {
					detail: {
						current: this.schoolww - 1
					}
				}
				this.currentchange(pay)
				// if(this.onReady) { uni.hideLoading() }
			},
			refreshTDArr() {
				var semeInfo = uni.getStorageSync("semester")
				var firstDay = semeInfo.firstDay

				const firstday = easydate(firstDay)
				const caclStart = firstday.clone().calc("day", -1)

				var sww = this.schoolww

				var result = []
				for (var i = 1; i <= 7; i++) {
					var dateItem = caclStart.clone().calc("day", (sww - 1) * 7 + i)
					result.push({
						isToday: !easydate().toDatePart().diff(dateItem, 'day'),
						year: dateItem.getFullYear(),
						text: dateItem.getMonth() + "/" + dateItem.getDate()
					})
				}
				console.log(result)

				this.weekdayDateArr = result

			},
			currentchange(e) {
				console.log(e)
				// uni.vibrateShort()
				this.ttIndex = e.detail.current;
				this.schoolww = this.ttIndex + 1
				var i = this.ttIndex
				if (!this.schoolwwArr[i]) {
					this.schoolwwArr[i] = i + 1
				}
				this.refreshTDArr()
				// if(!this.schoolwwArr[i-1]){
				// 	this.schoolwwArr[i-1] = i
				// }
				// if(!this.schoolwwArr[i+1]&&i+1<39){
				// 	this.schoolwwArr[i+1] = i+2
				// }
			},
			getnavH(e) {
				// console.log(e)
				this.navH = e.height
				this.contentHeight = uni.getSystemInfoSync().windowHeight - e.height
			},
			onConfirm(e) {
				// console.log((e))
				uni.showLoading({
					title: "加载中"
				})
				this.schoolww = e.value.index + 1
				this.refreshTimetable()
				// console.log(this.schoolww)
				uni.hideLoading()
			},
			bgloaderror() {
				uni.showToast({
					title: "自定义背景图片可能已被移动或删除",
					icon: "none"
				})
				uni.removeStorageSync('timetablebg')
				this.timetablebg = ''
			},
			bgload() {
				this.imgloaded = true
				uni.hideLoading()
			},
			chengebg() {
				uni.chooseImage({
					count: 1,
					sourceType: ['album'],
					sizeType: ['compressed'],
					success: (res) => {
						var stimg = res.tempFilePaths[0]

						uni.getFileInfo({
							filePath: stimg,
							success: (r) => {
								if (r.size > 2097152) {
									return uni.showToast({
										title: "文件大小超出限制",
										icon: "none"
									})
								}

								uni.removeSavedFile({
									filePath: this.timetablebg
								})

								uni.saveFile({
									tempFilePath: stimg,
									success: (res1) => {
										uni.setStorageSync('timetablebg', res1.savedFilePath)
										this.imgloaded = false
										uni.showLoading({
											title: "加载中"
										})
										this.timetablebg = uni.getStorageSync('timetablebg')
									},
									fail: (e) => {
										console.log(e)
										uni.showToast({
											title: "选取图片失败(" + e.errMsg + ")",
											icon: "none"
										})
									}
								})
							}
						})


					}
				})
			},
			weekchenge() {
				// this.gettimetable()
			},
			closePop() {
				this.showDetail = false
				this.detailContent = {}
			},
			timetableCreated() {
				// for (var i=1;i<=40;i++) {
				// 	this.schoolwwArr[i-1] = i
				// }
			},
			showCourseDetail(data) {
				data = JSON.parse(JSON.stringify(data))
				console.log(JSON.stringify(data))

				if (data.length == 1) {
					this.detailContent = this.coursesObject[data[0]]
					this.showDetail = true
				} else {
					var cArr = []
					for (var i = 0; i < data.length; i++) {
						cArr.push(this.coursesObject[data[i]].course)
					}
					var more6 = false
					var moreCourses = []
					if (cArr.length > 6) {
						more6 = true
						cArr.splice(5)
						cArr.push("更多课程...")
						moreCourses = data.splice(5)
					}
					// this.coursesChooseArr = cArr
					uni.showActionSheet({
						itemList: cArr,
						success: (res) => {
							if (more6 && res.tapIndex == 5) {
								this.showCourseDetail(moreCourses)
							} else {
								this.detailContent = this.coursesObject[data[res.tapIndex]]
								this.showDetail = true
							}
						}
					})
				}

			},
			checkAuth() {
				if (!this.User.token) {
					return uni.showModal({
						title: "提示",
						content: "请先登录",
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: "../user-login/user-login"
								})
							}
						}
					})
				}
				if (!this.User.schoolbind) {
					return uni.showModal({
						title: "提示",
						content: "请先绑定教务",
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: "../bangding/jiaowu/jiaowu"
								})
							}
						}
					})
				}
				return this.User.token && this.User.schoolbind
			},
			buttonTap(e) {
				console.log(e)
				console.log(this.timetablebg)
				if (e.index == 0) {
					if (!this.checkAuth()) return;

					var optList = ['切换当前周', '编辑课程表', '修改主题色', '重新导入课程表', '课程表背景'];
					if (this.timetablebg.length > 0) {
						optList.push('删除自定义背景')
					}
					console.log(optList)
					uni.showActionSheet({
						itemList: optList,
						success: (res) => {
							switch (res.tapIndex) {
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
										url: 'edit-courses/edit-courses'
									});
									break;
								case 2:
									if (this.customTheme > 6) {
										this.customTheme = 0
										uni.setStorageSync('customTheme', 0)
									} else {
										this.customTheme++
										uni.setStorageSync('customTheme', this.customTheme)
									}
									console.log(this.customTheme)
									break;
								case 3:
									uni.showModal({
										title: '提示',
										content: '重新导入课程表会清空当前课表',
										success: (res) => {
											if (res.confirm) {
												uni.navigateTo({
													url: '../bangding/jiaowu/jiaowu?type=1'
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
										filePath: this.timetablebg
									})
									uni.removeStorageSync('timetablebg')
									this.timetablebg = ''
									break;
							}
						}
					})

				} else if (e.index == 1) {
					var o = {
						value: {
							index: this.trueSchoolww - 1
						}
					}
					this.onConfirm(o)
				}
			}
		}
	}
</script>

<style>
	page {
		background: rgb(243, 246, 248);
	}

	.containText {
		color: #606266;
	}

	.timetable-bg>image {

		width: 100%;
	}

	.timetable-bg {
		position: fixed;
		z-index: -10000;
		width: 100%;
	}

	.button-hover {
		background: #0093dc !important;
	}

	.morecDot {
		position: absolute;
		top: 1upx;
		right: 0upx;
		border-radius: 50%;
		height: 20upx;
		width: 20upx;
		background: red;
	}

	.detailTitle {
		color: #2a2a2a;
		font-size: 40upx;
		padding: 20upx 0;
	}

	.courseActive,
	.courseId,
	.courseLoc,
	.couresTeacher,
	.courseName {
		color: #2a2a2a;
		width: 100%;
		font-size: 26upx;
		padding: 6upx 0;
		border-bottom: 1upx solid #909090;
	}

	.closeButton {
		position: absolute;
		border-radius: 0 8upx 0 0;
		width: 60upx;
		height: 60upx;
		color: #FFFFFF;
		background: #00AAFF;
		right: 0;
		top: 0;
	}

	.detailPop>view {
		word-break: break-all;
	}

	.detailPop {
		background: #FFFFFF;
		right: 10%;
		left: 10%;
		top: 30%;
		border-radius: 8upx;
		padding: 0 50upx 50upx 50upx;
		position: fixed;
		z-index: 2001;
	}

	.detailMask {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: fixed;
		z-index: 2000;
		background: rgba(0, 0, 0, 0.1);
	}

	.highlight-week {
		color: #02a9f5 !important;
	}

	.refreshAnim {
		animation: refresh 1.2s infinite linear;
	}

	@keyframes refresh {
		from {
			transform: rotateZ(0deg);
		}

		to {
			transform: rotateZ(360deg);
		}
	}
</style>
