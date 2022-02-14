<template>
	<view>
		<navigation-custom :config="barConfig" @buttonTap="buttonTap" @navHeight="getnavH"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<view class="ta-item">
			<view class="left-title">联系电话</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="20" placeholder="联系电话" show-confirm-bar="false" v-model="payload.userMobile" cursor-spacing="0" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="edit-tip"><view>* 请输入联系电话，必填项</view></view>
		<view class="ta-item">
			<view class="left-title">区域地址</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="请选择" show-confirm-bar="false" v-model="payload.areaName" cursor-spacing="0" placeholder-class="phclass" disabled="disabled" @tap="selectArea"/>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="edit-tip"><view>* 请选择区域地址，必填项</view></view>
		<view class="ta-item">
			<view class="left-title">详细地址</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="详细地址" show-confirm-bar="false" v-model="payload.address" cursor-spacing="0" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="edit-tip"><view>* 请输入详细地址，2-100个字符，必填项</view><view> {{payload.address.length+'/100'}}</view></view>
		<view class="ta-item">
			<view class="left-title">维修项目</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="请选择" show-confirm-bar="false" v-model="payload.itemName" cursor-spacing="0" placeholder-class="phclass" disabled="disabled" @tap="selectRepair"/>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="edit-tip"><view>* 请选择维修项目，必填项</view></view>
		<view class="ta-item">
			<view class="left-title">故障描述</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="500" placeholder="2~500字" show-confirm-bar="false" v-model="payload.content" cursor-spacing="0" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="edit-tip"><view>* 请输入详细地址，2-500个字符，必填项</view><view> {{payload.content.length+'/500'}}</view></view>
		
		<!-- 上传图片 -->
		<view class="list-pd">
			<view class="cell-pd">
				<view class="uni-uploader">
					<view class="uni-uploader-head">
						<view class="uploader-title">添加图片</view>
						<view class="uni-uploader-info">{{imageList.length}}/6</view>
					</view>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(image,index) in imageList" :key="index">
								<view class="uni-uploader__file">
									<view class="deletepic" @tap="delpic(index)">
										<view class="icon iconfont icon-guanbi" style="font-size: 25rpx!important;"></view>
									</view>
									<image class="uni-uploader__img" :src="image" :data-src="image" mode="aspectFill" @tap="previewImage" @load="imgsload(index)"></image>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-if="imageList.length<6">
								<view class="uni-uploader__input" @tap="chooseImage"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<uni-drawer :visible="showRight1" mode="right" width="100%" :navHeight="navH+'px'" @close="closeDrawer('1')">
			<view class="scroll-content u-f">
				<view class="left-scroll" style="width: 30%;">
					<scroll-view scroll-y="true" :style="{height: scrollH+'px'}">
						<view v-for="(item, m) in allAreaList" :key="m">
							<view class="litem u-f-ajc" :class="m==areaIndex?'hight-light-box':''" hover-class="litem-hover" hover-stay-time="100" @tap="confirmArea(item,m)">{{item.text}}</view>
						</view>
					</scroll-view>
					
				</view>
				
				<view class="right-scroll" style="width: 70%;box-shadow: 5px 0px 5px -5px #BEBEBE inset;">
					<scroll-view scroll-y="true" :style="{height: scrollH+'px'}">
						<view v-for="(ritem, n) in BuildList" :key="n">
							<view class="litem u-f-ajc" :class="n==buildIndex?'hight-light-box':''" hover-class="litem-hover" hover-stay-time="100" style="background: #F8F8F8;box-shadow: 5px 0px 5px -5px #BEBEBE inset;" @tap="confirmbuild(ritem,n)">{{ritem.text}}</view>
						</view>
					</scroll-view>
					
				</view>
			</view>
			
		</uni-drawer>
		
		<uni-drawer :visible="showRight2" mode="right" width="100%" :navHeight="navH+'px'" @close="closeDrawer('2')">
			<view class="scroll-content u-f">
				<view class="left-scroll" style="width: 30%;">
					<scroll-view scroll-y="true" :style="{height: scrollH+'px'}">
						<view v-for="(item, m) in allRepaList" :key="m">
							<view class="litem u-f-ajc" :class="m==repaIndex?'hight-light-box':''" hover-class="litem-hover" hover-stay-time="100" @tap="confirmItemPra(item,m)">{{item.text}}</view>
						</view>
					</scroll-view>
					
				</view>
				
				<view class="right-scroll" style="width: 70%;box-shadow: 5px 0px 5px -5px #BEBEBE inset;">
					<scroll-view scroll-y="true" :style="{height: scrollH+'px'}">
						<view v-for="(ritem, n) in repaItemList" :key="n">
							<view class="litem u-f-ajc" :class="n==repaItemIndex?'hight-light-box':''" hover-class="litem-hover" hover-stay-time="100" style="background: #F8F8F8;box-shadow: 5px 0px 5px -5px #BEBEBE inset;" @tap="confirmItem(ritem,n)">{{ritem.text}}</view>
						</view>
					</scroll-view>
					
				</view>
			</view>
			
		</uni-drawer>
		
	</view>
