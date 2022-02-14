import $http from "./request.js";
import config from "./config.js";

export default {
	
	haveupdate:false,
	updateurl:false,
	webUrl:config.webUrl,
	
	__init(){
		// 退出登录时也会执行
		// console.log('config__init')
		// this.getAds()
		this.getconfig()
		// this.checkeusa()
	},
	
	async checkeusa(){
		let [err,res] = await $http.get('/app/config/eusaversion');
		// console.log(res)
		var eusaversion = res.data.data
		var old_eusaversion = uni.getStorageSync('eusaVersion')
		if(old_eusaversion){
			if(eusaversion == old_eusaversion){
				return;
			} else {
				uni.setStorageSync('eusaVersion',eusaversion)
				uni.setStorageSync('update-protocol',true)
			}
		} else {
			uni.setStorageSync('eusaVersion',eusaversion)
			uni.setStorageSync('update-protocol',false)
		}
	},
	
	async getconfig(){
		let [err,res] = await $http.get('/app/config/version'); 
		// console.log(res)
		var version = res.data.data
		var old_version = uni.getStorageSync('configVersion')
		if(old_version){
			if(version == old_version){
				return;
			} else {
				uni.setStorageSync('configVersion',version)
				this.updataConfig()
			}
		} else {
			uni.setStorageSync('configVersion',version)
			this.updataConfig()
		}
	},
	
	async updataConfig(data){
		let [err,res] = await $http.get('/app/config');
		console.log(res)
		var data = res.data.data
		uni.setStorageSync('imgReferer',data.img_referer)
		uni.setStorageSync('courseOnTime',data.course_on_time)
		uni.setStorageSync('courseOverTime',data.course_over_time)
		uni.setStorageSync('schoolwwAdjust',data.schoolww_adjust)
		uni.setStorageSync('semester',data.semester)
		
		// console.log(uni.getStorageSync('semester'))
		// console.log(uni.getStorageSync('imgReferer'))
		// console.log(config.imgReferer) 
	},
	
	async getAds(){
		let [err,res] = await $http.get('/adsense/0');
		// console.log(res.data.data)
		var data = res.data.data.list
		if(data.length==0&&uni.getStorageSync('adimgs')){
			uni.removeStorageSync('adimgs')
		}
		if(data.length==0&&uni.getStorageSync('adurls')){
			uni.removeStorageSync('adurls')
		}
		var adimgs = []
		var adurls = []
		for(var i=0;i<data.length;i++){
			if(data[i].src==null || data[i].url==null){
				continue;
			}
			adimgs.push(data[i].src)
			adurls.push(data[i].url)
		}
		uni.setStorageSync('adimgs',adimgs)
		uni.setStorageSync('adurls',adurls)
	}
}