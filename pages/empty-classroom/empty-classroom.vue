<template>
	<view class="content">
		<navigation-custom :config="barConfig1()" @buttonTap="buttonTap"/>

		<view style="padding-top: 30px;">
			<!-- <view class="title">校区</view> -->
			<!-- <view style="width: 80%; margin: auto;margin-bottom: 20px;">
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
			</view> -->
			<view class="title">教学楼</view>
			<view style="width: 80%; margin: auto;margin-bottom: 20px;">
				<xfl-select 
				v-if="buildingsLoaded"
				:list="buildingList"
				:clearable="false"
				:showItemNum="12" 
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
			<view class="title">空闲日期区间</view>
			<view class="u-f-ac" style="width: 80%; margin: auto;margin-bottom: 20px;">
				<picker mode="date" :value="startDate" @change="changeStartDate" class="dateContainer" style="margin-right: 10rpx;">
					<view class="containText u-f-ajc" style="width: 100%;height: 40px;">
						{{startDate.split("-")[0]+"年"+startDate.split("-")[1]+"月"+startDate.split("-")[2]+"日"}}
					</view>
				</picker>
				
				<picker mode="date" :value="endDate" @change="changeEndDate" class="dateContainer" style="margin-left: 10rpx;" :start="startDate">
					<view class="containText u-f-ajc" style="width: 100%;height: 40px;">
						{{endDate.split("-")[0]+"年"+endDate.split("-")[1]+"月"+endDate.split("-")[2]+"日"}}
					</view>
				</picker>
				
			</view>
			<label class="u-f-ac" v-on:click="switchPointSection(pointSection)">
				<checkbox :checked="pointSection" style="transform: scale(0.7);padding-left: 10%;"/>
				<view style="color: #646464;">指定节次区间</view>
			</label>
			<view v-if="pointSection" class="animated fadeIn faster200" style="margin-top: 10rpx;">
				<view class="title">空闲节次区间</view>
				<view class="u-f-ac" style="width: 80%; margin: auto;margin-bottom: 20px;">
					<picker mode="selector" :range="startSectionArr" @change="changeStartSection" class="dateContainer" style="margin-right: 10rpx;">
						<view class="containText u-f-ajc" style="width: 100%;height: 40px;">
							{{startSection}}
						</view>
					</picker>
					
					<picker mode="selector" :range="endSectionArr(startSection)" @change="changeEndSection" class="dateContainer" style="margin-left: 10rpx;" :start="startSection">
						<view class="containText u-f-ajc" style="width: 100%;height: 40px;">
							{{endSection}}
						</view>
					</picker>
				</view>
			</view>
			
		</view>
		<view style="position: fixed;bottom: 0;padding: 20px;padding-top: 15upx;width: 100%;box-sizing: border-box;">
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="buttondisabled" @tap="submit">查询</button>
		</view>
		
		
		
		
	</view>
</template>

