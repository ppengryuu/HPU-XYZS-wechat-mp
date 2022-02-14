<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.back1()"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<view class="options">
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="''" :listtext="'绑定/更换邮箱'" :righttext="useremail" :navigateTo="optlistnavgates[0]"></option-list>
			<option-list :listicon="''" :listtext="'设置/更改密码'" :navigateTo="optlistnavgates[1]"></option-list>
			<view style="width: 100%;height: 60upx;background: rgb(242,246,245);"></view>
			<!-- <option-list :listicon="''" :listtext="'退出登录'" :navigateTo="''"  @optiontap="userLogout"></option-list> -->
		</view>
	</view>
</template>

<script>
	import optionList from '../../components/option-list/option-list.vue';
	export default {
		components: {
			optionList
		},
		data() {
			return {
				useremail:'',
				userphone:"",
				optlistnavgates:[
					"bind/bindemail",
					"changepassword/changepassword",
				],
				config:{
					title:"账号与密码", //title
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
		onLoad() {
			this.useremail = this.User.email
			uni.$on('emailchanged',this.updatepage)
		},
		methods: {
			updatepage(){
				this.useremail = this.User.email
			},
			userLogout(){
				this.User.logout();
			}
		}
	}
</script>

<style>
	.options{
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		width: 100%;
		position: absolute;
	}
</style>
