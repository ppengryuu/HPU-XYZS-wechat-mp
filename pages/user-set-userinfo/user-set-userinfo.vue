<template>
	<view :style="{height:contentheight+'px'}">
		<navigation-custom :config="config" @buttonTap="buttonTap"/>

		<view class="ta-item">
			<view class="left-title">昵称</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="昵称" show-confirm-bar="false" v-model="username" cursor-spacing="0" placeholder-class="phclass"/>
			</view>
			<view><view class="icon iconfont icon-bianji"></view></view>
		</view>
		<view class="edit-tip"><view>* 最长7个字符 </view><view> {{username.length+'/7'}}</view></view>
		<view class="ta-item">
			<view class="left-title">性别</view>
			<view class="midta">
				<view class="u-f-ac" @tap="changeOne('sex')">
					<view>{{sexArr[sex]}}</view>
				</view>
			</view>
			<view><view class="icon iconfont icon-bianji"></view></view>
		</view>
		<view class="ta-item">
			<view class="left-title">生日</view>
			<view class="midta">
				<picker mode="date" :value="birthday" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="u-f-ac">
					<view class="birthday">{{birthday}}</view>
				</view>
				</picker>
			</view>
			<view><view class="icon iconfont icon-bianji"></view></view>
		</view>
		<view class="ta-item">
			<view class="left-title">情感</view>
			<view class="midta">
				<view class="u-f-ac" @tap="changeOne('qg')">
					<view>{{qgArr[qg]}}</view>
				</view>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="ta-item">
			<view class="left-title">家乡</view>
			<view class="midta">
				<view class="u-f-ac" @tap="showMulLinkageThreePicker">
					<view>{{pickerText}}</view>
				</view>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="ta-item">
			<view class="left-title">个人简介</view>
			<view class="midta">
				<input adjust-position="true" auto-height="true" maxlength="100" placeholder="介绍一下自己，让别人更了解你" show-confirm-bar="false" v-model="userresume" cursor-spacing="0" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji"></view>
		</view>
		<view class="edit-tip"><view>* 最长100个字符 </view><view> {{userresume.length+'/100'}}</view></view>
		
		
		
		<mpvue-city-picker themeColor="#00A0F0" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
		
		<image-cropper :cropFixed="true" cropWidth="300" cropHeight="300" :src="tempFilePath" @confirm="confirm" @cancel="cancel" :showResetBtn="false" :showRotateBtn="false"></image-cropper>
		
	</view>
</template>

