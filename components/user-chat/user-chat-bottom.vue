<template>
	<view>
		<view class="user-chat-bottom animated slideInUp faster200" :style="{'padding-bottom': bottomheight}">
			<view class="inputcontent u-f-ac">
				<input type="text" placeholder="发表你的看法" v-model="text" confirm-hold="true" confirm-type="send" @confirm="submit" @tap="statuschange" cursor-spacing="20" @focus="getkeyboardinfo" @blur="keyboardhide"/>
				<view class="moresendbuttom u-f-ajc"  @tap="changeishow">
					<view :style="{background:isbuttompressed}" ><view class="icon iconfont icon-zengjia"></view></view>
				</view>
			</view>
			
			
			<view class="moresendfunc">
				<view class="tukuicon">
					<image src="../../static/userchat/tuku.png" mode="widthFix" @tap="choosepicFtuku"></image>
				</view>
				<view class="cameraicon">
					<image src="../../static/userchat/camera.png" mode="widthFix" @tap="choosepicFcam"></image>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import permision from "@/common/permission.js"
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		data() {
			return {
				text:"",
				bottomheight:"0",
				isbuttompressed:"#646464",
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 1,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 0,
				count: [1]
			}
		},
		methods:{
			getkeyboardinfo(data){
				// console.log(data.detail.height)
				this.$emit('keyboardH',data.detail.height)
			},
			keyboardhide(){
				this.$emit('keyboardH',0)
			},
			submit(){
				if(this.text.length==0){
					return;
				}
				this.$emit('submit',this.text,'text');
				this.text="";
			},
			changeishow(){
				// console.log("点了加号："+this.isshow)
				if(this.bottomheight=="0"){
					this.bottomheight="200upx"
					this.isbuttompressed="#232323"
					this.$emit('sendbottomH',this.bottomheight)
				}
				else{
					this.bottomheight="0"
					this.isbuttompressed="#646464"
					this.$emit('sendbottomH',this.bottomheight)
				}
			},
			statuschange(){
				if(this.bottomheight=="200upx"){
					this.bottomheight="0"
					this.isbuttompressed="#646464"
					this.$emit('sendbottomH',this.bottomheight)
				}
			},
			choosepicFtuku(){
				uni.chooseImage({
					sourceType: ['album'],
					sizeType: ['compressed'],
					count: 1,
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
						// console.log(this.imageList)
						this.$emit('submit',this.imageList[0],'img');
						this.imageList=[]
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
						'android.permission.READ_EXTERNAL_STORAGE');
			
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
			
				return status;
			},
			choosepicFcam(){
				uni.chooseImage({
					sourceType: ['camera'],
					sizeType: ['compressed'],
					count: 1,
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
						this.$emit('submit',this.imageList[0],'img');
						this.imageList=[]
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			}
		}
	}
</script>

<style scoped>
.moresendfunc{
	border-top: 1upx solid #EEEEEE;
	display: flex;
	/* background: #ff0000; */
	width: 96%;
	margin-left: 2%;
	height: 200upx;
}
.tukuicon image{
	margin-top: 61upx;
	width: 66upx;
	height: 66upx;
}
.cameraicon image{
	margin-top: 60upx;
	width: 80upx;
	height: 80upx;
}
.tukuicon,.cameraicon{
	/* background: #007AFF; */
	padding: 0 40upx;
	/* display: flex; */
	/* align-items: center; */
}
.tukuicon{
	margin-right: 40upx;
	margin-left: 20upx;
}
.moresendbuttom>view{
	font-size: 40upx;
	background: #646464;
	border-radius: 50%;
	color: #F8F8F8;
	height: 50upx;
	width: 50upx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
}
.user-chat-bottom{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100upx;
	padding: 0 10upx;
	background: #ffffff;
	border-top: 1upx solid #EEEEEE;
	transition: ease 0.2s;
}
.inputcontent>input{
	flex: 1;
	height: 70upx;
	padding: 0 20upx;
	margin: 20upx;
	border-radius: 10upx;
	background: #F7F7F7;
}
.inputcontent>view{
	width: 80upx;
	font-size: 45upx;
}
.displaynone{
	display: none;
}
</style>
