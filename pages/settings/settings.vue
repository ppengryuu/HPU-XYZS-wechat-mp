<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		<view class="options">
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<view v-if="isbindschool" class="useropt u-f-jsb u-f-ac" hover-class="option-hover" hover-stay-time="100" @tap="showdetailofme">
				<view class="aboutuser u-f">
					<view class="userinfo">
						<view class="username">{{username}}</view>
						<view class="usernum">学号：{{userschoolnum}}</view>
					</view>
				</view>
			</view>
			<view v-else class="noschoolbind u-f-jsb u-f-ac">
				<view class="usernoschoolbind u-f">
					<view class="usernum">未绑定教务处账号</view> 
				</view>
			</view>
			
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="''" :listtext="'我的绑定'" :navigateTo="optlistnavgates[0]"></option-list>
			<option-list :listicon="''" :listtext="'账号与密码'" :navigateTo="optlistnavgates[1]"></option-list>
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="''" :listtext="'反馈和建议'" :navigateTo="optlistnavgates[3]"></option-list>
			<option-list :listicon="''" :listtext="'协议和政策'" :navigateTo="optlistnavgates[2]"></option-list>
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="''" :listtext="'关于'" :navigateTo="optlistnavgates[4]" :minireddot="haveupdate"></option-list>
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			
			<option-list :listicon="''" :listtext="'退出登录'" fontColor="#ff3542" @optiontap="logout"></option-list>
			
			
		</view>
		
		<view class="detailMask" v-if="showDetail" @tap="closePop" @touch.prevent>
			<view class="detailPop animated zoomIn faster200" @tap.stop>
				<view class="detailTitle u-f-ajc">我的资料</view>
				<view class="courseName">姓名：{{userinfo.name}}</view>
				<view class="courseName">学号：{{userinfo.jwzh}}</view>
				<view class="courseId">年级：{{userinfo.grade}}</view>
				<view class="couresTeacher">学院：{{userinfo.academy}}</view>
				<view class="courseLoc">专业：{{userinfo.major}}</view>
				<view class="courseActive">班级：{{userinfo.class}}</view>
				<view class="closeButton u-f-ajc" hover-class="button-hover" hover-stay-time="100" @tap="closePop"><view class="icon iconfont icon-guanbi"></view></view>
			</view>
		</view>
	</view>
</template>

<script>
	import optionList from '../../components/option-list/option-list.vue';
	// import navigationCustom from "../../components/struggler-navigationCustom/navigation-custom.vue"
	export default {
		components: {
			optionList,
			// navigationCustom
		},
		data() {
			return {
				showDetail:false,
				isbindschool:false,
				userpic:"",
				username:"",
				userinfo:Object,
				userschoolnum:"",
				optlistnavgates:[
					"../../pages/bangding/bangding",
					"../../pages/account-setting/account-setting",
					"../../pages/json-docView/json-docView?url=/app/bof.json&useJsonBUrl=true",
					"../../pages/feedback/feedback",
					"../../pages/about/about",
				],
				config:{
					title:"设置", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							text:"返回"
						}
					]
				},
			}
		},
		computed:{
			haveupdate(){
				return this.appconfig.haveupdate
			}
		},
		onBackPress(e) {
			if(this.showDetail){
				this.showDetail=false
				return true
			}
		},
		onLoad() {
			var userinfo = uni.getStorageSync("schoolbind")
			// console.log(userinfo)
			if(userinfo){this.isbindschool=true}
			this.username=userinfo.name
			this.userschoolnum = userinfo.jwzh
			uni.$on('schoolbinddone',this.updatepage)
			uni.$on('logoutdone',this.updatepage)
			uni.$on('logindone',this.updatepage)
		},
		methods: {
			logout(){
				uni.showModal({
					title:"提示",
					content:"确认退出登录吗",
					success: (res) => {
						if(res.confirm){
							this.User.logout()
						}
					}
				})
			},
			updatepage(e){
				// console.log(e)
				var userinfo = uni.getStorageSync("schoolbind")
				if(!userinfo){this.isbindschool=false}
				if(userinfo){this.isbindschool=true}
				this.username=userinfo.name
				this.userschoolnum = userinfo.jwzh
			},
			showdetailofme(){
				var data = uni.getStorageSync("schoolbind")
				this.showDetail=true
				this.userinfo = data
			},
			closePop(){
				this.showDetail=false
				this.detailContent=Object
			},
			debug(){
				
				console.log(this.User.userinfo)
				console.log(this.$message.isMessagePage)
			},
			customConduct(e){
				console.log("ssssss")
				uni.navigateBack({
					delta:1
				})
			},
		}
	}
</script>

<style>
	page{
		background: rgb(242,246,245);
	}
	.button-hover{
		background: #0093dc!important;
	}
	.option-hover{
		background: #EEEEEE;
	}
	.userinfo{
		/* margin-left: 25upx; */
	}
	.username{
		font-size: 35upx;
	}
	.userpic>image{
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}
	.userpic{
		display: flex;
		align-items: center;
	}
	.usernoschoolbind{
		width: 97%;
		margin-left: 3%;
		padding: 20upx 0;
		align-items: center;
		color: #b6b6b6;
	}
	.noschoolbind{
		width: 100%;
		display: flex;
		border-bottom: 1upx solid #EEEEEE;
	}
	.useropt{
		width: 100%;
		display: flex;
		border-bottom: 1upx solid #EEEEEE;
	}
	.aboutuser{
		width: 97%;
		margin-left: 3%;
		padding: 20upx 0;
		align-items: center;
	}
	.options{
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		width: 100%;
		position: absolute;
	}
	.detailMask,.weekchengeMask{
		top:0;
		right:0;
		bottom:0;
		left:0;
		position: fixed;
		z-index: 2000;
		background: rgba(0,0,0,0.1);
	}
	.detailPop{
		background: #FFFFFF;
		right:10%;
		left:10%;
		top:30%;
		border-radius: 8upx;
		padding: 0 50upx 50upx 50upx;
		position: fixed;
		z-index: 2001;
	}
	.detailTitle{
		font-size: 40upx;
		padding: 20upx 0;
	}
	.courseActive,.courseId,.courseLoc,.couresTeacher,.courseName{
		width: 100%;
		font-size: 26upx;
		padding: 3px 0;
		border-bottom: 1upx solid #909090;
	}
	.closeButton{
		position: absolute;
		font-size: 30upx;
		border-radius: 0 8upx 0 0;
		width: 60upx;
		height: 60upx;
		color: #FFFFFF;
		background: #00AAFF;
		right: 0;
		top: 0;
	}
</style>
