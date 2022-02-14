<template>
	<view class="content">
		<navigation-custom :config="barConfig" @buttonTap="buttonTap"/>

		<view style="padding-top: 30px;">
			<view class="title">宿舍楼（南校区）</view>
			<view style="width: 80%; margin: auto;margin-bottom: 20px;">
				<xfl-select 
				v-if="updataLou"
				:list="lous"
				:clearable="false"
				:showItemNum="5" 
				:listShow="false"
				:isCanInput="false"  
				:style_Container="listBoxStyle"
				:initValue="lastQ[0].label"
				:selectHideType="'hideAll'"
				@change="louChange"
				>
				</xfl-select>
				<view style="height: 40px;text-align: center;font-size: 26upx;color: #909090;" v-else>loading...</view>
			</view>
			<view class="title">楼层</view>
			<view style="width: 80%; margin: auto;margin-bottom: 20px;">
				<xfl-select 
				v-if="updataCeng"
				:list="cengs"
				:clearable="false"
				:showItemNum="5" 
				:listShow="false"
				:isCanInput="false"  
				:style_Container="listBoxStyle"
				:initValue="lastQ[1].label"
				:selectHideType="'hideAll'"
				@change="cengChange"
				>
				</xfl-select>
				<view style="height: 40px;text-align: center;font-size: 26upx;color: #909090;" v-else>loading...</view>
			</view>
			<view class="title">宿舍</view>
			<view style="width: 80%; margin: auto;margin-bottom: 20px;">
				<xfl-select 
				v-if="updataRoom"
				:list="rooms"
				:clearable="false"
				:showItemNum="5"
				:listShow="false"
				:isCanInput="false"  
				:style_Container="listBoxStyle"
				:initValue="lastQ[2].label"
				:selectHideType="'hideAll'"
				@change="roomChange"
				>
				</xfl-select>
				<view style="height: 40px;text-align: center;font-size: 26upx;color: #909090;" v-else>loading...</view>
			</view>
		</view>
		<view style="position: fixed;bottom: 0;padding: 20px;padding-top: 15upx;width: 100%;box-sizing: border-box;">
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="buttondisabled" @tap="submit">查询</button>
		</view>
		
	</view>
</template>

<script>
	import xflSelect from '../../components/xfl-select/xfl-select.vue';
	export default {
		data() {
			return {
				listBoxStyle: `height: 40px; font-size: 16px;`,
				lousOri:[],
				cengsOri:[],
				roomsOri:[],
				lous:[],
				cengs:[],
				rooms:[],
				selectlou:'',
				selectceng:'',
				selectroom:'',
				updataLou:false,
				updataCeng:true,
				updataRoom:true,
				queryData:false,
				lastQ:false,
				buttondisabled:true
			}
		},
		computed:{ 
			barConfig(){ 
				return { 
					title:"电费查询", //title
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
		watch:{
			queryData(){
				if(this.queryData){
					this.buttondisabled = false
				} else {
					this.buttondisabled = true
				}
			}
		},
		onLoad() {
			uni.showLoading({title:"加载中",mask:true})
			this.__init()
			// this.getdata()
			
		},
		methods: {
			__init(){
				var last = uni.getStorageSync("lastElecQuery")
				if(last){
					this.lastQ = last
					this.selectlou = last[0]
					this.selectceng = last[1]
					this.selectroom = last[2]
					console.log("auto load")
					this.lousOri = uni.getStorageSync("lastElecQueryLous")
					this.cengsOri = uni.getStorageSync("lastElecQueryCengs")
					this.roomsOri = uni.getStorageSync("lastElecQueryRooms")
					for(var a=0;a<this.lousOri.length;a++){
						this.lous.push(this.lousOri[a].label)
					}
					for(var b=0;b<this.cengsOri.length;b++){
						this.cengs.push(this.cengsOri[b].label)
					}
					for(var c=0;c<this.roomsOri.length;c++){
						this.rooms.push((this.roomsOri[c].label))
					}
					this.getdata(last[0].value, last[1].value, last[2].value)
					this.updataLou = true
				} else {
					console.log("new load")
					this.getdata()
				}
			},
			buttonTap(e){
				if(e.index == 0){
					this.publicM.back1()
				} else if(e.index==1){
					uni.showActionSheet({
						itemList:['清除保存的查询记录'],
						success: (res) => {
							if(res.tapIndex==0){
								uni.showModal({
									title:"提示",
									content:"需要清除上一次的查询记录或选项不能正常加载时，可以尝试清除已保存的查询记录后重新打开本页面",
									success: (res) => {
										if(res.confirm){
											uni.removeStorageSync("lastElecQuery")
											this.lastQ = []
											uni.showToast({
												title:"成功",
												icon:"none"
											})
										}
									}
								})
							}
						}
					})
				}
			},
			louChange({newVal, oldVal, index, orignItem}){ 
				this.lastQ = []
				this.selectlou = this.lousOri[index]
				this.updataCeng = false
				this.updataRoom = false
				this.rooms = []
				this.roomsOri = []
				this.getdata(this.selectlou.value)
			},
			cengChange({newVal, oldVal, index, orignItem}){
				this.lastQ = []
				this.selectceng = this.cengsOri[index]
				this.updataRoom = false
				this.getdata(this.selectlou.value,this.selectceng.value)
			},
			roomChange({newVal, oldVal, index, orignItem}){
				this.lastQ = []
				this.selectroom = this.roomsOri[index]
				uni.showLoading({title:"加载中",mask:true})
				this.getdata(this.selectlou.value,this.selectceng.value,this.selectroom.value)
			},
			submit(){
				let obj = [this.selectlou,this.selectceng,this.selectroom]
				uni.setStorageSync("lastElecQuery", obj)
				uni.setStorageSync("lastElecQueryLous", this.lousOri)
				uni.setStorageSync("lastElecQueryCengs", this.cengsOri)
				uni.setStorageSync("lastElecQueryRooms", this.roomsOri)
				uni.setStorageSync("electricityData", this.queryData)
				uni.navigateTo({
					url:"electricity-res/electricity-res"
				})
			},
			async getdata(lou, ceng, room){
				lou = lou?lou:""
				ceng = ceng?ceng:""
				room = room?room:""
				let [err,res] = await this.$http.post('/app/dorm/electricity',{
					lou: lou,
					ceng: ceng,
					room: room
				},{
					token:true,
					checkToken:true
				});
				console.log(res)
				if(room){
					this.queryData = res.data.data
					uni.hideLoading()
					return;
				}
				if(ceng){
					this.rooms = []
					this.roomsOri = []
					var data3 = res.data.data
					this.roomsOri = data3
					for(var k=0;k<data3.length;k++){
						this.rooms.push(data3[k].label)
					}
					this.updataRoom = true
					uni.hideLoading()
					return;
				}
				if(lou){
					this.cengs = []
					this.cengsOri = []
					var data2 = res.data.data
					this.cengsOri = data2
					for(var j=0;j<data2.length;j++){
						this.cengs.push(data2[j].label)
					}
					this.updataCeng = true
					this.updataRoom = true
					uni.hideLoading()
					return;
				}
				this.lous = []
				this.lousOri = []
				var data1 = res.data.data
				this.lousOri = data1
				for (var i=0;i<data1.length;i++) {
					this.lous.push(data1[i].label)
				}
				this.updataLou = true
				uni.hideLoading()
			}
		},
		components: { xflSelect },

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
