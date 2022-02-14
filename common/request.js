// 引入配置文件
import config from "./config.js";
import User from "./user.js";
export default{
	config:{
		baseUrl:config.webUrl,
		header:{
			'Content-Type':'application/json;charset=UTF-8',
			'Content-Type':'application/x-www-form-urlencoded'
		},
		data: {},
		method: "GET",
		dataType: "json",
	},
	request(options = {}){
		options.header = options.header || this.config.header;
		options.method = options.method || this.config.method;
		options.dataType = options.dataType || this.config.dataType;
		options.url = this.config.baseUrl+options.url;
		// TODO：token增加等操作
		if (options.token) {
			// 验证用户是否登录
			if (!this.checkToken(options.checkToken)) return;
			// 验证用户操作权限（验证是否绑定手机号码）
			if (!this.checkAuth(options.checkAuth)) return;
			options.header.token = User.token;
		}
		return uni.request(options);
	},
	get(url,data,options={}){
		options.url = url;
		options.data = data;
		options.method = 'GET';
		return this.request(options);
	},
	post(url,data,options={}){
		options.url = url;
		options.data = data;
		options.method = 'POST';
		return this.request(options);
	},
	// 上传图片
	upload(url,options = {}){
		options.url = this.config.baseUrl+url;
		options.header = options.header || this.config.header;
		options.fileType = options.fileType || "image";
		options.formData = options.formData || {};
		options.filePath = options.filePath;
		options.name = options.name;
		// TODO：token增加等操作
		if (options.token) {
			// 验证是否登录
			if (!this.checkToken(options.checkToken)) return;
			// 验证权限
			if (!this.checkAuth(options.checkAuth)) return; 
			options.header.token = User.token;
		}
		
		return uni.uploadFile(options);
	},
	// 错误处理
	errorCheck(err,res,errfun = false,resfun = false){
		if (err) {
			typeof errfun === 'function' && errfun();
			uni.showToast({ title: '加载失败',icon:"none" });
			// plus.nativeUI.toast("加载失败")
			return false;
		}
		if (res.data.errorCode) {
			typeof errfun === 'function' && resfun();
			uni.showToast({ title: res.data.msg,icon:"none" });
			// plus.nativeUI.toast(res.data.msg)
			return false;
		}
		return true;
	},
	// 验证用户是否登录
	checkToken(checkToken){
		if (checkToken && !User.token) {
			// plus.nativeUI.toast('请先登录')
			uni.showToast({ title: '请先登录', icon:"none" })
			uni.navigateTo({
				url: '/pages/user-login/user-login'
			});
			return false;
		}
		return true;
	},
	// 验证用户权限
	checkAuth(checkAuth){
		if (checkAuth && !User.schoolbind) {
			// plus.nativeUI.toast('请先绑定教务')
			uni.showToast({ title: '请先绑定教务', icon:"none" })
			uni.navigateTo({
				url: '/pages/bangding/jiaowu/jiaowu'
			});
			return false;
		}
		return true;
	}
}