</template>

<script>
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	export default {
		components:{
			uniDrawer
		},
		data() {
			return {
				showRight1:false,
				showRight2:false,
				// sessionData:Object,
				allAreaList:false,
				BuildList:Array,
				allRepaList:Array,
				repaItemList:Array,
				Cookie:"",
				scrollH:"",
				navH:"",
				areaIndex:Number,
				buildIndex:Number,
				repaIndex:Number,
				repaItemIndex:Number,
				barConfig:{
					title:"网上报修", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							text:"提交"
						}
					]
				},
				payload:{
					"userMobile": "",		//15514985863
					"repairCount": "1",		//1
					"content": "",			//222
					"imglist": "",			///repair/2020-05-24/1590333811863pdhc4a.jpg
					"areaId": "",			//50002
					"itemId": "",			//9d0a5fb2-f837-4879-ba16-d219ea5e2cab
					"areaName": "",			//南校区教学区/2号教学楼
					"address": "",			//111
					"bookDate": "",			//
					"bookStartTime": "",	//
					"bookEndTime": "",		//
					"itemParentId": "",		//704b2f33-21a5-4a58-9a65-cdfa836e60d3
					"areaParentId": "",		//5
					"itemName": "",			//暖气维修/其他
					"uploadRepairPhoto": "N"	//N
				},
				// count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				imageList:[],
				payloadImgList:[],
				doneImgNum:0
			}
		},
		onLoad() {
			this.Cookie = uni.getStorageSync("zhhqSessionData").session
			// this.getAreaList()
		},
		methods: {
			// 验证手机号码
			isPhone(){
				let mPattern = /^1[34578]\d{9}$/; 
				return mPattern.test(this.payload.userMobile);
			},
			previewImage(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			delpic(index){
				uni.showModal({
					title: '提示',
					content: '要删除该图片吗？',
					showCancel: true,
					success: res => {
						if(res.confirm){
							this.imageList.splice(index,1)
							this.payloadImgList.splice(index,1)
							this.doneImgNum--
						}
					},
				});
			},
			imgsload(){
				this.doneImgNum++
				if(this.doneImgNum>=this.imageList.length){
					uni.hideLoading()
				}
			},
			
			confirmItem(e,n){
				this.repaItemIndex = n
				this.payload.itemId = e.id
				this.payload.itemName = this.allRepaList[this.repaIndex].text+"/"+this.repaItemList[this.repaItemIndex].text
				this.showRight2 = false
			},
			confirmItemPra(e,m){
				this.repaIndex = m
				this.repaItemIndex = 0
				this.payload.itemParentId = e.id
				this.repaItemList = e.children
			},
			confirmbuild(e,n){
				console.log(e)
				this.buildIndex = n
				this.payload.areaId = e.id
				this.payload.areaName = this.allAreaList[this.areaIndex].text+"/"+this.BuildList[this.buildIndex].text
				this.payload.itemId = ""
				this.payload.itemParentId = ""
				this.payload.itemName = ""
				this.repaItemIndex = 0
				this.repaIndex = 0
				this.showRight1 = false
			},
			confirmArea(e,m){
				console.log(e)
				this.areaIndex = m
				this.buildIndex = 0
				this.payload.areaParentId = e.id
				this.BuildList = e.children
				console.log(this.BuildList)
			},
			getAreaList(){
				console.log(this.config.zhhqUrl)
				uni.showLoading({
					title:"加载中"
				})
				uni.request({
					method:"POST",
					url: this.config.zhhqUrl + "/repair/api/wap/repair/manage/area/allList",
					header:{
						Cookie:this.Cookie
					},
					success: (res) => {
						this.allAreaList = res.data
						this.showRight1 = true
						uni.hideLoading()
						// console.log(JSON.stringify(res))
					}
				})
			},
			getRepaList(){
				if(!this.payload.areaId) return uni.showToast({
					icon:"none",
					title:"请先选择区域地址"
				})
				uni.showLoading({
					title:"加载中"
				})
				uni.request({
					method:"POST",
					url: this.config.zhhqUrl + "/repair/api/wap/repair/manage/item/allListByAreaId?areaId="+this.payload.areaId,
					header:{
						Cookie:this.Cookie
					},
					success: (res) => {
						this.allRepaList = res.data
						uni.hideLoading()
						this.showRight2 = true
						// console.log(JSON.stringify(res))
					}
				})
			},
			closeDrawer(e) {
				if(e=="1"){
					this.showRight1 = false
				} else if(e=="2"){
					this.showRight2 = false
				}
			},
			selectArea(){
				uni.hideKeyboard()
				if(!this.allAreaList){
					this.getAreaList()
				} else {
					this.showRight1 = true
				}
				
				// this.showRight1 = true
			},
			selectRepair(){
				uni.hideKeyboard()
				this.getRepaList()
			},
			buttonTap(e){
				if(e.index==0){
					if(this.showRight1 || this.showRight2){
						this.showRight1 = false
						this.showRight2 = false
					} else {
						this.publicM.back1()
					}
				} else if(e.index==1){
					this.submit()
				}
			},
			submit(){
				if(!this.isPhone()){
					uni.showToast({
						title: '联系电话格式不正确',
						icon:"none"
					});
					return;
				}
				if(!this.payload.areaId){
					uni.showToast({
						title: '请选择区域地址',
						icon:"none"
					});
					return;
				}
				if(this.payload.address.length<2){
					uni.showToast({
						title: '详细地址需至少2个字符',
						icon:"none"
					});
					return;
				}
				if(!this.payload.itemId){
					uni.showToast({
						title: '请选择维修项目',
						icon:"none"
					});
					return;
				}
				if(this.payload.content.length<2){
					uni.showToast({
						title: '请填写故障描述，2-500字符',
						icon:"none"
					});
					return;
				}
				uni.showLoading({
					title:"提交中"
				})
				
				this.payload.imglist = this.payloadImgList.toString()
				console.log(this.payload)
				uni.request({
					url: this.config.zhhqUrl + "/repair/api/wap/repair/manage/publish/recordPublish",
					method:"POST",
					header:{
						Cookie: this.Cookie,
						'Content-Type':'application/x-www-form-urlencoded'
					},
					data:this.payload,
					success: (res) => {
						console.log(res)
						uni.hideLoading()
						uni.showToast({
							icon:"none",
							title:res.data.message
						})
						
					},
					fail: (err) => {
						console.log(err)
						uni.hideLoading()
						uni.showToast({
							icon:"none",
							title:"提交失败"
						})
					}
				})
			},
			getnavH(e){
				console.log(e)
				this.navH = e.height
				this.scrollH = uni.getSystemInfoSync().windowHeight - e.height
			},
			chooseImage() {
				if (this.imageList.length === 6) {
					return;
				}
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					sizeType: ['compressed'],
					count: 6 - this.imageList.length,
					success: (res) => {
						// this.imageList = this.imageList.concat(res.tempFilePaths);
						var files = res.tempFilePaths
						uni.showLoading({
							title:"上传中...",
							mask:true
						})
						for(var i=0; i<files.length; i++){
							console.log(files[i])
							uni.uploadFile({
								url: this.config.zhhqUrl + "/file/upload1",
								filePath:files[i],
								fileType:"image",
								name:"filename",
								formData:{
									system:"repair"
								},
								success: (res1) => {
									console.log(res1)
									var r = JSON.parse(res1.data)
									if(r.errorCode){
										return uni.showToast({
											icon:"none",
											title:r.message
										})
									}
									
									var hostPath = r.data.fileList[0].filePath
									var imgurl = "http://zhhq.hpu.edu.cn/image"+hostPath
									console.log(imgurl)
									this.imageList.push(imgurl);
									this.payloadImgList.push(hostPath);
									console.log(this.imageList.toString(),this.payloadImgList.toString())
								},
								fail: (err1) => {
									console.log(err1)
									uni.showToast({
										icon:"none",
										title:"上传失败"
									})
								}
							})
						}
						// uni.hideLoading()
					}
				})
			},
		}
	}
