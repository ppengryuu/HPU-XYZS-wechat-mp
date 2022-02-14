<template>
	<view class="body">
		<navigation-custom :config="config" @buttonTap="buttonTap"/>

		<view class="ta-item">
			<view class="left-title">课程名称</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="课程名称" show-confirm-bar="false" v-model="coursename" cursor-spacing="" placeholder-class="phclass"/>
			</view>
			<view><view class="icon iconfont icon-bianji"></view></view>
		</view>
		<view class="edit-tip"><view>* 最长100个字符</view><view> {{coursename.length+'/100'}}</view></view>
		<view class="ta-item">
			<view class="left-title">老师</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="老师" show-confirm-bar="false" v-model="teacher" cursor-spacing="" placeholder-class="phclass"/>
			</view>
			<view><view class="icon iconfont icon-bianji"></view></view>
		</view>
		<view class="edit-tip"><view>* 最长100个字符</view><view> {{teacher.length+'/100'}}</view></view>
		<view class="ta-item">
			<view class="left-title">地点</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="地点" show-confirm-bar="false" v-model="cloc" cursor-spacing="" placeholder-class="phclass"/>
			</view>
			<view><view class="icon iconfont icon-bianji"></view></view>
		</view>
		<view class="edit-tip"><view>* 最长100个字符</view><view> {{cloc.length+'/100'}}</view></view>
		<view class="ta-item">
			<view class="left-title">上课时间</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="上课时间" show-confirm-bar="false" v-model="course_time" cursor-spacing="0" placeholder-class="phclass" disabled="disabled" @tap="choosect"/>
			</view>
			<view @tap="choosect"><view class="icon iconfont icon-bianji"></view></view>
		</view>
		<view class="edit-tip"></view>
		<view class="ta-item">
			<view class="left-title">周次</view>
			<view class="midta" @tap="chooseActiveWeek">
				<view class="active-weeks u-f-ac"> 
					{{active}}
				</view>
				
			</view>
			<view @tap="chooseActiveWeek"><view class="icon iconfont icon-bianji"></view></view>
		</view>
		<view class="edit-tip"></view>
		
		<jsfun-picker
				ref="courseActionWeekPicker"
		        :listArr = "List()"
				:defaultArr="active"
		        type="multiple" 
		        @click="getChange" 
		        >
		</jsfun-picker>
		<course-time-picker themeColor="#00A0F0" ref="courseTimePicker" :pickerValueDefault="courseTimePickerValueDefault" @onChange="pickerChange" @onConfirm="onConfirm"></course-time-picker>
		
		
		
	</view>
	
</template>

