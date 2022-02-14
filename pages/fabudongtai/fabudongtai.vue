<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>

		<view class="navborderbottom"></view>
		<view class="textview">
			<view class="textareaview">
				<textarea v-model="text" placeholder="发表一个想法..." class="textarea" auto-height="true" maxlength="500"/>
			</view>
			<view class="textlength">{{text.length}}/500</view>
		</view>
		
		<!-- 上传图片 -->
		<!-- <view class="list-pd">
			<view class="cell-pd">
				<view class="uni-uploader">
					<view class="uni-uploader-head">
						<view class="uploader-title">添加图片</view>
						<view class="uni-uploader-info">{{imageList.length}}/3</view>
					</view>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(image,index) in imageList" :key="index">
								<view class="uni-uploader__file">
									<view class="deletepic" @tap="delpic(index)">
										<view class="icon iconfont icon-guanbi"></view>
									</view>
									<image class="uni-uploader__img" :src="image" :data-src="image" mode="aspectFill" @tap="previewImage"></image>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-if="imageList.length<3">
								<view class="uni-uploader__input" @tap="chooseImage"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		
		
		
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
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 1,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 2,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				config:{
					title:"发布动态", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							text:"发布"
						}
					]
				}

			}
		},
		onLoad() {
			if(!this.User.token){
				return uni.navigateTo({
					url:"../user-login/user-login"
				})
			}
		},
		onShow() {
			
		},
		onBackPress(res) {
			// console.log(res)
			if(res.from=='backbutton'){
				uni.showModal({
					title: '提示',
					content: '放弃已编辑的内容吗？',
					showCancel: true,
					confirmText:"放弃",
					cancelText:"取消",
					success: res => {
						if(res.confirm){
							uni.navigateBack({
								delta:1
							})
						}
					},
				});
				return true;
			}
		},
		methods: {
			buttonTap(e){
				if(e.index == 0){
					if(this.text){
						uni.showModal({
							title: '提示',
							content: '放弃已编辑的内容吗？',
							showCancel: true,
							confirmText:"放弃",
							cancelText:"取消",
							success: res => {
								if(res.confirm){
									this.publicM.back1()
								}
							},
						});
					} else {
						this.publicM.back1()
					}
				} else if(e.index==1){
					if(!this.User.token){
						return uni.navigateTo({
							url:"../user-login/user-login"
						})
					}
					
					this.submit()
				}
			},
			// 发布
			async submit(){
				if(!this.text){return uni.showToast({title:"内容不能为空",icon:"none"})}
				uni.showLoading({ title: '发布中...', mask: true });
				try{
					let [err,res] = await this.$http.post('/post/create',{
						imglist:JSON.stringify([]),
						text:this.text,
						isopen:1,
						topic_id:1,
						post_class_id:1
					},{
						token:true,
						checkToken:true
					});
					// console.log(res)
					// 发布失败
					if (!this.$http.errorCheck(err,res)) {
						return uni.hideLoading();
					}
					// 发布成功
					uni.hideLoading();
					uni.showToast({
						title: '发布成功！'
					});
					uni.$emit('updateData',{ 
						type:"updateList",
						data:res.data.data.detail
					});
					uni.navigateBack({ delta: 1 });
					
				}catch(e){
					return;
				}
			},
			chooseImage: async function() {
				// #ifdef APP-PLUS
				// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
				if (this.sourceTypeIndex !== 2) {
					let status = await this.checkPermission();
					if (status !== 1) {
						return;
					}
				}
				// #endif
			
				if (this.imageList.length === 3) {
					return;
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 3 ? 3 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
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
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
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
			delpic(index){
				uni.showModal({
					title: '提示',
					content: '要删除该图片吗？',
					showCancel: true,
					success: res => {
						if(res.confirm){
							this.imageList.splice(index,1)
						}
					},
				});
			}
		}
	}
</script>

<style>
	.navborderbottom{
		width: 100%;
		position: fixed;
		margin-top: -2%;
		border-top: 1upx solid #EEEEEE;
	}
	.textview{
		width: 100%;
	}
	.textarea{
		color: #282828;
		font-size: 32upx;
		margin: 2%;
		width: 96%;
	}
	.textareaview{
		width: 100%;
	}
	.textlength{
		width: 96%;
		margin: 0 2%;
		text-align: right;
		right: 16upx;
		color: #B2B2B2;
	}
	.cell-pd {
		padding: 22upx 30upx;
	}
	.uploader-title{
		margin-left: 10upx;
		color: #BBBBBB;
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
</style>