</script>

<style>
	.hight-light-box{
		color: #fff!important;
		background: #08cf86!important;
	}
	.litem{
		background: #fafafa;
		padding: 20rpx;
		box-sizing: border-box;
		text-align: center;
		height: 150rpx;
		font-size: 30rpx;
		word-break: break-all;
		border-bottom: 1px solid #f0f0f0;
		transition: ease 0.1s;
	}
	
	
	
	
	
	.phclass{
		color: #c8c8c8;
		height: auto;
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
		width: 25%;
	}
	.midta{
		width: 60%;
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
	.midta>textarea{
		width: 100%;
		font-size: 28upx;
	}
	.ta-item>view:nth-child(3){
		color: #9B9B9B;
		width: 5%;
		text-align: center;
	}

	
	
	.cell-pd {
		padding: 22upx 30upx;
	}
	.uploader-title{
		margin-left: 10upx;
		color: #1a1a1a;
	}
	.uni-uploader__input-box{
		border-radius: 16upx;
	}
	.uni-uploader__img{
		border-radius: 16upx;
	}
	.uni-uploader__file{
		position: relative;
		z-index: 1;
	}
	.deletepic{
		position: absolute;
		z-index: 2;
		width: 40upx;
		height: 40upx;
		display: flex;
		justify-content: center;
		align-items: center;
		right: 0;
		top: 0;
		background: rgba(0,0,0,0.6);
		border-radius: 0 16upx 0 0;
	}
	.deletepic>view{
		color: #FFFFFF;
	}
	
	
	.edit-tip{
		display: flex;
		flex-direction: row;
		width: 96%;
		justify-content: space-between;
		padding-bottom: 10upx;
	}
	.edit-tip view{
		margin-left: 20upx;
		font-size: 22upx;
		color: #9B9B9B;
	}
</style>
