<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>

		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		<view class="options">
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<view hover-class="option-hover" hover-stay-time="100" @tap="browsemyinfo()">
				<view class="aboutuser u-f-ac">
					<view class="picpart u-f-ac">
						<image :src="userpic" mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 50%;" @tap.stop="browsemyinfo()"></image>
						<!-- <image-cache v-if="updateuserpic" :imgSrc="userpic" mode="aspectFill" setStyle="width: 80rpx;height: 80rpx;border-radius: 50%;" @tapimg="browsemyinfo()"></image-cache> -->
					</view>
					<view class="userinfo">
						<view>{{username}}</view>
						<tag-sex-age :age="age" :sex="sex"></tag-sex-age>
					</view>
				</view>
			</view>
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<!-- <option-list :listicon="''" :listtext="'消息'" :navigateTo="optlistnavgates[0]" :minireddot="haveUnread"></option-list> -->
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="''" :listtext="'我发布的动态'" :navigateTo="optlistnavgates[1]"></option-list>
			<option-list :listicon="''" :listtext="'我参与评论的动态'" :navigateTo="optlistnavgates[2]"></option-list>
			<option-list :listicon="''" :listtext="'我点赞的动态'" :navigateTo="optlistnavgates[3]"></option-list>
			<view style="width: 100%;height: 30upx;background: rgb(242,246,245);"></view>
			<option-list :listicon="''" :listtext="'修改资料'" :navigateTo="optlistnavgates[4]"></option-list>
			
		</view>
		
	</view>
</template>

<script>
	import tagSexAge from '../../components/common/tag-sex-age.vue';
	import optionList from '../../components/option-list/option-list.vue';
	import imageCache from '../../components/image-cache/image-cache.vue'; 
	export default {
		components: {
			optionList,
			tagSexAge,
			imageCache
		},
		data() {
			return {
				haveUnread:false,
				updateuserpic:true,
				userpic:"",
				euserpic:'',
				username:"",
				age:0,
				sex:0,
				userschoolnum:"",
				screenHeight:Number,
				screenWidth:Number,
				contentHeight:Number,
				optlistnavgates:[
					"../../pages/paper/messages/messages",
					"my-post/my-post",
					"my-comment/my-comment",
					"my-like/my-like",
					"../../pages/user-set-userinfo/user-set-userinfo",
				],
				
				config:{
					title:"我", //title
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
		onShow() {
			uni.getStorage({
				key:'haveUnread',
				success: (res) => {
					this.haveUnread = res.data
				} ,fail: (res) => {
					console.log(res)
				}
			})
		},
		onLoad() {
			uni.$on('newMessage',this.updateUnread)
			uni.$on('userinfoChanged',this.updateUserinfo)
			uni.$on('userpicChange',this.updateUserpic)
			var userinfo = uni.getStorageSync("userinfo")
			console.log(userinfo)
			this.username=userinfo.username
			this.userpic = userinfo.userpic
			this.euserpic = userinfo.userpic
			this.age = userinfo.userinfo.age
			this.sex = userinfo.userinfo.sex
		},
		methods: {
			updateUnread(){
				this.haveUnread = uni.getStorageSync('haveUnread')
			},
			updateUserpic(data){
				// console.log(data)
				this.userpic = data.newpic
				this.updateuserpic = false
				setTimeout(()=>{
					this.updateuserpic = true
				}, 3000)
				// console.log(this.userpic)
			},
			updateUserinfo(data){
				// console.log(data)
				this.username=data.data.name
				// this.userpic = userinfo.userpic
				this.age = data.data.age
				this.sex = data.data.sex
			},
			browsemyinfo(){
				var data = {}
				data.userid = this.User.userinfo.id
				data.username = '我'
				console.log(data)
				uni.setStorageSync('userDetail', data)
				uni.navigateTo({
					url:'../browse-userinfo/browse-userinfo'
				})
			}
			
			
		}
	}
</script>

<style>
	.option-hover{
		background: #EEEEEE;
	}
	.userinfo{
		margin-left: 10upx;
		padding-top: 15upx;
	}
	.userinfo>view:nth-child(1){
		line-height: 1;
		padding-left: 10upx;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.aboutuser{
		width: 97%;
		margin-left: 3%;
		padding: 20upx 0;
	}
	.picpart{
		width: 80upx;
	}
	
	
	.options{
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		width: 100%;
		position: absolute;
	}
	
</style>
