<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>

		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		<view class="section-body animated fadeIn faster200" v-for="(item,m) in dataList" :key="m">
			<view class="title">
			{{sectionTitle(item.startSection,item.endSection)}}
			</view>
			<view class="classroom-body u-f" v-if="item.roomList.length>0" >
				<view v-for="(eitem,n) in item.roomList" 
					:key="n" 
					:id="'room_'+m+'_'+n" 
					:style="{ 
						'min-width': '10.2%',
						'padding': '0 2%'
					}"
					class="u-f-ajc"
				>
					<view 
						class="classroom" 
						hover-class="classroomHover" 
						hover-stay-time="100" 
						@tap="viewDetail(eitem)"
					>
						{{eitem.name}}
					</view>
				</view>
			</view>
			<view class="classroom-body" v-else-if="item.roomList.length==0" style="color: #909090;font-size: 26upx;text-align: center;" >
				没有结果
			</view>
			<view class="classroom-body" v-else style="color: #909090;font-size: 26upx;text-align: center;" >
				loading...
			</view>
		</view>
		<view style="height: 50upx;"></view>
		
		<view class="detailMask" v-if="showDetail" @tap="closePop" @touch.prevent>
			<view class="detailPop animated zoomIn faster200" @tap.stop>
				<view class="detailTitle u-f-ajc">教室详情</view>
				<view class="detailItem">校区：{{roomObject.campus?roomObject.campus:"无"}}</view>
				<view class="detailItem">教学楼：{{roomObject.building?roomObject.building:"无"}}</view>
				<view class="detailItem">教室：{{roomObject.name?roomObject.name:"无"}}</view>
				<view class="detailItem">类型：{{roomObject.type?roomObject.type:"无"}}</view>
				<view class="detailItem">座位数：{{roomObject.seats?roomObject.seats:"无"}}</view>
				<view class="closeButton u-f-ajc" hover-class="button-hover" hover-stay-time="100" @tap="closePop"><view class="icon iconfont icon-guanbi"></view></view>
			</view>
		</view>
		
		<view v-if="refresh"></view>
	</view>
</template>

<script>
	import DateUtil from '../../../common/dateutil.js';
	export default {
		data() {
			return {
				params:{},
				dataList:[],
				// roomWList:{},
				config:{
					title:"查询结果", //title
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
				pageExit:false,
				showDetail:false,
				roomObject:{},
				refresh:false,
			}
		},
		watch:{
			
		},
		computed:{
			sectionTitle(){
				return function(startSection,endSection){
					if(startSection==endSection){
						return '第 '+startSection+' 小节'
					} else {
						return '第 '+startSection+"-"+endSection+' 小节'
					}
				}
			},
			simplifyd(){
				return function(text){
					text = text.replace(/（.*）/g,"")
					text = text.replace(/\(.*\)/g,"")
					text = text.replace(/\(.*）/g,"")
					text = text.replace(/（.*\)/g,"")
					return text
				}
				
			},
		},
		onReady() {
			// console.log('ready')
			// setInterval(()=>{
			// 	this.refresh = !this.refresh
			// },1000)
		},
		onLoad(e) {
			// uni.showLoading({title:"加载中"})
			console.log(e)
			this.params = e
			if(e.sections=="0-0"){
				this._initData(1)
			} else {
				var s = this.params.sections
				this.dataList.push({
					'startSection':s.split("-")[0],
					'endSection':s.split("-")[1],
					'roomList':false
				})
				this.getdata({
					user_id:this.User.userinfo.id,
					campus:this.params.campus,
					building_id:this.params.buildingId,
					date_begin:this.params.startDate,
					date_end:this.params.endDate,
					sections:s,
					mode:"1"
				})
			}
			// this.getdata()
		},
		methods: {
			viewDetail(e){
				this.roomObject = e
				this.showDetail = true
			},
			closePop(){
				this.showDetail = false
			},
			async _initData(e){
				if(e>5) return;
				if(this.pageExit) return;
				this.dataList.push({
					'startSection':2*e-1,
					'endSection':2*e,
					'roomList':false
				})
				console.log((2*e-1)+"-"+2*e)
				await this.getdata({
					user_id:this.User.userinfo.id,
					campus:this.params.campus,
					building_id:this.params.buildingId,
					date_begin:this.params.startDate,
					date_end:this.params.endDate,
					sections:(2*e-1)+"-"+(2*e),
					mode:"1"
				})
				this._initData(e+1)
			},
			async getdata(payload){
				if(!payload) return;
				if(this.pageExit) return;
				let [err,res] = await this.$http.post('/app/freeroom/search',payload,{
					token:true,
					checkToken:true
				});
				// 请求失败处理
				console.log(res)
				if (res.data.errorCode === 30029) {
					if(this.pageExit) return;
					this.publicM.sleep(500)
					return this.getdata(payload)
				}
				if (!this.$http.errorCheck(err,res)) return;
				var data = res.data.data.data
				let obj = this.dataList.find((item)=>{
					return item.startSection == data[0].startSection && item.endSection == data[0].endSection
				})
				obj.roomList = data[0].roomList
			},
			buttonTap(e){
				if(e.index == 0){
					this.pageExit = true
					uni.navigateBack({
						delta:1
					})
				}
			},
		}
	}
</script>

<style>
	.section-body{
		background: #FFFFFF;
		border: 2upx solid #e6e6e6;
		border-radius: 8upx;
		/* margin: 20upx; */
		padding: 15upx 0;
		width: 92%;
		margin: 35rpx 4%;
		box-sizing: border-box;
	}
	.title {
		font-size: 35upx;
		padding-bottom: 15upx;
		text-align: center;
		border-bottom: 2upx solid #dcdcdc;
	}
	.classroomHover{
		background: #f1f1f1!important;
		/* border: 1px solid #00AAFF; */
	}
	.classroom{
		margin: 10rpx 0;
		border-bottom: 2upx dashed #dcdcdc;
		box-sizing: border-box;
		/* padding: 5rpx; */
		/* word-wrap: unset; */
		/* word-break: keep-all; */
		/* box-sizing: border-box; */
	}
	.classroom-body{
		box-sizing: border-box;
		padding: 20upx;
		flex-wrap: wrap;
		width: 100%;
	}
	
	.button-hover{
		background: #0093dc!important;
	}
	.detailTitle{
		color: #2a2a2a;
		font-size: 40upx;
		padding: 20upx 0;
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
	.detailMask{
		top:0;
		right:0;
		bottom:0;
		left:0;
		position: fixed;
		z-index: 2000;
		background: rgba(0,0,0,0.1);
	}
	.detailItem{
		color: #2a2a2a;
		width: 100%;
		font-size: 26upx;
		padding: 6upx 0;
		border-bottom: 1upx solid #909090;
	}
</style>
