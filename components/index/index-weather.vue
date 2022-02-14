<template>
	<view>
		<view class="partTitle u-f-ac">
			<view class="u-f-ac">
				<image src="../../static/icons/weather.png" mode="scaleToFill"></image>
			</view>
			<view>天气</view>
			
		</view>
		
		<view 
		style="width: 100%;height: 300rpx;color: #909090;" 
		class="u-f-ajc" 
		v-if="!weatherData"
		@tap="reloadData()"
		>
			{{loadingText}}
		</view>
		
		<view class="weather-part" v-else>
			<view class="wp-top">
				<view class="u-f-ac u-f-jsb">
					<view class="acc-loc">{{isSchoolWea?'河南理工大学':' '}}</view>
				</view>
				<view class="u-f-ac u-f-jsb">
					<view>{{weatherData.location.name}}</view>
					<view>{{weatherData.now.uptime.slice(8,10)+':'+weatherData.now.uptime.slice(10,12)+' 更新'}}</view>
				</view>
			</view>
			<view class="wp-mid">
				<view class="now-weather u-f-ac">
					<view class="weather-img">
						<view class="u-f-ajc" style="width: 100%;height: auto;">
							<image :src="'../../static/weather/'+weatherEn[weatherImgUrl(weatherData.now.text)]+'.png'" mode="widthFix" style="width: 50%;height: auto;"></image>
						</view>
						
						<view class="u-f-ajc">
							<view class="weather-name" style="word-break: break-all;">{{weatherData.now.text+' '+weatherData.now.temp+'℃'}}</view>
						</view>
					</view>
					<view class="now-weather-info">
						<view class="weather-feels-like" v-if="weatherData.now.pm25">PM2.5：{{weatherData.now.pm25}}</view>
						<view class="weather-rh">相对湿度：{{weatherData.now.rh+'%'}}</view>
						<view class="weather-rh">体感温度：{{weatherData.now.feels_like+'℃'}}</view>
						<view class="weather-wind">风力：{{weatherData.now.wind_dir+' '+weatherData.now.wind_class}}</view>
					</view>
				</view>
			</view>
			<view class="wp-middescribe u-f-ac" v-if="weatherData.now.describes">
				<block v-for="(d,m) in weatherData.now.describes" :key="m">
					<view class="desc-item-box" hover-class="d-hover" hover-stay-time="100" @tap="showDesc(m)">
						<view :class="'icon iconfont '+descIcons[m]"></view>
						<view>{{d.tipt}}</view>
						<view>{{d.zs}}</view>
					</view>
				</block>
			</view>
			<view class="wp-bot">
				<block v-for="(item,index) in weatherData.forecasts" :key="index">
					<view class="u-f-ac wea-list">
						<view class="f-weather-date">{{index==0?"今天":item.week}}</view>
						<view class="f-weather-name">
							{{item.text_day==item.text_night?item.text_day:item.text_day+'转'+item.text_night}}
						</view>
						<view class="f-weather-temp u-f-ajc">
							<image :src="'../../static/weather/'+weatherEn[weatherImgUrl(item.text_day)]+'.png'" mode="widthFix" style="width: 22%;height: auto;margin: 0 10rpx;"></image>
							<view>
								<text style="margin: 0 5rpx;">{{item.high}}</text>~
								<text style="margin: 0 5rpx;">{{item.low}}</text>℃
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		
		<view class="detailMask" v-if="showWeatherDetail" @tap="closeWeatherPop" @touchmove.prevent>
			<view class="detailPop animated zoomIn faster200" @tap.stop style="top:40%!important">
				<view class="detailTitle u-f-ajc">{{detailWeather.title}}</view>
				<view>{{detailWeather.des}}</view>
				<view class="closeButton u-f-ajc" hover-class="button-hover" hover-stay-time="100" @tap="closeWeatherPop"><view class="icon iconfont icon-guanbi"></view></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return{
				detailWeather:{},
				isSchoolWea:true,
				descIcons:[
					'icon-chuanyi',
					'icon-ganmaozhishu',
					'icon-yundong',
					'icon-jiadian_ziwaixian',
				],
				weatherData:false,
				weatherEn:Object,
				showWeatherDetail:false,
				loadingText:"天气信息加载中 ..."
			}
		},
		computed:{
			weatherImgUrl(s){
				return function(s){
					console.log(s)
					if(s){
						var c = s
						return c.split('转').length>1?c.split('转')[1]:c
					}
				}
			}
		},
		created() {
			this.weatherEn = this.publicM.weatherEnName
			this.wmInit()
		},
		methods:{
			reloadData(){
				this.loadingText = "天气信息加载中 ..."
				this.getWeather()
			},
			wmInit(){
				this.getWeather()
			},
			closeWeatherPop(){
				this.showWeatherDetail = false
			},
			showDesc(m){
				this.detailWeather = this.weatherData.now.describes[m]
				this.showWeatherDetail = true
			},
			async getWeather(){
				
				let [err,res] = await this.$http.get('/app/weather');
				console.log(res)
				if (!this.$http.errorCheck(err,res)){
					this.loadingText = "加载失败，点击重试"
					return;
				} 
				
				let t = res.data.data.result
				this.weatherData = t
				// console.log(t)
				
			},
			
		}
	}
</script>

<style scoped>
	.acc-loc{
		font-size: 35upx;
	}
	.d-hover{
		background: #EEEEEE!important;
	}
	.wp-middescribe{
		background: #FFFFFF;
		border-bottom: 1px solid #EEEEEE;
		margin: 0 30rpx;
	}
	.desc-item-box>view:first-child{
		font-size: 35upx!important;
		line-height: 2!important;
	}
	.desc-item-box>view:nth-child(2), .desc-item-box>view:nth-child(3){
		font-size: 24upx!important;
	}
	.desc-item-box>view{
		text-align: center;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.desc-item-box{
		border-left: 1px solid #EEEEEE;
		width: 25%;
	}
	.wp-middescribe>view:last-child{
		border-right: 1px solid #EEEEEE;
	}
	.wea-list{
		background: #FFFFFF;
		border: 1px solid #EEEEEE;
		border-top: none!important;
		box-sizing: border-box;
	},
	.wea-list>view{
		width: calc(100%/3);
		text-align: center;
		padding: 13rpx 0;
		box-sizing: border-box;
	}
	.wp-bot>view:last-child{
		border-radius: 0 0 8rpx 8rpx;
		/* margin-bottom: 100rpx; */
	}
	.wp-bot{
		margin: 0 30rpx;
	}
	.weather-img >image{
		
	}
	.weather-img{
		width: 55%;
	}
	.now-weather{
		margin: 0 30rpx;
		padding: 20rpx;
		border: 1px solid #EEEEEE;
		background: #FFFFFF;
		box-sizing: border-box;
		border-radius: 8rpx 8rpx 0 0;
	}
	.now-weather-info{
		width: 40%;
	}
	.now-weather-info>view{
		word-break: break-all;
	}
	.weather-part{
		
	}
	.wp-top{
		margin: 10rpx 40rpx;
	}
	
	.button-hover{
		background: #0093dc!important;
	}
	.closeButton{
		position: absolute;
		border-radius: 0 8upx 0 0;
		width: 60upx;
		height: 60upx;
		color: #FFFFFF;
		background: #00AAFF;
		right: 0;
		top: 0;
	}
</style>
