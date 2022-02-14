<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		
		<block v-for="(item, m) in data" :key="m">
			<view class="item-list" hover-class="il-hover" hover-stay-time="100" @tap="openDoc(item.url,m)">
				<view>{{item.name}}</view>
				<view class="u-f-ac u-f-jsb">
					<view>文件大小：{{getFileSize(item.size)}}</view>
					<view>文件类型：{{item.name.split(".").pop()}}</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:Array,
				config:{
					title:"公告文件", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						}
					]
				},
			}
		},
		computed:{
			getFileSize(s){
				return function(s){
					// console.log(s)
					var d = parseInt(s)
					return this.renderSize(d)
				}
			}
		},
		onLoad() {
			this.data = uni.getStorageSync("GGFilesTemp")
			uni.removeStorageSync("GGFilesTemp")
		},
		methods: {
			buttonTap(e){
				if(e.index == 0){
					this.publicM.back1()
				}
			},
			openDoc(url, m){
				// console.log(url.split(".").pop())
				uni.showLoading({
					title:"请求中",
					mask:true
				})
				const dtk = uni.downloadFile({
					url: url,
					success: function (res) {
						console.log(res)
						var filePath = res.tempFilePath
						console.log(filePath) 
						uni.showLoading({
							title:"打开中",
							mask:true
						})
						setTimeout(()=>{
							uni.openDocument({
								filePath: filePath,
								showMenu: true,
								success: function (res) {
									
								},
								complete: (e) => {
									console.log(e)
									uni.hideLoading()
								}
							})
						},800)
						
					}
				})
				dtk.onProgressUpdate(function(r){
					uni.showLoading({
						title:"下载中-"+r.progress+"%",
						mask:true
					})
				})
				uni.hideLoading()
			},
			renderSize(value){
			    if(null==value||value==''){
			        return "0 Bytes";
			    }
			    var unitArr = ["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"];
			    var index=0;
			    var srcsize = parseFloat(value);
			    index=Math.floor(Math.log(srcsize)/Math.log(1024));
			    var size =srcsize/Math.pow(1024,index);
			    size=size.toFixed(2);//保留的小数位数
			    return size+unitArr[index];
			}
		}
	}
</script>

<style>
	.item-list{
		background: #FFFFFF;
		padding: 20rpx 25rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #EEEEEE;
	}
	.item-list>view:nth-child(1){
		word-break: break-all;
		font-size: 30rpx;
	}
	.item-list>view:nth-child(2) view{
		font-size: 25rpx;
		color: #202020;
	}
	.il-hover{
		background: #EEEEEE;
	}
</style>