<script>
	import jsfunPicker from '@/components/jsfun-picker/jsfun-picker.vue'
	import courseTimePicker from '../../../../components/course-time-picker/course-time-picker.vue'
	export default {
		components:{
			jsfunPicker,
			courseTimePicker
		},
		data() {
			return {
				coursename:'',
				teacher:'',
				cloc:'',
				course_time:'',
				active:'',
				week:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
				edited:{},
				type:'',
				config:{
					title:"课程详情", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							width:"60px",
							iconfont:"icon-fanhui",
							text:"返回"
						},{
							text:"提交"
						}
					]
				}
				

			}
		},
		watch:{
			coursename(){
				this.edited.course = this.coursename
			},
			teacher(){
				this.edited.teacher = this.teacher
			},
			cloc(){
				this.edited.loc = this.cloc
			}
		},
		computed:{
			List(){
				return function(){
					var Arr = []
					for(var i=1;i<=30;i++){
						Arr.push(i.toString())
					}
					return Arr
				}
			}
		},
		onBackPress() {
		  if (this.$refs.courseTimePicker.showPicker) {
		  	this.$refs.courseTimePicker.pickerCancel();
		    return true;
		  }
		  if (this.$refs.courseActionWeekPicker.isShow) {
		  	this.$refs.courseActionWeekPicker.closePicker();
		    return true;
		  }
		},
		onLoad(e) {
			console.log(e)
			this.type = e.type
			if(e.type=='add'){
				return;
			}
			var data = uni.getStorageSync('courseDetail')
			uni.removeStorageSync('courseDetail')
			this.edited = data
			this.coursename = data.course?data.course:""
			this.teacher = data.teacher?data.teacher:""
			this.cloc = data.loc?data.loc:""
			this.active = data.active?data.active:""
			var startsec = data.sections.split(',')[0]?data.sections.split(',')[0]:"1"
			var endsec = data.sections.split(',')[1]?data.sections.split(',')[1]:"1"
			this.course_time = this.week[parseInt(data.weekday?data.weekday:"1")-1]+' 第'+startsec+'~'+endsec+'节'
		},
		onUnload() {
			if (this.$refs.courseTimePicker.showPicker) {
				this.$refs.courseTimePicker.pickerCancel()
			}
			if (this.$refs.courseActionWeekPicker.isShow) {
				this.$refs.courseActionWeekPicker.closePicker();
			}
		},
		methods: {
			async submit(){
				this.edited.type = this.type
				if(!this.edited.course){return uni.showToast({title:"课程名不能为空",icon:"none"})}
				if(!this.edited.weekday){return uni.showToast({title:"上课时间不能为空",icon:"none"})}
				if(!this.edited.sections){return uni.showToast({title:"上课时间不能为空",icon:"none"})}
				if(!this.edited.length){return uni.showToast({title:"上课时间不能为空",icon:"none"})}
				uni.showLoading({title:"提交中"})
				console.log('提交数据'+JSON.stringify(this.edited) )
				let [err,res] = await this.$http.post('/user/timetable/edit',this.edited,{
					token:true,
					checkToken:true
				});
				// 请求失败处理
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				this.edited.id = parseInt(res.data.data.id) 
				var list = uni.getStorageSync("timeTable")
				if(this.type == 'edit'){
					// 拿到当前对象
					let index = list.findIndex(value =>{
						return value.id === this.edited.id;
					});
					if(index<0){
						list.push(this.edited)
					} else {
						list.splice(index,1,this.edited)
					}
				}
				if(this.type == 'add'){
					list.push(this.edited)
				}
				uni.setStorageSync("timeTable",list)
				uni.$emit('updateTimetable')
				uni.hideLoading();
				uni.showToast({
					title:"修改成功",
					icon:"none"
				})
			},
			choosect(){
				// 三级联动
				uni.hideKeyboard()
				this.$refs.courseTimePicker.show()
			},
			onConfirm(e){
				console.log(e)
				this.course_time = e.label
				this.edited.weekday = e.value.weekday
				this.edited.length = e.value.length
				
				var startsec = e.value.startSection
				var endsec = e.value.endSection
				var secStr = ""
				for (var i=parseInt(startsec);i<=parseInt(endsec);i++) {
					secStr = secStr+i+","
				}
				this.edited.sections = secStr.slice(0,-1)
				
				console.log(JSON.stringify(this.edited))
			},
			chooseActiveWeek(){
				uni.hideKeyboard()
				this.$refs.courseActionWeekPicker.showPicker()
			},
			getChange(data){
				this.active = data.textStr
				this.edited.active = data.textStr
				var oriStr = new Array(53).fill("0")
				var vwArr = data.textStr.split(",")
				vwArr.forEach(s => {
					oriStr[s] = "1"
				})
				this.edited.vaildWeeks = oriStr.join('')
				console.log(JSON.stringify(this.edited))
			},
			buttonTap(e){
				if(e.index==0){
					this.publicM.back1()
				} else if(e.index == 1){
					this.submit()
				}
			},
			pickerChange(e){
				console.log(e)
			}
		}
	}
</script>

<style>
	.active-weeks{
		border-bottom: 1px solid #dfdfdf;
	}
	.ta-item{
		margin: 36upx 0 20upx 0;
		display: flex;
		align-items: center;
		/* background: #00A075; */
	}
	.left-title{
		font-size: 30upx;
		margin-left: 5%;
		/* background: #0086B3; */
		display: flex;
		line-height: 1;
		align-items: center;
		width: 20%;
	}
	.midta{
		width: 65%;
	}
	.midta>view{
		min-height: 28upx;
		/* background: #00A075; */
		width: 100%;
		word-break: break-all;
		font-size: 28upx; 
	}
	.midta>input{
		width: 100%;
		font-size: 28upx;
		line-height: 1;
		border-bottom: 1px solid #dfdfdf;
	}
	.ta-item>view:nth-child(3){
		color: #9B9B9B;
		width: 5%;
		text-align: center;
	}
	
	.edit-tip{
		display: flex;
		flex-direction: row;
		width: 96%;
		margin-left: 2%;
		justify-content: space-between;
		margin-bottom: 16upx;
	}
	.edit-tip view{
		margin-left: 20upx;
		font-size: 22upx;
		color: #9B9B9B;
	}
	.phclass{
		color: #c8c8c8;
		/* padding: 5upx 0; */
	}
</style>
