<template>
	<view class="server-place">
		<map
			id='map'
			ref='map'
			v-bind:style="{height: mapH + 'px'}"
			style="width: 100%;" 
			:latitude="latitude" 
			:longitude="longitude"
			:controls='controls'
			@regionchange='mapChange'>
		</map>
		
		<view class="map-tools">
			
			<view class="my-location" @tap="toMyLocation">
				<image class="left" src="/static/icon.png" mode=""></image>
				<view class="right">
					<text class="title">我的位置</text>
					<text class="text">{{myAddress}}</text>
				</view>
			</view>
			
			<view class="start-place">
				<view class="place">
					<text class="title">{{tipText}}</text>
					<text class="text">{{addressObj.address}}</text>
				</view>
				<view class="tip">{{descText}}</view>
				<button @tap="submitAdress" class="sure" type="primary">确认选择</button>
			</view>
		</view>
	</view>
	
</template>

<script>
	const app = getApp()
	var QQMapWX = require('./qqmap-wx-jssdk.min.js')
	var qqmapsdk = new QQMapWX({
	  key: 'YPSBZ-XAOCO-QCYWD-SUF7V-LMMIK-CBBER'
	})
	export default {
		props: {
			tipText: {
				type: String,
				default: '选择位置'
			},
			descText: {
				type: String,
				default: '使用当前定位或在地图上标记位置'
			},
			// longitude:{ 
			// 	type:Number,
			// 	default:0 // 初始经度
			// },
			// latitude:{
			// 	type:Number,
			// 	default:0 // 初始纬度
			// },
		},
		data() {
			return {
				mapH: 0,             // 地图高度，可在initMapH()中设置高度
				longitude: 0,        
				latitude: 0,         
				myAddress: '',   	 // 初始地址信息
				addressObj: {        // 地图选点信息
					longitude: '',
					latitude: '',
					address: '请选择集合地点'
				},
				controls: [           // 地图中心点图标, 可更换iconPath, 详情见官方文档关于map组件的介绍
					{
						iconPath: '/static/map-controller.png',
						position: { 
							left: '50%',
							top: '50%',
							width: 20, 
							height: 20,
						},
						clickable: false
					}
				],
			};
		},
		mounted() {
			this.getLocation()
			this.initMapH()
		},
		methods:{
			// 查询现在的位置
			getLocation() {
				let this_ = this
				uni.getLocation({
					// type: 'gcj02', // 返回国测局坐标
					geocode: true,
					success: function(res) {
						this_.initMap(res)
						console.log(res);
					},
					fail: function(e) {
						uni.showToast({
							icon: 'none',
							title: '获取地址失败, 请检查是否开启定位权限~~'
						})
					}
				})
			},
			
			// 初始化我的位置
			async initMap(res) {
				this.longitude = res.longitude;
				this.latitude = res.latitude;
				this.myAddress = await this.getAddressName(res);
				
				this.addressObj = Object.assign({}, this.addressObj,{
					longitude: res.longitude,
					latitude: res.latitude,
					address: this.myAddress
				})
			},
			
			// 地图选择位置后 查询地点名称
			async checkMap(res) {
				this.addressObj = Object.assign({}, this.addressObj,{
					longitude: res.longitude,
					latitude: res.latitude,
					address: await this.getAddressName(res)
				})
				console.log(this.addressObj)
				console.log('当前位置:' + res.latitude + '|' + res.longitude);
			},
			
			// 监听地图位置变化
			mapChange(e) {
				console.log(e)
				let that = this
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					if (e.type == 'end') {
						that.mapCtx = uni.createMapContext('map', this)
						that.mapCtx.getCenterLocation({
							success: res => {
								console.log(res)
								this.checkMap(res)
							},
							fail: err => {
								console.log(err);
							}
						})
					}
				}, 200)
			},
			// 查询地图中心点的名称
			getAddressName(addressObj) {
				return new Promise((res) => {
						qqmapsdk.reverseGeocoder({
							location: {
								latitude: addressObj.latitude,
								longitude: addressObj.longitude
							},
							get_poi: 1,
							poi_options: "page_size=1;page_index=1",
							output: 'jsonp',
							success: (e) => {
								// console.log(e)
								res(e.result.formatted_addresses.recommend);
							},
							fail: err => {
								res(err);
							}
						})
				})
			},
			// 计算地图的高度
			initMapH() {
				this.mapH = uni.getSystemInfoSync().windowHeight - 210;
				// #ifdef APP-PLUS
					this.mapH = uni.getSystemInfoSync().windowHeight - 210;
				// #endif
				// #ifndef APP-PLUS
					this.mapH = uni.getSystemInfoSync().windowHeight - 170;
				// #endif
			},
			// 移动到我的位置
			toMyLocation() {
				this.getLocation()
			},
			// 提交
			submitAdress() {
				this.controls = []
				setTimeout(() => {
					this.$emit('updateAddress', this.addressObj)
				}, 100)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.server-place{
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		width: 100%;
		background: #ffffff;
		z-index: 999;
		.icon-img{
			width: 36px;
			height: 36px;
			display: block;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			margin-top: -70px;
		}
		.map-tools{
			position: fixed;
			width: 100%;
			bottom: 0rem;
			left: 0;
			padding-bottom: .5rem;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			.my-location{
				width: 90%;
				margin: 0 auto;
				height: 2.5rem;
				box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.2);
				background: #fff;
				border-radius: 0.5rem;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				overflow: hidden;
				.left{
					background: #3384ff;
					// flex: 20%;
					width: 2.5rem;
					height: 100%;
				}
				.right{
					font-size: 0.57rem;
					margin-left: .5rem;
					color: #111;
					// flex: 80%;
					display: flex;
					justify-content: center;
					align-items: flex-start;
					flex-direction: column;
					.text{
						width: 12rem;
						overflow: hidden;
						white-space:nowrap;
						text-overflow: ellipsis;
						color: #3384FF;
						margin-top: .3rem;
					}
				}
			}
			
			.start-place{
				width: 85%;
				margin: 0 auto;
				height: 5.5rem;
				margin: 0 auto;
				margin-top: .6rem;
				box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.2);
				background: #fff;
				border-radius: 0.5rem;
				padding: .5rem;
				.place{
					.title{
						font-size: 0.67rem;
						font-weight: bold;
						color: #111;
					}
					.text{
						font-size: 0.76rem;
						color: #3384FF;
						font-weight: bold;
						width: 12rem;
						vertical-align: middle;
						display: inline-block;
						margin-left: .5rem;
						overflow: hidden;
						white-space:nowrap;
						text-overflow: ellipsis;
					}
				}
				.tip{
					font-size: 0.57rem;
					color: #666;
					margin-top: .5rem;
				}
				.sure{
					margin-top: .5rem;
					color: #FFFFFF;
					background: #212121;
					font-weight: 600;
				}
				
			}
		}
	}
</style>
