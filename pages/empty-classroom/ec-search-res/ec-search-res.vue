<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>

		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		<view v-if="pageready" class="section-body" v-for="(item,m) in sections" :key="m">
			<view class="title">{{'第 '+item+' 小节'}}</view>
			<view class="classroom-body u-f">
				<block v-for="(eitem,n) in dataList" :key="n">
					<view class="classroom" v-if="eitem.section==item">{{simplifyd(eitem.classroom)}}</view>
				</block>
			</view>
		</view>
		<view style="height: 50upx;"></view>
	</view>
</template>

<script>
	import DateUtil from '../../../common/dateutil.js';
	export default {
		data() {
			return {
				sections:['1','2','3','4','5','6','7','8','9','10'],
				dataList:[],
				pageready:false,
				config:{
					title:"查询结果", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							text:"返回"
						}
					]
				}
				

			}
		},
		computed:{
			simplifyd(){
				return function(text){
					text = text.replace(/（.*）/g,"")
					text = text.replace(/\(.*\)/g,"")
					text = text.replace(/\(.*）/g,"")
					text = text.replace(/（.*\)/g,"")
					return text
				}
				
			}
		},
		onLoad(e) {
			uni.showLoading({title:"加载中"})
			console.log(e)
			this.getdata(e)
		},
		methods: {
			async getdata(e){
				let [err,res] = await this.$http.get('/user/getemptyclassroom',{
					campus:e.campus,
					building:e.building,
					schoolww:e.schoolww,
					week:e.week
				},{
					token:true,
					checkToken:true
				});
				// 请求失败处理
				// console.log(res)
				if (!this.$http.errorCheck(err,res)) return uni.hideLoading();
				var data = res.data.data
				this.dataList = data
				this.pageready = true
				uni.hideLoading()
			}
		}
	}
</script>

<style>
	.section-body{
		background: #FFFFFF;
		border: 2upx solid #e6e6e6;
		border-radius: 8upx;
		margin: 20upx;
		padding: 15upx 0;
		box-sizing: border-box;
	}
	.title {
		font-size: 35upx;
		padding-bottom: 15upx;
		text-align: center;
		border-bottom: 2upx solid #dcdcdc;
	}
	.classroom{
		margin: 5upx 15upx;
		border-bottom: 2upx dashed #dcdcdc;
		box-sizing: border-box;
	}
	.classroom-body{
		box-sizing: border-box;
		padding: 20upx;
		flex-wrap: wrap;
		width: 100%;
	}
</style>