<script>
	import xflSelect from '../../components/xfl-select/xfl-select.vue';
	
	import DateUtil from '../../common/dateutil.js';
	export default {
		data() {
			return {
				startDate:"",
				endDate:"",
				todayD:"",
				listBoxStyle: `height: 40px; font-size: 16px;`,
				startSectionArr: ['1','2','3','4','5','6','7','8','9','10'],
				campus:[],
				buildingList:[],
				selectCampus:'',
				selectBuilding:'',
				buildingsLoaded:false,
				buildingObjects:{},
				pointSection:false,
				startSection:"1",
				endSection:"1",
				barConfig:{ 
					title:"空教室查询", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							text:"今天"
						}
					] 
				}
			}
		},
		computed:{ 
			endSectionArr(){
				return function(e){
					var arr={
						"1":['1','2','3','4','5','6','7','8','9','10'],
						"2":['2','3','4','5','6','7','8','9','10'],
						"3":['3','4','5','6','7','8','9','10'],
						"4":['4','5','6','7','8','9','10'],
						"5":['5','6','7','8','9','10'],
						"6":['6','7','8','9','10'],
						"7":['7','8','9','10'],
						"8":['8','9','10'],
						"9":['9','10'],
						"10":['10'],
					}
					return arr[e]
				}
			},
			barConfig1(){
				return function(){
					return { 
						title:"空教室查询", //title
						bgcolor:"#f8f8f8", //背景颜色
						fontcolor:'#0c0c0c',
						type:1, //type 1，3胶囊 2，4无胶囊模式
						buttons:this.todayD==this.startDate&&this.todayD==this.endDate?[
							{
								iconfont:"icon-fanhui",
								width:"60px",
								text:"返回"
							}
						]:[
							{
								iconfont:"icon-fanhui",
								width:"60px",
								text:"返回"
							},{
								text:"今天"
							}
						] 
					}
				}
			}
			
		}, 

		onReady() {
			
		},
		onLoad() {
			this.todayDate()
			this.getBuildings()
		},
		methods: {
			todayDate(){
				let d = new Date();
				var Y = d.getFullYear();
				var M = (d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1)
				var D = d.getDate()<10?"0"+d.getDate():d.getDate()
				this.todayD = this.startDate = this.endDate = Y+"-"+M+"-"+D
			},
			switchPointSection(e){
				e=!e
				this.pointSection = e
				console.log(e,this.pointSection)
			},
			changeStartSection(e){
				console.log(e)
				var index = e.detail.value
				this.startSection = this.startSectionArr[index]
				var s = parseInt(this.startSection)
				var e = parseInt(this.endSection)
				if(s>e) this.endSection = this.startSection;
			},
			changeEndSection(e){
				var i = e.detail.value
				this.endSection = this.endSectionArr(this.startSection)[i]
			},
			changeStartDate(e){
				// var ymd = e.detail.value.split("-")
				// this.startDate = ymd[0]+"年"+ymd[1]+"月"+ymd[2]+"日"
				
				this.startDate = e.detail.value
				var s = parseInt(this.startDate.replace(/-/g,""))
				var e = parseInt(this.endDate.replace(/-/g,""))
				if(s>e) this.endDate = this.startDate;
			},
			changeEndDate(e){
				// var ymd = e.detail.value.split("-")
				// this.endDate = ymd[0]+"年"+ymd[1]+"月"+ymd[2]+"日"
				 
				this.endDate = e.detail.value
			},
			async getBuildings(){
				var data = uni.getStorageSync("freeroomBuildings")
				if(!data){
					let [err,res] = await this.$http.post('/app/freeroom/buildings',{
						user_id:this.User.userinfo.id,
					},{
						token:true,
						checkToken:true
					}); 
					console.log(res)
					if (!this.$http.errorCheck(err,res)) {
						// plus.nativeUI.toast(res.data.msg)
						return;
					}
					data = res.data.data.data
				}
				this.buildingObjects = data
				for(var i=0;i<data.length;i++){
					this.buildingList.push(data[i].title)
				}
				this.buildingsLoaded=true
				this.selectBuilding = data[0].value
			},
			
			buttonTap(e){
				if(e.index == 0){
					this.publicM.back1()
				} else if(e.index == 1){
					this.todayDate()
				}
			},
			visibleChange(isShow){ // 列表框的显示隐藏事件
				console.log('isShow::', isShow);
			},
			
			buildingChange({newVal, oldVal, index, orignItem}){
				let obj = this.buildingObjects.find((item)=>{
					return item.title === newVal
				})
				console.log(obj)
				this.selectBuilding = obj.value
				
			},
			submit(){
				var s = this.pointSection?this.startSection:"0"
				var e = this.pointSection?this.endSection:"0"
				uni.navigateTo({
					url:'ec-search-res/ec-search-res?campus='+this.selectCampus+'&buildingId='+this.selectBuilding+'&startDate='+this.startDate+'&endDate='+this.endDate+'&sections='+s+"-"+e
				})
			}
		},
		components: { xflSelect },

		 /* 
			// 或者在 main.js 中注册为全局组件 
			import xflSelect from './components/xfl-select/xfl-select.vue';
			Vue.component('xfl-select', xflSelect);
		*/
	}
</script>

<style>
	.containText{
		color: #606266;
	}
	.dateContainer{
		box-sizing: border-box;
		/* margin: 10rpx; */
		border-radius: 4px;
		border: #BBBBBB 1px solid;
		height: 40px;
		width: 50%;
	}
	.dateContainer:hover{
		border: #409eff 1px solid;
	}
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