<script>
	let sexArr=['秘密','男','女'];
	let qgArr=['秘密','单身','恋爱中'];
	import mpvueCityPicker from "../../components/mpvue-citypicker/mpvueCityPicker.vue";
	import ImageCropper from '../../components/invinbg-image-cropper/invinbg-image-cropper.vue';
	import imageCache from "../../components/image-cache/image-cache.vue";
	import tagSexAge from '../../components/common/tag-sex-age.vue';
	import Time from '../../common/time.js';
	export default {
		components:{
			mpvueCityPicker,
			ImageCropper,
			imageCache,
			tagSexAge
		},
		data() {
			return {
				sex:0,
				qg:0,
				job:"",
				birthday:"",
				sexArr:sexArr,
				qgArr:qgArr,
				userpic:'',
				username:'',
				userbgpic:'',
				userresume:"",
				usersignature:"",
				cityPickerValueDefault: [0, 0, 0],
				pickerText: '',
				contentheight:Number,
				showLengthTip:true,
				updatepic:true,
				tempFilePath: '',
				cropFilePath: '',
				config:{
					title:"修改资料", //title
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
				}

			}
		},
		onLoad() {
			console.log(this.User.userinfo)
			this.userpic = this.User.userinfo.userpic;
			this.userbgpic = this.User.userinfo.userbgpic;
			this.username = this.User.userinfo.username;
			this.usersignature = this.User.userinfo.userinfo.usersignature==null?'':this.User.userinfo.userinfo.usersignature;
			this.userresume = this.User.userinfo.userinfo.userresume==null?'':this.User.userinfo.userinfo.userresume;
			this.sex = this.User.userinfo.userinfo.sex || 0;
			this.qg = this.User.userinfo.userinfo.qg || 0;
			this.job = this.User.userinfo.userinfo.job || "未填写";
			this.birthday = this.User.userinfo.userinfo.birthday || "未填写";
			this.pickerText = this.User.userinfo.userinfo.path || "未填写";
			uni.getSystemInfo({
				success: (res) => {
					this.contentheight=res.screenHeight-uni.getSystemInfoSync().statusBarHeight-44
				}
			})
		},
		onBackPress() {
		  if (this.$refs.mpvueCityPicker.showPicker) {
		  	this.$refs.mpvueCityPicker.pickerCancel();
		    return true;
		  }
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.index==0){
				this.submit()
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			buttonTap(e){
				if(e.index ==0){
					this.publicM.back1()
				} else if (e.index == 1){
					this.submit()
				}
			},
			ubploadover(){
				this.ubploading=false
			},
			// 三级联动
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.pickerText = e.label;
			},
			// 修改生日
			bindDateChange(e) {
				this.birthday = e.target.value
			},
			upload() {
				// var opath
				// plus.gallery.pick(function(res){
				// 	plus.zip.compressImage({
				// 		src:res,
				// 		format:'png',
				// 		dst:"_documents/userpic.png",
				// 		overwrite:true,
				// 		quality:80
				// 	},function(zrea){
				// 		this.tempFilePath = "_documents/userpic.png"
				// 		console.log(zrea.target)
				// 	})
				// })
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
					}
				});
				
				
			},
			confirm(e) {
				this.tempFilePath = ''
				this.cropFilePath = e.detail.tempFilePath
				this.changeimg()
			},
			cancel() {
				console.log('canceled')
			},
			// 修改头像
			async changeimg(){
				return; // 暂不开启
				// let [err1,res1] =await uni.chooseImage({
				// 	count:1,
				// 	sizeType:['compressed']
				// });
				// await this.compressImage(res.tempFilePaths[0],"temp/userpic.jpg");
				if (!this.cropFilePath) return;
				// 上传
				this.updatepic = false
				uni.showLoading({ title: '上传中...', mask: true });
				let [err2,res2] = await this.$http.upload('/edituserpic',{
					name: 'userpic',
					filePath: this.cropFilePath ,
					token:true,
					checkToken:true
				});
				// 请求失败
				var res = JSON.parse(res2.data)
				console.log(res)
				// if (!this.$http.errorCheck(err2,res2)) return uni.hideLoading();
				// this.userpic = res1.tempFilePaths[0];
				// 修改状态，存储
				this.User.userinfo.userpic = res.data;
				uni.setStorageSync("userinfo",this.User.userinfo);
				// console.log(res.data)
				// 成功
				plus.downloader.clear()
				var dtask = await plus.downloader.createDownload( res.data, {}, function(d, status){
					// 下载完成
					if(status == 200){ 
						// console.log(d.filename)
						uni.setStorage({
						    key:res.data,
						    data:d.filename,
						    success:function(){
								
						    }
						})
						// console.log("Download success: " + d.filename);
					} else {
						plus.nativeUI.toast('修改头像失败 '+status);
					}  
				});
				dtask.setRequestHeader('Referer', uni.getStorageSync('imgReferer'))
				dtask.start(); 
				this.userpic = res.data
				await uni.$emit('userpicChange',{newpic:res.data})
				// plus.nativeUI.toast('修改头像成功');
				setTimeout(()=>{
					uni.hideLoading();
					this.updatepic =true
				},3000)
			},
			// 1
			// 单列选择
			changeOne(val){
				let arr=[];
				switch (val){
					case 'sex':
					arr=sexArr;
						break;
					case 'qg':
					arr=qgArr;
						break;
					case 'job':
					arr=job;
						break;
				}
				uni.showActionSheet({
					itemList: arr,
					success: res => {
						switch (val){
							case 'sex':
							this.sex=res.tapIndex;
								break;
							case 'qg':
							this.qg=res.tapIndex;
								break;
							case 'job':
							this.job=arr[res.tapIndex];
								break;
						}
					},
				});
			},
			// 完成
			async submit(){
				let data = {
					name:this.username,
					userresume:this.userresume,
					usersignature:null,
					sex:this.sex,
					qg:this.qg,
					job:this.job,
					birthday:this.birthday,
					path:this.pickerText,
					age:Time.gettime.getAgeByBirthday(this.birthday),
				};
				let [err,res] = await this.$http.post('/edituserinfo',data,{
					token:true,
					checkToken:true
				});
				// 请求失败处理
				// console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				// 成功
				uni.$emit('userinfoChanged',{data:data})
				uni.showToast({ title: '修改成功！' });
				// 修改状态，缓存
				this.User.userinfo.username = this.username;
				this.User.userinfo.userinfo = data;
				uni.setStorageSync('userinfo',this.User.userinfo);
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>

<style>
@import "../../common/form.css";
	.phclass{
		color: #c8c8c8;
	}
	.edit-tip{
		display: flex;
		flex-direction: row;
		width: 96%;
		justify-content: space-between;
	}
	.edit-tip view{
		margin-left: 20upx;
		font-size: 22upx;
		color: #9B9B9B;
	}
	.birthday{
		margin-right: 20upx;
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
		width: 20%;
	}
	.midta{
		width: 65%;
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
</style>
