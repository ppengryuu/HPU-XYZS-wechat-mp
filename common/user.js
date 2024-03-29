import $http from "./request.js";
import $message from "./message.js";
import appconfig from "./appconfig.js";
import publicM from "./public.js";

export default {
	// 用户token 测试token：4cd36bf70649475ac0cd6fae78250954474a4350
	token:false,
	// 用户信息
	userinfo:false,
	// 用户手机号
	phone:false,
	// 用户邮箱
	email:false,
	// 用户相关统计
	counts:{},
	// 绑定第三方登录情况
	userbind:false,
	// 绑定学号
	schoolbind:false,
	// 图书馆绑定
	libbind:false,
	// 登录成功是否重新加载课程表成绩
	reloadData:true,
	// 初始化
	__init(){
		// 获取用户信息
		this.phone = uni.getStorageSync("phone");
		this.email = uni.getStorageSync("email");
		this.userinfo = uni.getStorageSync("userinfo");
		this.schoolbind = uni.getStorageSync("schoolbind");
		this.libbind = uni.getStorageSync("libbind");
		this.token = uni.getStorageSync("token");
		this.counts = uni.getStorageSync("counts");
		this.userbind = uni.getStorageSync("userbind");
		// if (this.userinfo.id) {
		// 	// 连接socket
		// 	$message.Open();
		// }
		this.OnUserCounts();
	},
	// 权限验证跳转
	navigate(options,type = "navigateTo"){
		// 是否登录验证
		if (!$http.checkToken(true)) return;
		// 验证是否绑定手机号
		if (!$http.checkAuth(true)) return;
		// 跳转
		switch (type){
			case "navigateTo":
			uni.navigateTo(options);
				break;
			case "redirectTo":
			uni.redirectTo(options);
				break;
			case "reLaunch":
			uni.reLaunch(options);
				break;
			case "switchTab":
			uni.switchTab(options);
				break;
		}
	},
	// 验证码验证,更新token
	async checkCode(options={}){
		uni.showLoading({ title: '验证中...', mask: true });
		// 请求服务器
		let [err,res] = await $http.post("/user/phonelogin",options.data);
		// 验证失败
		if (!$http.errorCheck(err,res)){
			uni.hideLoading();
			uni.showToast({title:'验证失败',icon:'none'})
			return false;
		}
		// 验证成功 更新用户状态
		this.token = res.data.data.token;
		this.phone = res.data.data.phone;
		this.email = res.data.data.email;
		this.userinfo = this.__formatUserinfo(res.data.data);
		this.schoolbind = res.data.data.schoolbind;
		// 本地存储
		uni.setStorageSync("userinfo",this.userinfo);
		uni.setStorageSync("schoolbind",this.schoolbind);
		uni.setStorageSync("token", this.token);
		uni.setStorageSync("phone", this.phone);
		uni.setStorageSync("email", this.email);
		// 获取用户相关统计
		// await this.getCounts();
		// 连接socket
		// 成功提示
		uni.showToast({title:'验证成功',icon:'none'})
		uni.hideLoading();
		return true;
	},
	// 微信小程序端微信登录
	async wxlogin(options ={}){
		uni.showLoading({ title: '登录中...', mask: true });
		appconfig.__init();
		uni.login({
			provider: 'weixin',
			success: (res) => {
				console.log(JSON.stringify(res))
				console.log('login success:', res);
				
				uni.getUserInfo({
				  provider:'weixin',
				  lang:"zh_CN",
				  success: async (infoRes)=> {
					console.log(infoRes)
					let userinfo = infoRes.userInfo
					let [err1,res1] = await $http.post('/wxlogin2',{
						code:res.code,
						nickName:userinfo.nickName,
						avatarUrl:userinfo.avatarUrl,
						sex:userinfo.gender,
						path:userinfo.province+'-'+userinfo.city,
					});
					if(!$http.errorCheck(err1,res1)){
						return false;
					}
					// console.log('登录res:'+JSON.stringify(res1))
					// let result = res1.data.data
					// console.log(result)
					// 登录成功 保存状态
					// 登录成功 保存状态
					console.log(res1)
					this.token = res1.data.data.token;
					this.phone = res1.data.data.phone;
					this.email = res1.data.data.email;
					this.userinfo = this.__formatUserinfo(res1.data.data);
					this.schoolbind = res1.data.data.schoolbind;
					this.libbind = res1.data.data.libbind;
					// 本地存储
					uni.setStorageSync("userinfo",this.userinfo);
					uni.setStorageSync("schoolbind",this.schoolbind);
					uni.setStorageSync("libbind",this.libbind);
					uni.setStorageSync("token", this.token);
					uni.setStorageSync("phone", this.phone);
					uni.setStorageSync("email", this.email);
					// 获取用户相关统计
					// await this.getCounts();
					// 是否获取课程表等
					if (res1.data.data.schoolbind){
						await this.getSchoolBindData()
					}
					if (res1.data.data.libbind){
						await this.getLibBindData()
					}
					// 连接socket
					// 成功提示
					uni.showToast({
						title:"登录成功",
						icon:"none"
					})
					uni.$emit('logindone')
					uni.navigateBack({ delta: 1 });
				  },
				  complete: () => {
				  	uni.hideLoading()
				  }
				});
				// 更新保存在 store 中的登录状态 
				console.log('登录成功，保存到本地存储，修改当前用户登录状态')
			},
			fail: (err) => {
				console.log('login fail:', err);
				uni.showToast({
					title:err.errMsg,
					icon:"none"
				})
			}
		});
	},
	// 登录
	async login(options ={}){
		appconfig.__init();
		uni.showLoading({ title: '登录中...', mask: true });
		// 请求登录
		let [err,res] = await $http.post(options.url,options.data);
		// 登录失败
		if (!$http.errorCheck(err,res)){
			// uni.hideLoading();
			return;
		}
		// 登录成功 保存状态
		console.log(res)
		this.token = res.data.data.token;
		this.phone = res.data.data.phone;
		this.email = res.data.data.email;
		this.userinfo = this.__formatUserinfo(res.data.data);
		this.schoolbind = res.data.data.schoolbind;
		this.libbind = res.data.data.libbind;
		// 本地存储
		uni.setStorageSync("userinfo",this.userinfo);
		uni.setStorageSync("schoolbind",this.schoolbind);
		uni.setStorageSync("libbind",this.libbind);
		uni.setStorageSync("token", this.token);
		uni.setStorageSync("phone", this.phone);
		uni.setStorageSync("email", this.email);
		// 获取用户相关统计
		// await this.getCounts();
		// 是否获取课程表等
		if (res.data.data.schoolbind){
			await this.getSchoolBindData()
		}
		if (res.data.data.libbind){
			await this.getLibBindData()
		}
		// 连接socket
		// 成功提示
		uni.hideLoading();
		uni.showToast({
			title:"登录成功",
			icon:"none"
		})
		uni.$emit('logindone')
		// 返回上一步
		if (!options.Noback) {
			uni.navigateBack({ delta: 1 });
		}
		return true;
	},
	// 退出登录
	async logout(showToast = true){
		// 退出登录
		uni.showLoading({ title: '退出登录...' , mask : true});
		await $http.post('/user/logout',{},{ 
			token:true,
			checkToken:true ,
		});
		// 清除缓存
		// uni.clearStorageSync()
		uni.clearStorage()
		uni.getSavedFileList({
			success: (e) => {
				for(var t=0;t<e.fileList.length;t++){
					uni.removeSavedFile({
						filePath: e.fileList[t].filePath
					})
				}
			}
		})
		// uni.removeStorageSync('userinfo');
		// uni.removeStorageSync('schoolbind');
		// uni.removeStorageSync('token');
		// uni.removeStorageSync('counts');
		// uni.removeStorageSync('phone');
		appconfig.__init();
		// 清除状态
		this.token = false;
		this.userinfo = false;
		this.userbind = false;
		this.schoolbind = false;
		this.libbind = false;
		this.email = false;
		this.counts = {};
		// 关闭socket
		// 跳转到首页
		// uni.switchTab({url:"/pages/index/index"});
		// 退出成功
		uni.$emit('logoutdone')
		uni.hideLoading();
		uni.switchTab({
			url:"/pages/index/index",
			complete: (e) => {
				console.log(e)
			}
		})
		// 跳转到登录页面
		if (showToast) {
			return uni.showToast({
				title:"退出登录成功",
				icon:"none"
			})
		}
	},
	// 获取用户相关统计信息
	async getCounts(){
		// 统计获取用户相关数据（总文章数，今日文章数，评论数 ，关注数，粉丝数，文章总点赞数）
		let [err,res] =await $http.get('/user/getcounts/'+this.userinfo.id,{},{
			token:true,checkToken:true
		})
		// 请求错误处理
		if (!$http.errorCheck(err,res)) return;
		// 成功
		this.counts = res.data.data;
		// 存储缓存
		uni.setStorageSync("counts", this.counts);
	},
	// 监听用户统计变化
	OnUserCounts(){
		uni.$on('updateData',(data)=>{
			// 文章数+1
			if (data.type == 'updateList'){
				this.counts.post_count++;
			}
			// 评论数+1
			if (data.type == 'updateComment') {
				this.counts.comments_count++;
			}
			// // 粉丝数和关注数变化
			if (data.type == 'guanzhu') {
				data.data ? 
					this.counts.withfollow_count++ 
					: this.counts.withfollow_count--;
			}
			// 更新缓存
			uni.setStorageSync("counts", this.counts);
		})
	},
	// 加入浏览历史
	addHistoryList(item){
		// 取出缓存
		let list = uni.getStorageSync('HistoryList_'+this.userinfo.id);
		list = list ? JSON.parse(list) : [];
		// 查看当前记录是否存在
		let index = list.findIndex((val)=>{
			return val.id === item.id;
		})
		// 不存在直接追加
		if (index == -1) {
			list.push(item);
			uni.setStorageSync('HistoryList_'+this.userinfo.id,JSON.stringify(list))
			console.log("加入缓存成功");
		}
	},
	// 清除浏览历史
	clearHistory(){
		uni.removeStorageSync('HistoryList_'+this.userinfo.id);
	},
	// 获取当前用户第三方绑定情况
	async getUserBind(){
		let [err,res] =await $http.get('/user/getuserbind',{},{
			token:true,checkToken:true
		});
		if (!$http.errorCheck(err,res)) return false;
		this.userbind = res.data.data;
		// 存储缓存
		uni.setStorageSync("userbind", this.userbind);
		return true;
	},
	// 获取课程表 成绩
	async getSchoolBindData(){
		if(!this.reloadData) return;
		// uni.showLoading({ title: '获取数据中...', mask: true });
		// 获取课程表
		let [err1,res1] = await $http.get('/user/timetable',{},{
			token:true,
			checkToken:true,
			checkAuth:true
		});
		if (!$http.errorCheck(err1,res1)) {
			return uni.hideLoading();
		}
		if(res1.data.data){
			// console.log(res)
			uni.setStorageSync("timeTable",res1.data.data);
		}
		// 获取每日课程
		// let [err2,res2] = await $http.get('/user/getdaytimetable',{},{
		// 	token:true,
		// 	checkToken:true,
		// 	checkAuth:true
		// });
		// // console.log(res)
		// if (!$http.errorCheck(err2,res2)) {
		// 	return uni.hideLoading();
		// }
		// if(res2.data.data){
		// 	// console.log(res)
		// 	uni.setStorageSync("daytimetable",res2.data.data);
		// }
		// 获取成绩
		let [err3,res3] = await $http.get('/user/grade',{},{
			token:true,
			checkToken:true,
			checkAuth:true
		});
		if (!$http.errorCheck(err3,res3)) {
			return uni.hideLoading();
		}
		if(res3.data.data){
			// console.log(res)
			uni.setStorageSync("grades",res3.data.data);
		}
	},
	// 获取图书馆借阅信息
	async getLibBindData(){
		uni.setStorageSync("myborrowbook", []);
	},
	// userinfo格式转换
	__formatUserinfo(obj){
		// 手机/邮箱/账号登录
		if (obj.logintype == "username" || obj.logintype == "email" || obj.logintype == "phone" || obj.logintype == "weixin-mp") {
			// 设置默认头像
			obj.userpic = obj.userpic || 'https://hpubox.oss-cn-shanghai.aliyuncs.com/appsource/Static/fixed/default-upic.png';
			return obj;
		}
		// 第三方登录（已绑定）
		if (obj.user && obj.user_id > 0) {
			return {
				id: obj.user.id,
				username: obj.user.username || obj.nickname,
				userpic: obj.user.userpic || obj.avatarurl,
				phone: obj.user.phone,
				email: obj.user.email,
				status: obj.user.status,
				create_time: obj.user.create_time,
				logintype: obj.logintype,
				password:obj.user.password,
				token: obj.token,
				userinfo: {
				    id: obj.user.userinfo.id,
				    user_id: obj.user.userinfo.user_id,
				    age: obj.user.userinfo.age,
				    sex: obj.user.userinfo.sex,
				    qg: obj.user.userinfo.qg,
				    job: obj.user.userinfo.job,
				    path: obj.user.userinfo.path,
				    birthday: obj.user.userinfo.birthday,
					userresume:obj.user.userinfo.userresume,
					usersignature:obj.user.userinfo.usersignature,
				}
			}
		}
		// 第三方登录（未绑定）
		return {
			id: obj.user_id,
			username: obj.nickname,
			userpic: obj.avatarurl,
			phone: false,
			email: false,
			status: 1,
			create_time: false,
			logintype: obj.logintype,
			token: obj.token,
			userinfo: false
		}
	},
	// 转换第三方登录格式
	__formatOtherLogin(provider,options){
		return {
			provider:provider,
			openid:options.userInfo.unionId || options.userInfo.openId,
			expires_in:options.authResult.expires_in,
			nickName:options.userInfo.nickName,
			avatarUrl:options.userInfo.avatarUrl,
		}
	},
}



