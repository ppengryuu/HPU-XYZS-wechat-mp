<template>
	<view>
		<view :class="scrollTop<=0?'schoolNameShow':'schoolNameHide'">
			<text :style="{color:titleFontColor}">河南理工大学</text>
		</view>
		
		<view  @tap="setting" >
			<view class="top-background">
				<image :style="{opacity:bgLoaded?1:0}" :src="bgPath" mode="aspectFill" @error="bgLoadError" @load="bgLoadOk"></image>
				<view class="partTitle u-f-ac">
					<view class="u-f-ac">
						<image src="../../static/icons/jinri.png" mode="scaleToFill"></image>
					</view>
					<view>今天</view>
					
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			scrollTop:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				bgPath:"../../static/school/index_title_img.jpg",
				titleFontColor:"white",
				bgLoaded:false
			};
		},
		created() {
			this.cmInit()
		},
		methods:{
			cmInit(){
				var bgPath = uni.getStorageSync('indexBgPath')
				if(bgPath){ this.bgPath = bgPath }
				var ifc = uni.getStorageSync('indexTitleFontColor')
				if(ifc){ this.titleFontColor = ifc }
			},
			setting(){
				uni.showActionSheet({
					itemList:['自定义背景','默认背景','文字颜色：黑','文字颜色：白'],
					success: (res) => {
						if(res.tapIndex==0){
							this.chooseimg()
						} else if(res.tapIndex==1){
							var sto = uni.getStorageSync("indexBgPath")
							if(sto){
								uni.removeStorage({
									key:'indexBgPath'
								})
								this.bgLoaded = false
								uni.showLoading({
									title:"加载中"
								})
								this.bgPath = '../../static/school/index_title_img.jpg'
								uni.removeSavedFile({
									filePath: sto
								})
							}
						} else if(res.tapIndex==2){
							this.titleFontColor = 'black'
							uni.setStorageSync('indexTitleFontColor','black')
						} else if(res.tapIndex==3){
							this.titleFontColor = 'white'
							uni.setStorageSync('indexTitleFontColor','white')
						} 
					}
				})
			},
			chooseimg(){
				uni.chooseImage({
					count:1,
					sizeType:['compressed'],
					sourceType:['album'],
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
									filePath:this.bgPath
								})
								
								uni.saveFile({
									tempFilePath: stimg,
									success: (res1) => {
										uni.setStorageSync('indexBgPath',res1.savedFilePath)
										this.bgLoaded = false
										uni.showLoading({
											title:"加载中"
										})
										this.bgPath = uni.getStorageSync('indexBgPath')
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
					},
					fail: (err) => {
						// uni.showToast({
						// 	title:err.errMsg,
						// 	icon:"none"
						// })
					}
				});
			},
			bgLoadOk(){
				this.bgLoaded = true
				uni.hideLoading()
			},
			bgLoadError(){
				uni.showToast({title:"自定义背景图片加载失败",icon:"none"})
				uni.removeStorageSync('indexBgPath')
				this.bgPath = '../../static/school/index_title_img.jpg'
			},
		}
	}
	
	
</script>

<style scoped>
	.top-background{
		width: 100%;
		height: 500upx;
		position: relative;
		z-index: -1;
	}
	.top-background>image{
		width: 100%;
		height: 500upx;
	}
	.partTitle {
		box-sizing: border-box;
		background: linear-gradient(rgba(243,246,248, 0), rgba(243,246,248, 1));
		width: 100%;
		height: 120upx;
		padding-left: 10rpx;
		position: absolute;
		bottom: 0rpx;
	}
	.partTitle>view>image{
		height: 60rpx;
		width: 60rpx;
	}
	.partTitle>view{
		margin-left: 20upx;
		font-size: 45rpx;
		color: #282828;
	}
	.schoolNameShow{
		position: absolute;
		font-size: 45upx;
		opacity: 1;
		top: 140upx;
		left: 40upx;
		transition: linear 0.2s; 
	}
	.schoolNameHide{
		position: absolute;
		font-size: 43upx;
		opacity: 0;
		top: 140upx;
		left: 40upx;
		transition: linear 0.2s; 
	}
</style>
