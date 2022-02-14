const dateutil = {	
	
	// 毫秒值转日期格式
    formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
         
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
         
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
            }
        }
        return fmt;
    },
 
    padLeftZero(str) {
		return ('00' + str).substr(str.length);
    },
	
	// 获取现在时刻的日期，星期几，时分秒
	getTime(type){
	        let date = new Date(),
	        currentDate,
	        currentTime,
	        seperator = "-", // 如果想要其他格式 只需 修改这里 
	        year = date.getFullYear(),
	        month = date.getMonth() + 1,
	        weex = date.getDay(),
	        day = date.getDate(),
	        hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
	        minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
	        second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	        month >= 1 && month <= 9 ? (month = "0" + month) : "";
	        day >= 0 && day <= 9 ? (day = "0" + day) : "";
	          //当前 日期
	         currentDate = year + seperator + month + seperator + day;
	          //当前 时间
	         currentTime = hour + ":" + minute + ":" + second;
	          // 输出格式 为 2018-8-27 14:45:33
	         // console.log(currentDate +" "+ currentTime);
	        
	         if(type==0){
	             return currentDate
	         }
	         else if(type==1){
	             return currentTime;
	         }
	         else if(type==2){
	             if(weex==1){
	                 return '星期一'
	             }if(weex==2){
	                 return '星期二'
	             }if(weex==3){
	                 return '星期三'
	             }if(weex==4){
	                 return '星期四'
	             }if(weex==5){
	                 return '星期五'
	             }if(weex==6){
	                 return '星期六'
	             }if(weex==7){
	                 return '星期日'
	             }
	         }
	         else{
	            return currentDate+" "+ currentTime;
	         }
	},
	
	/**
	 * 判断年份是否为润年
	 *
	 * @param {Number} year
	 */
	isLeapYear(year) {
	    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
	},
	/**
	 * 获取某一年份的某一月份的天数
	 *
	 * @param {Number} year
	 * @param {Number} month
	 */
	getMonthDays(year, month) {
	    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (this.isLeapYear(year) ? 29 : 28);
	}, /**
	 * 获取某年的某天是第几周
	 * @param {Number} y
	 * @param {Number} m
	 * @param {Number} d
	 * @returns {Number}
	 */
	getWeekNumber(y,m,d) {
	    var now = new Date(y, m - 1, d),
	        year = now.getFullYear(),
	        month = now.getMonth(),
	        days = now.getDate();
	    //那一天是那一年中的第多少天
	    for (var i = 0; i < month; i++) {
	        days += this.getMonthDays(year, i);
	    }
	
	    //那一年第一天是星期几
	    var yearFirstDay = new Date(year, 0, 1).getDay() || 7;
	
	    var week = null;
	    if (yearFirstDay == 1) {
	        week = Math.ceil(days / yearFirstDay);
	    } else {
	        days -= (7 - yearFirstDay + 1);
	        week = Math.ceil(days / 7) + 1;
	    }
	
	    return week;
	}
}


export default{
	dateutil
}