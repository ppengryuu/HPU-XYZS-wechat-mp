<template>
	<view class="body">
		<navigation-custom :config="barConfig()" @buttonTap="publicM.cusNavOnlyBack"/>
		<!-- <button type="primary" @tap="sendmes">测试全局</button> -->
		<view class="login_title">
			{{bindtype=="0"?"绑定/重新绑定教务账号":bindtype=="1"?"重新导入课程表":"重新导入成绩"}}
		</view>
		<view class="policy_confirm">
			<text>* 该操作可能需要一段时间\n</text>
			<text v-if="bindtype=='0'">* 重新绑定会重新导入课程表和成绩</text>
		</view>
		
		<view class="stepbody">
			
			<view class="input-line">
				<input class="uni-input" type="text" v-model="stunum" placeholder="教务管理系统账号/学号" />
			</view>
			<view class="input-line" style="margin-bottom: 10rpx!important;">
				<input class="uni-input" type="password" v-model="stupass" placeholder="教务管理系统密码" />
			</view>
			<view class="edit-tip"><view>* 默认为身份证号后6位</view></view>
			<view class="input-line" style="margin-bottom: 10rpx!important;">
				<input class="uni-input" type="text" v-model="captcha" :placeholder="'请输入验证码'" />
				<view class="u-f-ajc">
					<image v-if="codestatus" :src="captchaB64" mode="widthFix" style="height: auto;width: 180rpx;" @tap="refreshcode" @error="refreshcode()"></image>
					<view v-else style="color: #909090;">loading...</view>
				</view>
			</view>
			<view class="edit-tip"><view>* 点击图片刷新验证码</view></view>
			<label class="u-f-ac" v-on:click="switchsavepass(savepassword)">
				<checkbox :checked="savepassword" style="transform: scale(0.7);"/>
				<view>记住密码</view>
			</label>
			<view v-if="showSemesterSltr">
				<view class="input-line" style="margin-bottom: 20rpx!important;">
					<picker mode="selector" :range="semesterData" range-key="title" :value="selectedSem.index" @change="changeselectedSem" class="dateContainer" style="margin-right: 10rpx;">
						<input class="uni-input" type="text" v-model="selectedSem.title" :disabled="true"/>
					</picker>
				</view>
				<view class="edit-tip"><view>* 选择导入的学期</view></view>
			</view>
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="buttondisabled" @tap="sumbit">确定</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				stunum:'',
				stupass:'',
				bindtype:"0",
				buttondisabled:false,
				savepassword:false,
				captcha:"",
				captchaB64:"",
				codestatus:false,
				sessionID:"",
				showSemesterSltr:false,
				semesterData: [],
				selectedSem: {
					'title': 'loading ...'
				},
				config:{
					bgcolor:"#ffffff",
					title:"绑定教务", //title
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
			barConfig(){
				return function(){
					var t = "绑定教务"
					if(this.bindtype=="1"){
						t = "重新导入课程表"
					}else if(this.bindtype=="2"){
						t = "重新导入成绩"
					}
					return {
						bgcolor:"#ffffff",
						title:t, //title
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
			}
		},
		watch:{
			
		},
		onLoad(e) {
			console.log(e)
			this.eamsSession()
			// e.type -> 0 信息、成绩、课程表
			// —> 		 1 课程表	
			// —> 		 2 成绩
			if(e.type){
				this.bindtype = e.type
				console.log("if e.type:"+this.bindtype)
				if(e.type=="1"){
					this.showSemesterSltr = true
					this.getSemesterData()
				}
				
			}
			var stor = uni.getStorageSync('eamsAccount')
			if(stor){
				this.stunum = stor.usernum
				this.stupass = stor.password
				this.savepassword = true
				this.buttondisabled = false
			} else if (this.User.schoolbind) {
				this.stunum=this.User.schoolbind.jwzh
			}
		},
		methods: {
			changeselectedSem(e){
				console.log(e)
				var index = e.detail.value
				this.selectedSem = this.semesterData[index]
				this.selectedSem['index'] = index
			},
			refreshcode(){
				// this.publicM.sleep(600)
				this.codestatus = false;
				this.eamsSession()
			},
			async getSemesterData(){
				let [err,res] = await this.$http.get("/app/eams/semesters")
				console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					uni.showToast({title:res.data.msg,icon:'none'})
					return;
				}
				var data = res.data.data.list
				var def_sem = res.data.data.defaultSem.index
				data.forEach(e=>{
					this.semesterData.push({
						title: e.school_year+' '+e.name,
						semester_id: e.semester_id
					})
				})
				this.selectedSem = this.semesterData[def_sem]
				this.selectedSem['index'] = def_sem
			},
			async eamsSession(){
				let [err,res] = await this.$http.post("/app/eams/session",{
					user_id:this.User.userinfo.id
				},{
					token:true,
					checkToken:true
				})
				console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					uni.showToast({title:res.data.msg,icon:'none'})
					return;
				}
				this.captchaB64 = res.data.data.captcha;
				this.sessionID = res.data.data.sessionID;
				this.codestatus = true;
			},
			switchsavepass(savepassword){
				savepassword=!savepassword
				this.savepassword=savepassword
				console.log(this.savepassword)
			},
			async sumbit(){
				console.log(this.savepassword)
				if(!this.stunum) return uni.showToast({icon:"none",title:"学号不能为空"});
				if(!this.stupass) return uni.showToast({icon:"none",title:"密码不能为空"});
				if(!this.captcha) return uni.showToast({icon:"none",title:"验证码不能为空"}); 
				uni.showLoading({ title: '验证中...', mask: true });
				var payload = {
					v2: true,
					user_id: this.User.userinfo.id,
					jwzh: this.stunum,
					jwmm: this.stupass,
					type: this.bindtype,
					captcha: this.captcha,
					sessionid: this.sessionID
				} 
				if(this.selectedSem.semester_id) {
					payload['semester_id'] = this.selectedSem.semester_id.toString()
				} 
				console.log(payload)
				let [err,res] = await this.$http.post('/user/eams/bind', payload, {
					token:true,
					checkToken:true
				});
				uni.showLoading({ title: '获取数据中...', mask: true });
				// console.log(res)
				// console.log(err)
				// 绑定失败
				if (!this.$http.errorCheck(err,res)) {
					// plus.nativeUI.toast(res.data.msg)
					// uni.hideLoading();
					uni.showToast({
						title:res.data.msg,
						icon:'none'
					})
					this.refreshcode();
					return;
				}
				// console.log(res.data.data)
				this.User.schoolbind = res.data.data
				uni.setStorageSync("schoolbind",res.data.data);
				// 保存密码
				if(this.savepassword){
					// uni.setStorageSync('easpassword',this.stupass)
					uni.setStorageSync('eamsAccount',{
						usernum: this.stunum,
						password: this.stupass
					})
				} else {
					uni.removeStorageSync('easpassword')
				}
				
				if(this.bindtype=="0" || this.bindtype=="1"){
					console.log("获取课程表")
					// 获取课程表
					let [err1,res1] = await this.$http.get('/user/timetable',{},{
						token:true,
						checkToken:true
					});
					if (!this.$http.errorCheck(err1,res1)) {
						uni.hideLoading();
						uni.showToast({title:res1.data.msg,icon:'none'})
						return;
					}
					// console.log(res)
					uni.setStorageSync("timeTable",res1.data.data);
				} 
				if(this.bindtype=="0" || this.bindtype=="2"){
					console.log("获取成绩")
					// 获取成绩
					let [err3,res3] = await this.$http.get('/user/grade',{},{
						token:true,
						checkToken:true
					});
					if (!this.$http.errorCheck(err3,res3)) return;
					console.log(res)
					uni.setStorageSync("grades",res3.data.data);
				}
				
				uni.$emit("schoolbinddone")
				// 绑定成功
				uni.hideLoading();
				uni.showToast({
					title: '成功',
					duration:1000
				});
				setTimeout(function() {
					uni.navigateBack({
						delta:1
					})
				}, 1000);
			},
		}
	}
