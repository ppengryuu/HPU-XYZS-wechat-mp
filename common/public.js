var easydate = require("./easydate.js")
import DateUtil from "./dateutil.js"

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
	
	screenWidth:Number,
	screenHeight:Number,
	schoolww:Number,
	coursesObject:{},
	
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
	sleep(time) {
	    var startTime = new Date().getTime() + parseInt(time, 10);
	    while(new Date().getTime() < startTime) {}
	},
	__init(){
		uni.removeStorageSync("timetable")
		this.screenHeight = uni.getSystemInfoSync().screenHeight
		this.screenWidth = uni.getSystemInfoSync().screenWidth
		
		this.initAppConfig()
	},
	initAppConfig(){
		this.schoolww = this.calcSchoolww()
		
	},
	
	calcSchoolww(){
		var semeInfo = uni.getStorageSync("semester")
		var firstDay = semeInfo.firstDay
		
		const firstday = easydate(firstDay)
		console.log("学期正式上课第一天："+firstday.date)
		
		const caclStart = firstday.clone().calc("day", -1)
		console.log("学期正式上课前一天："+caclStart.date)
		
		const nowdate = easydate()
		console.log("现在的日期："+nowdate.date)
		
		if(!nowdate.isAfter(caclStart)){
			console.log("还未正式上课, 学校周为0")
			return 0
		}
		
		var daysBetween = caclStart.diff(nowdate, "day")
		console.log("从开始正式上课前一天到现在已经"+daysBetween+"天了")
		
		var schoolww = Math.ceil(daysBetween/7)
		console.log("现在学校周是第"+schoolww+"周")
		
		return schoolww
	},
	
	formatTimeTable(returnObject, returnSingleSection) {
		var data = uni.getStorageSync("timeTable")
		if(!data) return false;
		
		var schoolww = this.schoolww
		    
		// 将数据改为字典类型, key为课程id, value为课程Object
		var coursesObject = {}
		data.forEach(element => {
			var id = element.id
			coursesObject[id] = element
		});
		
		if(returnObject){
			return coursesObject
		}
		
		this.coursesObject = coursesObject
	
		// 将课程拆分为单节
		var courseList = []
		for(var key in coursesObject){
			var sectionArr = coursesObject[key].sections.split(",").map(Number)
			sectionArr.forEach(a => {
				courseList.push({
					weekday:coursesObject[key].weekday,
					section:a,
					id:key
				})
			})
		}
		
		if(returnSingleSection){
			return courseList
		}
	
	
		// 合并同小节课
		var res1 = []
		courseList.forEach(c => {
			let d = res1.find(e => {
				return c.weekday==e.weekday&&c.section==e.section
			})
			if(!d){
				res1.push({
					weekday:c.weekday,
					section:c.section,
					ids:[c.id]
				})
			} else {
				d.ids.push(c.id)
			}
		})
	
		// console.log(res1)
	
		// 合并相同课前后节
		var res2 = []
		res1.forEach(e => {
			let f = res2.find(g => {
				return g&&e.weekday==g.weekday&&e.ids.sort().toString()==g.ids.sort().toString()&&this.isContinuationInteger(g.sections.concat([e.section]))
			})
			if(!f){
				res2.push({
					weekday:e.weekday,
					sections:[e.section],
					// color:true,
					ids:e.ids,
				})
			} else {
				f.sections.push(e.section)
				f.sections.sort(this.lsy)
			}
		})
		console.log("publicM -> formatTimetable() 结果: ")
		console.log(res2)
		return res2
	},
	
	ArrayInterSets(arr1,arr2) {
	    var arr3 = arr2.filter(function(v){
	        return arr1.indexOf(v)!==-1 // 利用filter方法来遍历是否有相同的元素
	    })
	    return arr3
	},
	
	isContinuationInteger(array){
	    array = array.sort(this.lsy)
	    var a = array.length
	    // console.log(array)
	    if(array[a-1]-array[0] == a-1) return true;
	    else return false;
	},
	
	lsy(a, b) {
	    return a - b //a-b返回的是小的在前 相反b-a是大的在前
	},
	
}