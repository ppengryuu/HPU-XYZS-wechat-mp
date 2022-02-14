

export default {
	
	
	cusNavOnlyBackDefaultConfig:{
		title:"关于", //title
		bgcolor:"#f8f8f8", //背景颜色
		fontcolor:'#0c0c0c',
		type:1, //type 1胶囊 2无胶囊模式
		buttons:[
			{
				iconfont:"icon-fanhui",
				text:"返回" 
			}
		], //当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
	},
	
	weatherEnName:{"中雨": "zhongyu", "中雪": "zhongxue", "冻雨": "dongyu", "多云": "duoyun", "大暴雨": "dabaoyu", "大雨": "dayu", "大雪": "daxue", "小雨": "xiaoyu", "小雪": "xiaoxue", "强沙尘暴": "qiangshachenbao", "扬沙": "yangsha", "晴": "qing", "暴雨": "baoyu", "暴雪": "baoxue", "沙尘暴": "shachenbao", "浮尘": "fuchen", "特大暴雨": "tedabaoyu", "阴": "yin", "阵雨": "zhenyu", "阵雪": "zhenxue", "雨夹雪": "yujiaxue", "雷阵雨": "leizhenyu", "雷阵雨伴有冰雹": "leizhenyubanyoubingbao", "雾": "wu", "霾": "mai"},
	
	back1(){
		uni.navigateBack({
			delta:1
		})
	},
	cusNavOnlyBack(e){
		console.log(e)
		if(e.index == 0){
			uni.navigateBack({
				delta:1
			})
		}
	},
	
	
	
}