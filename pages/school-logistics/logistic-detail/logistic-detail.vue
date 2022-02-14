<template>
	<view>
		<navigation-custom :config="barConfig" @buttonTap="buttonTap"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<view  v-if="dataReady">
			<view class="mini-title">报修详情</view>
			<view class="info-detail">
				<view>报修时间：{{itemInfo.date}}</view>
				<view>区域地址：{{itemInfo.area+"-"+itemInfo.address}}</view>	
				<view>维修项目：{{itemInfo.item}}</view>
				<view>联系电话：{{htmlData.telNum}}</view>
				<view>承修单位：{{itemInfo.repairDept+"-"+itemInfo.repairer}}</view>				
				<view>故障描述：{{itemInfo.content}}</view>
			</view>
			
			<view class="content-images">
				<view v-for="(item,index) in htmlData.imgList" :key="index">
					<image :src="item" :data-src="item" mode="aspectFill" :style="{width:imgsideLen+'px', height:imgsideLen+'px', margin: index%3==1?'0 10rpx':''}" @tap="previewImage"></image>
				</view>
			</view>
			
			<view class="mini-title">报修进程</view>
			<block v-for="(i, n) in htmlData.flowTitleHtml.length" :key="n">
				<view class="flow-time-list" :style="{'border-top': n==0?'1px solid #EEEEEE':''}">
					<view v-html="htmlData.flowTitleHtml[n]"></view>
					<view v-html="htmlData.flowInfoHtml[n]"></view>
				</view>
			</block>
		</view>
		
		<view style="height: 300rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Cookie:"",
				dataReady:false,
				// sessionData:Object,
				itemInfo:Object,
				imgsideLen:Number,
				barConfig:{
					title:"报修详情", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							text:"撤回"
						}
					]
				},
				htmlData:{
					imgList:[],
					telNum:"",
					flowTitleHtml:[],
					flowInfoHtml:[]
				}
			}
		},
		onLoad() {
			uni.showLoading({
				title:"加载中"
			})
			var item = uni.getStorageSync("logisticsTempData")
			this.itemInfo = item
			uni.removeStorageSync("logisticsTempData")
			this.Cookie = uni.getStorageSync("zhhqSessionData").session
			
			this.ImgSideLen()
			var id = item.id
			console.log(id)
			this.getDetail(id)
		},
		methods: {
			previewImage(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.htmlData.imgList
				})
			},
			ImgSideLen(){
				var screenWidth = uni.getSystemInfoSync().screenWidth
				this.imgsideLen = (screenWidth-uni.upx2px(20)*3)/3
			},
			getDetail(id){
				uni.request({
					url: this.config.zhhqUrl + "/repair/wapRedirect/wap/my/repair/details/"+id,
					method:"GET",
					header:{
						Cookie: this.Cookie
					},
					success: (r) => {
						console.log(r)
						var htmltext = r.data.replace(/\n/g, "")
						htmltext = htmltext.replace(/>\s*</g, "><")
						var imgDiv = htmltext.match(/<div class="img_list">.*?class="min"\/><\/div>/g)
						var telNumOri = htmltext.match(/href="tel:.*?"/g)
						var flowTitle = htmltext.match(/<span class="h-state">.*?<\/span>/g)
						var flowInfo = htmltext.match(/<div class="h-details time_state">.*?<\/p><\/div><\/div>/g)
						
						var imglist = []
						if(imgDiv){
							var imgOriList = imgDiv[0].match(/http.*?"/g)
							for(var i=0; i<imgOriList.length; i++){
								imglist.push(imgOriList[i].slice(0,-1))
							}
							console.log(imglist)
						}
						
						var telnum = telNumOri[0].match(/-?[1-9]\d*/)
						this.htmlData.imgList = imglist
						this.htmlData.telNum = telnum
						this.htmlData.flowTitleHtml = flowTitle
						this.htmlData.flowInfoHtml = flowInfo
						this.dataReady = true
						uni.hideLoading()
					}
				})
			},
			buttonTap(e){
				if(e.index==0){
					this.publicM.back1()
				} else if(e.index==1){
					uni.showModal({
						title:"提示",
						content:"确定撤回该报修吗？",
						success: (res) => {
							if(res.confirm){
								this.withDrawal()
							}
						}
					})
				}
			},
			withDrawal(){
				uni.showLoading({
					title:"加载中"
				})
				uni.request({
					method:"POST",
					url: this.config.zhhqUrl + "/repair/api/wap/repair/manage/publish/withdrawalBaseInfo",
					header:{
						Cookie: this.Cookie,
						'Content-Type':'application/json;charset=UTF-8',
						'Content-Type':'application/x-www-form-urlencoded'
					},
					data:{
						infoId: this.itemInfo.id
					},
					success: (res) => {
						uni.hideLoading()
						if(res.data.errorCode){
							return uni.showToast({
								icon:"none",
								title:res.data.message
							})
						} else {
							uni.$emit("updateLodisticsList",{code:1})
							return uni.showToast({
								icon:"none",
								title:"撤回成功"
							})
						}
					},
					fail: (err) => {
						uni.hideLoading()
						return uni.showToast({
							icon:"none",
							title:"请求失败"
						})
					}
				})
			}
		}
	}
</script>

<style>
	.h-state{
		color: #00A075;
		font-size: 32rpx;
	}
	.flow-time-list{
		background: #fff;
		padding: 20rpx 25rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #EEEEEE;
	}
	
	.content-images>view>image{
		border-radius: 12rpx;
	}
	.content-images>view{
		box-sizing: border-box;
	}
	.content-images{
		margin: 20rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.info-detail>view{
		padding: 10upx 30upx;
		border-top: 1upx dashed #e4e4e4;
		color: #323232;
		word-break: break-all;
	}
	.info-detail>view:last-child{
		border-bottom: 1upx dashed #e4e4e4;
	}
	.mini-title{
		color: #323232!important;
		font-size: 36upx;
		text-align: center;
		box-sizing: border-box;
		padding: 20upx 0 10upx 0;
	}
</style>
