<template>
	<view>
		<navigation-custom :config="barConfig" @buttonTap="publicM.cusNavOnlyBack"/>

		<user-space-userinfo :userinfo="userinfo" v-if="dataReady"></user-space-userinfo>
	</view>
</template>

<script>
	import userSpaceUserinfo from "../../components/user-space/user-space-userinfo.vue";
	import Time from '../../common/time.js';
	export default {
		components:{
			userSpaceUserinfo
		},
		data() {
			return {
				dataReady:false,
				data:{},
				userinfo:Object,
			}
		},
		onLoad(e) {
			console.log(e)
			this.data = uni.getStorageSync('userDetail')
			uni.removeStorageSync("userDetail")
		},
		onReady() {
			this.getuserinfo()
		},
		computed:{
			barConfig(){
				return {
					title:this.data.username + " 的资料", //title
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
		methods: {
			// 初始化用户信息
			async getuserinfo(){
				let sexArr=['秘密','男','女'];
				let qgArr=['秘密','单身','恋爱中'];
				// 非本人，获取用户信息
				let isme,info,isguanzhu,isblack;
				let [err,res] = await this.$http.post('/getuserinfo',{
					user_id: this.data.userid
				},{
					token:true
				})
				// 错误处理
				// console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				info = res.data.data;
				isme = this.User.userinfo.id==this.data.userid?true:false;
				isguanzhu = !!res.data.data.fens.length;
				isblack = !!res.data.data.blacklist.length;
				let regtime = info.create_time ? Time.gettime.dateFormat(new Date(info.create_time*1000),'{Y}-{MM}-{DD}') : "未知";
				this.userinfo = {
					isme:isme,
					userpic:info.userpic,
					username:info.username,
					sex:info.userinfo.sex ,
					age:info.userinfo.age,
					isguanzhu:isguanzhu,
					isblack:isblack,
					regtime:regtime,
					id:info.id,
					birthday:info.userinfo.birthday || "未知",
					job:info.userinfo.job || "未知",
					path:info.userinfo.path || "未知",
					qg:qgArr[info.userinfo.qg] || '秘密',
					userresume:info.userinfo.userresume
				}
				console.log(this.userinfo)
				this.dataReady=true
			},
		}
	}
</script>

<style>
</style>
