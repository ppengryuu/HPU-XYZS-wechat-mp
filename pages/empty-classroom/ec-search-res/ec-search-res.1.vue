<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>

		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		<view class="section-body animated fadeIn faster200" v-for="(item,m) in dataList" :key="m">
			<view class="title">
			{{'第 '+sectionTitle(item.startSection,item.endSection)+' 小节'}}
			</view>
			<view class="classroom-body u-f" v-if="item.roomList.length>0" >
				<view v-for="(eitem,n) in item.roomList" :key="n">
					<view class="classroom">{{eitem.name}}</view>
				</view>
			</view>
			<view class="classroom-body" v-else-if="item.roomList.length==0" style="color: #909090;font-size: 26upx;text-align: center;" >
				没有查询结果
			</view>
			<view class="classroom-body" v-else style="color: #909090;font-size: 26upx;text-align: center;" >
				loading...
			</view>
		</view>
		<view style="height: 50upx;"></view>
	</view>
</template>

<script>
	import DateUtil from '../../../common/dateutil.js';
	export default {
		data() {
			return {
				params:{},
				dataList:[],
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
				

			}
		},
		computed:{
			sectionTitle(){
				return function(startSection,endSection){
					if(startSection==endSection){
						return startSection
					} else {
						return startSection+"-"+endSection
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
				
			}
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
					uid:this.User.userinfo.id,
					campus:this.params.campus,
					buildingId:this.params.buildingId,
					dateBegin:this.params.startDate,
					dateEnd:this.params.endDate,
					sections:s,
					mode:"1"
				})
			}
			// this.getdata()
		},
		methods: {
			
			async _initData(e){
				if(e>10) return;
				this.dataList.push({
					'startSection':e.toString(),
					'endSection':e.toString(),
					'roomList':false
				})
				await this.getdata({
					uid:this.User.userinfo.id,
					campus:this.params.campus,
					buildingId:this.params.buildingId,
					dateBegin:this.params.startDate,
					dateEnd:this.params.endDate,
					sections:e+"-"+e,
					mode:"1"
				})
				setTimeout(()=>{
					this._initData(e+1)
				},500)
			},
			async getdata(payload){
				if(!payload) return;
				let [err,res] = await this.$http.post('/app/freeroom/search',payload,{
					token:true,
					checkToken:true
				});
				// 请求失败处理
				console.log(res)
				if (res.data.errorCode === 30029) {
					
					return setTimeout((payload)=>{
						this.getdata(payload)
					},888)
				}
				if (!this.$http.errorCheck(err,res)) return;
				var data = res.data.data.data
				let obj = this.dataList.find((item)=>{
					return item.startSection === data[0].startSection && item.endSection === data[0].endSection
				})
				obj.roomList = data[0].roomList
			},
			buttonTap(e){
				if(e.index == 0){
					uni.navigateBack({
						delta:1
					})
				}
			}
		}
	}
</script>

<style>
	.section-body{
		background: #FFFFFF;
		border: 2upx solid #e6e6e6;
		border-radius: 8upx;
		margin: 20upx;
		padding: 15upx 0;
		box-sizing: border-box;
	}
	.title {
		font-size: 35upx;
		padding-bottom: 15upx;
		text-align: center;
		border-bottom: 2upx solid #dcdcdc;
	}
	.classroom{
		margin: 5upx 15upx;
		border-bottom: 2upx dashed #dcdcdc;
		box-sizing: border-box;
	}
	.classroom-body{
		box-sizing: border-box;
		padding: 20upx;
		flex-wrap: wrap;
		width: 100%;
	}
</style>