</script>

<style>
	.dateContainer{
		box-sizing: border-box;
		border-bottom: #BBBBBB 1px solid;
		width: 100%;
	}
	.dateContainer:hover{
		border-bottom: #409eff 1px solid;
	}
	
	
	.edit-tip{
		margin-bottom: 50upx;
		display: flex;
		flex-direction: row;
		width: 96%;
		justify-content: space-between;
	}
	.edit-tip view{
		margin-left: 10upx;
		font-size: 22upx;
		color: #9B9B9B;
	}
	
	
	.policy_confirm{
		font-size: 22upx;
		padding: 20upx 50upx;
		box-sizing: border-box;
	}
	.policy_confirm>text{
		color: #929292;
		font-size: 22upx;
	}
	.login_title{
		padding: 0 50upx 50upx 50upx;
		box-sizing: border-box;
		height: 80upx;
		line-height: 80upx;
		font-size: 60upx;
		font-weight: bold;
		/* background: #007AFF; */
	}
	.stepbody{
		width: 100%;
		position: absolute;
		padding: 10upx 30upx 0 30upx;
		box-sizing: border-box;
		z-index: 999;
	}
	
	.verifybuttonhover[type=primary]{
		background: #00b9ff!important;
	}
	.verifybutton{
		background: #00aaff!important;
		border-radius: 50upx!important;
	}
	button::after{ border: none;}
	.input-line>input{
		/* background: #09BB07; */
		font-size: 32upx;
		border-bottom: 1px solid #eeeeee;
	}
	.input-line{
		margin-bottom: 50upx;
		display: flex;
		align-items: center;
	}
	.stepbody>view:nth-child(2){
		margin-bottom: 20upx!important;
	}
	.stepbody>label{
		margin-left: 12upx;
		margin-bottom: 30upx;
		color: #646464;
	}
	
</style>