/*

手机/邮箱/账号登录	logintype:username/email/phone
{
    "msg": "登录成功",
    "data": {
        "id": 15,
        "username": "13450772009",
        "userpic": "https://krplus-pic.b0.upaiyun.com/avatar/201812/28095646/fde0v5pcswzft2s8!120",
        "phone": "13450772009",
		"password":true,
        "email": null,
        "status": 1,
        "create_time": "2019-05-17 15:35:14",
        "logintype": "phone",
        "token": "b8de6712ee81c9004987152c9d58ca751edd691e",
        "userinfo": {
            "id": 6,
            "user_id": 15,
            "age": 0,
            "sex": 0,
            "qg": 0,
            "job": "IT",
            "path": "广东广州",
            "birthday": "1990-11-11"
        }
    }
}

第三方登录
{
    "msg": "登录成功",
    "data": {
        "id": 6,
        "type": "weixin",
        "openid": "oU5Yytz7ielo7Xw00LMgZsPeSDkQ",
        "user_id": 17,
        "nickname": "楚绵222",
        "avatarurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/WiaWkkJjnG4WhI2KERDGPanF9GlNM3SWDTibibKEuHru1Jrd4pfGwialjn5tTCVLvEOq8RnZ8QmqkxyNAYXtuuGcBg/132",
        "logintype": "weixin",
        "token": "82e61b691390b98e715927051dff4f9a21839ff8",
        "user": {
            "id": 17,
            "username": "13450772012",
            "userpic": "https://krplus-pic.b0.upaiyun.com/avatar/201812/28095646/fde0v5pcswzft2s8!120",
            "phone": "13450772012",
			"password":false,
            "email": null,
            "status": 1,
            "create_time": "2019-05-17 17:14:59",
            "userinfo": {
                "id": 7,
                "user_id": 17,
                "age": 0,
                "sex": 0,
                "qg": 0,
                "job": "IT",
                "path": "广东广州",
                "birthday": "1990-11-11"
            }
        }
    }
}

第三方登录（未绑定）
{
    "msg": "登录成功",
    "data": {
        "id": 6,
        "type": "weixin",
        "openid": "oU5Yytz7ielo7Xw00LMgZsPeSDkQ",
        "user_id": 0,
        "nickname": "楚绵222",
        "avatarurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/WiaWkkJjnG4WhI2KERDGPanF9GlNM3SWDTibibKEuHru1Jrd4pfGwialjn5tTCVLvEOq8RnZ8QmqkxyNAYXtuuGcBg/132",
        "logintype": "weixin",
        "token": "499b073624aefd42e61f7ff3f410a494e0eb1343",

    }
}

*/