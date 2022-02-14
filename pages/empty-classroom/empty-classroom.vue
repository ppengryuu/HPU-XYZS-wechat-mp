<template>
	<view class="content">
		<navigation-custom :config="barConfig" @buttonTap="buttonTap"/>

		<view style="padding-top: 30px;">
			<view class="title">校区</view>
			<view style="width: 80%; margin: auto;margin-bottom: 20px;">
				<xfl-select 
				:list="campus"
				:clearable="false"
				:listShow="false"
				:isCanInput="false"  
				:style_Container="listBoxStyle"
				:initValue="'南校区'"
				:selectHideType="'hideAll'"
				@change="campusChange"
				>
				</xfl-select>
			</view>
			<view class="title">教学楼</view>
			<view style="width: 80%; margin: auto;margin-bottom: 20px;">
				<xfl-select 
				v-if="updataDate"
				:list="buildingList"
				:clearable="false"
				:showItemNum="5" 
				:listShow="false"
				:isCanInput="false"  
				:style_Container="listBoxStyle"
				:initValue="buildingList[0]"
				:selectHideType="'hideAll'"
				@change="buildingChange"
				>
				</xfl-select>
				<view style="height: 40px;text-align: center;font-size: 26upx;color: #909090;" v-else>loading...</view>
			</view>
			<view class="title">星期</view>
			<view style="width: 80%; margin: auto;margin-bottom: 20px;">
				<xfl-select 
				:list="week"
				:clearable="false"
				:showItemNum="5"
				:listShow="false"
				:isCanInput="false"  
				:style_Container="listBoxStyle"
				:initValue="week[day]"
				:selectHideType="'hideAll'"
				@change="weekChange"
				>
				</xfl-select>
			</view>
		</view>
		<view style="position: fixed;bottom: 0;padding: 20px;padding-top: 15upx;width: 100%;box-sizing: border-box;">
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="buttondisabled" @tap="submit">查询</button>
		</view>
		
		<active-week-picker themeColor="#00A0F0" ref="AWPicker" :schoolww="schoolww" :pickerValueDefault="schoolww" @onConfirm="onConfirm"></active-week-picker>
	</view>
</template>

<script>
	import xflSelect from '../../components/xfl-select/xfl-select.vue';
	import ActiveWeekPicker from '../../components/active-week-picker/active-week-picker.vue';
	import DateUtil from '../../common/dateutil.js';
	export default {
		data() {
			return {
				listBoxStyle: `height: 40px; font-size: 16px;`,
				day:0,
				schoolww:0,
				week:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
				campus:[],
				buildingList:[],
				building_holder:'',
				buildings:[],
				selectCampus:'',
				selectBuilding:'',
				selectWeek:'',
				updataDate:true,

			}
		},
		computed:{ 
			barConfig(){ 
				return { 
					title:"查询空教室-第"+this.schoolww+"周", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							iconfont:"icon-shezhi"
						}
					] 
				}
			} 
		}, 

		onReady() {
			uni.setNavigationBarTitle({
				title:'空教室查询 第'+this.schoolww+'周'
			})
		},
		onLoad() {
			let date = new Date()
			this.day = date.getDay()
			this.schoolww = DateUtil.dateutil.getWeekNumber(date.getFullYear(),date.getMonth()+1,date.getDate()) - uni.getStorageSync('schoolwwAdjust')
			console.log(this.day)
			this.campus = uni.getStorageSync('campus')
			this.buildings.push(uni.getStorageSync('campus1'))
			this.buildings.push(uni.getStorageSync('campus2'))
			this.buildings.push(uni.getStorageSync('campus3'))
			this.buildingList = this.buildings[0]
			this.selectCampus = '南校区'
			this.selectBuilding = this.buildings[0][0]
			this.selectWeek = this.day == 0?7:this.day
		},
		methods: {
			onConfirm(e){
				// console.log(JSON.stringify(e))
				this.schoolww = e.value.index+1
				this.schoolww = this.schoolww.toString()
			},
			buttonTap(e){
				if(e.index == 0){
					this.publicM.back1()
				} else if(e.index==1){
					uni.showActionSheet({
						itemList:['切换当前周'],
						success: (res) => {
							if(res.tapIndex==0){
								this.$refs.AWPicker.show()
							}
						}
					})
				}
			},
			visibleChange(isShow){ // 列表框的显示隐藏事件
				console.log('isShow::', isShow);
			},
			campusChange({newVal, oldVal, index, orignItem}){ 
				this.selectCampus = newVal
				this.buildingList = this.buildings[index]
				this.selectBuilding = this.buildings[index][0]
				this.updataDate=false
				setTimeout(()=>{
					this.updataDate = true
				},500)
			},
			buildingChange({newVal, oldVal, index, orignItem}){
				this.selectBuilding = newVal
			},
			weekChange({newVal, oldVal, index, orignItem}){
				this.selectWeek = index == 0?7:index
			},
			submit(){
				uni.navigateTo({
					url:'ec-search-res/ec-search-res?campus='+this.selectCampus+'&building='+this.selectBuilding+'&week='+this.selectWeek+'&schoolww='+this.schoolww
				})
			}
		},
		components: { xflSelect , ActiveWeekPicker},

		 /* 
			// 或者在 main.js 中注册为全局组件 
			import xflSelect from './components/xfl-select/xfl-select.vue';
			Vue.component('xfl-select', xflSelect);
		*/
	}
</script>

<style>
	.content {
		text-align: center;
		/* height: 400upx; */
	}
	.title {
		font-size: 35upx;
		padding-bottom: 20upx;
	}
	.verifybuttonhover[type=primary]{
		background: #00b9ff!important;
	}
	.verifybutton{
		background: #00aaff!important;
		border-radius: 50upx!important;
	}
	button::after{ border: none;}
</style>
