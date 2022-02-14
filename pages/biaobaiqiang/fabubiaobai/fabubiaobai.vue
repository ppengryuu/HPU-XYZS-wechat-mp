<template>
	<view class="body" :style="{height:contentheight+'px'}">
		<navigation-custom :config="{title:'发布到表白墙',bgcolor:'#f8f8f8',fontcolor:'#0c0c0c',type:3,share:false,menuIcon:[{icon:'../../static/icon/back_.png',text:'返回'}],menuText:'返回'}" @customConduct="publicM.back1()"/>
		<view class="user-set-userinfo-list uesrresume-edit">
			<view>我</view>
				<view class="resume-textarea">
				<textarea adjust-position="true" auto-height="true" maxlength="50" placeholder="昵称" show-confirm-bar="false" v-model="who" cursor-spacing="" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji1 birthdaybiaji"></view>
		</view>
		<view class="edit-tip"><view>* 最长50个字符</view><view> {{who.length+'/50'}}</view></view>
		<view class="user-set-userinfo-list u-f-ac">
			<view class="u-f-ac">{{typeIndex>2?'我有':'我想'}}</view>
			<view class="u-f-ac u-f-jsb" @tap="changeOne" style="width: 100%;">
				<view>{{typeArr[typeIndex]}} To：</view>
				<view class="icon iconfont icon-bianji1"></view>
			</view>
		</view>
		<view class="user-set-userinfo-list uesrresume-edit">
			<view>TA</view>
			<view class="resume-textarea">
				<textarea adjust-position="true" auto-height="true" maxlength="50" placeholder="TA是谁" show-confirm-bar="false" v-model="towho" cursor-spacing="" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji1 birthdaybiaji"></view>
		</view>
		<view class="edit-tip"><view>* 最长50个字符</view><view> {{towho.length+'/50'}}</view></view>
		<view class="user-set-userinfo-list uesrresume-edit">
			<view style="min-width: 0px!important"></view>
			<view class="resume-textarea" style="width: 93%!important">
				<textarea adjust-position="true" auto-height="true" maxlength="500" placeholder="我想说..." show-confirm-bar="false" v-model="content" cursor-spacing="0" placeholder-class="phclass"/>
			</view>
			<view class="icon iconfont icon-bianji1 birthdaybiaji"></view>
		</view>
		<view class="edit-tip"><view>* 最长500个字符 </view><view> {{content.length+'/500'}}</view></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				who:'',
				towho:'',
				content:'',
				contentheight:Number,
				typeArr:['表白','祝福','吐槽','心愿','小秘密'],
				typeIndex:0,
			}
		},
		watch:{
			who(){},
			towho(){},
			content(){},
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.contentheight=res.screenHeight-uni.getSystemInfoSync().statusBarHeight-44
				}
			})
		},
		onNavigationBarButtonTap(e) {
			if(e.index==0){
				this.submit()
			}
		},
		methods: {
			// 单列选择
			changeOne(){
				uni.showActionSheet({
					itemList: this.typeArr,
					success: res => {
						this.typeIndex=res.tapIndex
					},
				});
			},
			// 发布
			async submit(){
				var genTitle = this.who + ' ' + this.typeArr[this.typeIndex] + ' To：' + this.towho;
				var genTopicId = this.typeIndex + 1;
				console.log(genTitle);
				console.log(genTopicId);
				uni.showLoading({ title: '发布中...', mask: true });
				try{
					let [err,res] = await this.$http.post('/post/create',{
						imglist:JSON.stringify([]),
						text:this.content,
						isopen:1,
						topic_id: 1,
						post_class_id:11,
						title: genTitle
					},{
						token:true,
						checkToken:true,
					});
					// 发布失败
					if (!this.$http.errorCheck(err,res)) {
						return uni.hideLoading();
					}
					// 发布成功
					uni.hideLoading();
					uni.showToast({
						title: '发布成功！',
						duration:1000
					});
					this.isget = true;
					uni.$emit('updateData',{ 
						type:"updateList",
						data:res.data.data.detail
					});
					setTimeout(function() {
						uni.navigateBack({
							delta:1
						})
					}, 1000);
				}catch(e){
					return;
				}
			},
		}
	}
</script>

<style>
@import "../../../common/form.css";
.phclass{
	color: #c8c8c8;
}
.edit-tip{
	display: flex;
	flex-direction: row;
	width: 96%;
	justify-content: space-between;
}
.edit-tip view{
	margin-left: 20upx;
	font-size: 22upx;
	color: #9B9B9B;
}
.resume-length-tip{
	display: flex;
	width: 95%;
	justify-content: flex-end;
}
.resume-textarea>textarea{
	margin-top: 12upx;
	width: 100%;
	font-size: 28upx;
}
.resume-textarea{
	width: 78%;
	font-size: 28upx;
}
.uesrresume-edit{
	display: flex;
	justify-content: space-between;
}
.birthday{
	margin-right: 20upx;
}
.birthdaybiaji{
	color: #9B9B9B;
}
.user-set-userinfo-list{
	padding: 20upx;
	border-top: 1upx solid #F4F4F4;
}
.user-set-userinfo-list>view:nth-child(2)>view:nth-child(1){
	font-size: 30upx;
	color: #5f5f5f;
}
.user-set-userinfo-list>view:first-child{
	font-size: 32upx;
	min-width: 20%;
	color: #5f5f5f;
}
.user-set-userinfo-list>view:last-child>view:last-of-type{
	margin-left: 20upx;
	color: #9B9B9B;
}
.username-input{
	font-size: 28upx;
}
</style>
