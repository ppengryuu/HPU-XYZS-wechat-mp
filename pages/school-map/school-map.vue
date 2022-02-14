<template>
    <view>
		<navigation-custom :config="barConfig" @buttonTap="buttonTap"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<view class="options" v-if="!mapShow">
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listtext="'南校区'" @optiontap="southCampu"></option-list>
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listtext="'北校区'" @optiontap="northCampu"></option-list>
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
		</view>
        
		<map
			v-else
			id='map'
			ref='map'
			v-bind:style="{height: mapH + 'px'}"
			style="width: 100%;" 
			:latitude="latitude" 
			:longitude="longitude">
		</map>
		
    </view>
</template>

<script>
	const app = getApp()
	var QQMapWX = require('../../components/mi-map/qqmap-wx-jssdk.min.js')
	var qqmapsdk = new QQMapWX({
	  key: 'YPSBZ-XAOCO-QCYWD-SUF7V-LMMIK-CBBER'
	})
	import optionList from '../../components/option-list/option-list.vue';
    export default {
        components: {
			optionList,
		},
        data() {
            return {
                mapShow: false,
				mapH:0,
				longitude:0,
				latitude:0,
            }
        },
		computed:{
			barConfig(){
				return {
					title:"学校地图", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							text:"返回"
						}
					]
				};
			}
		},
        onLoad() {
			this.mapH = uni.getSystemInfoSync().windowHeight
        },
        methods: {
			buttonTap(e){
				if(e.index == 0 && !this.mapShow){
					this.publicM.back1()
				} else {
					this.mapShow = false
				}
			},
            // 打开地图
            openMap() {
                this.mapShow = true
            },
            // 更新地址并关闭地图
            updateAddress(addressObj) {
                this.mapShow = false
                this.positionObj = addressObj
            },
			southCampu(){
				this.longitude = 113.2657700000
				this.latitude = 35.1880700000
				this.mapShow = true
			},
			northCampu(){
				this.longitude = 113.2339000000
				this.latitude = 35.2413000000
				this.mapShow = true
			}
        }
    }

</script>

<style>
	.options{
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		width: 100%;
		position: absolute;
	}
</style>