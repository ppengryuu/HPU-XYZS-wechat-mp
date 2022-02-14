<template>
	<view class="body">
		<navigation-custom :config="barConfig()" @buttonTap="publicM.cusNavOnlyBack"/>
		<!-- <button type="primary" @tap="sendmes">测试全局</button> -->
		<view class="login_title">
			{{bindtype=="0"?"绑定/重新绑定教务账号":bindtype=="1"?"刷新课程表":"刷新成绩"}}
		</view>
		<view class="policy_confirm">
			<text>* 该操作可能需要一段时间\n</text>
			<text v-if="isbindschool">* 您已绑定到账号：{{fixstunum}}\n</text>
			<text v-if="bindtype=='0'">* 重新绑定会重新导入课程表和成绩</text>
		</view>
		
		<view class="stepbody">
			<view class="input-line">
				<input class="uni-input" type="text" v-model="stunum" placeholder="教务管理系统账号/学号" />
			</view>
			<view class="input-line">
				<input class="uni-input" type="password" v-model="stupass" placeholder="教务管理系统密码" />
			</view>
			<label class="u-f-ac" v-on:click="switchsavepass(savepassword)">
				<checkbox :checked="savepassword" style="transform: scale(0.7);"/>
				<view>记住密码</view>
			</label>
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" :disabled="buttondisabled" @tap="sumbit">确定</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				fixstunum:"",
				stunum:'',
				stupass:'',
				bindtype:"0",
				buttondisabled:true,
				savepassword:false,
				isbindschool:false,
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
						t = "刷新课程表"
					}else if(this.bindtype=="2"){
						t = "刷新成绩"
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
			stupass(){
				if(this.stunum.length>0&&this.stupass.length>0){
					this.buttondisabled=false
				} else {
					this.buttondisabled=true
				}
			},
		},
		onLoad(e) {
			console.log(e)
			if(e.type){
				this.bindtype = e.type
				console.log("if e.type:"+this.bindtype)
			}
			if(this.User.schoolbind){
				this.stunum=this.User.schoolbind.jwzh
				this.fixstunum = this.stunum
				this.isbindschool=true
			}
			var stupass = uni.getStorageSync('easpassword')
			if(stupass){
				// console.log(stupass)
				this.savepassword = true
				this.stupass = stupass
				this.buttondisabled = false
			}
		},
		methods: {
			switchsavepass(savepassword){
				savepassword=!savepassword
				this.savepassword=savepassword
				console.log(this.savepassword)
			},
			async sumbit(){
				console.log(this.savepassword)
				uni.showLoading({ title: '验证中...', mask: true });
				let [err,res] = await this.$http.post('/user/bindeas',{
					jwzh:this.stunum,
					jwmm:this.stupass,
					type:this.bindtype
				},{
					token:true,
					checkToken:true
				});
				uni.showLoading({ title: '获取数据中...', mask: true });
				// console.log(res)
				//console.log(err)
				// 绑定失败
				if (!this.$http.errorCheck(err,res)) {
					// plus.nativeUI.toast(res.data.msg)
					uni.showToast({
						title:res.data.msg,
						icon:'none'
					})
					return uni.hideLoading();
				}
				// console.log(res.data.data)
				this.User.schoolbind = res.data.data
				uni.setStorageSync("schoolbind",res.data.data);
				// 保存密码
				if(this.savepassword){
					uni.setStorageSync('easpassword',this.stupass)
				} else {
					uni.removeStorageSync('easpassword')
				}
				
				if(this.bindtype=="0" || this.bindtype=="1"){
					console.log("获取课程表")
					// 获取课程表
					let [err1,res1] = await this.$http.get('/user/gettimetable',{},{
						token:true,
						checkToken:true
					});
					if (!this.$http.errorCheck(err1,res1)) {
						uni.showToast({title:res1.data.msg,icon:'none'})
						return uni.hideLoading();
					}
					// console.log(res)
					uni.setStorageSync("timetable",res1.data.data);
				} 
				if(this.bindtype=="0" || this.bindtype=="2"){
					console.log("获取成绩")
					// 获取成绩
					let [err3,res3] = await this.$http.get('/user/getgrade',{},{
						token:true,
						checkToken:true
					});
					if (!this.$http.errorCheck(err3,res3)) {
						uni.showToast({title:res3.data.msg,icon:'none'})
						return uni.hideLoading();
					}
					// console.log(res)
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
