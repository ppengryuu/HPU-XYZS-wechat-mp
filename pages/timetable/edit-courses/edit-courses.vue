<template>
	<view>
		<navigation-custom :config="config" @buttonTap="buttonTap"/>

		<block v-for="(item,i) in courselist" :key="i">
			<view class="u-f-ac listbody" @tap="gotoedit(item)">
				<view class="course-list">
					<view>{{item.course}}</view>
					<view>老师：{{item.teacher?item.teacher:'未填写'}}</view>
					<view>地点：{{item.loc?item.loc:'未填写'}}</view>
					<view>周次：{{item.active?item.active:'未填写'}}</view>
				</view>
				
				<view class="deleteButton u-f-ajc" @tap.stop="delcourse(item)">
					<view class="icon iconfont icon-shanchu" hover-class="delbutton-hover" hover-stay-time="100"></view>
				</view>
			</view>
			
			<!-- <view>{{item.course}}</view> -->
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				courselist:[],
				config:{
					title:"编辑课程表", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							text:"添课"
						}
					]
				}

			}
		},
		onLoad() {
			uni.$on('updateTimetable', this.updateTt)
			this.courselist = uni.getStorageSync("timeTable")
			// console.log(JSON.stringify(this.courselist))
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0){
				uni.navigateTo({
					url:"edit-or-add/edit-or-add?type=add"
				})
			}
		},
		methods: {
			buttonTap(e){
				if(e.index==0){
					this.publicM.back1()
				} else if(e.index == 1){
					uni.navigateTo({
						url:"edit-or-add/edit-or-add?type=add"
					})
				}
			},
			updateTt(e){
				this.courselist = uni.getStorageSync("timeTable")
			},
			gotoedit(item){
				uni.setStorageSync('courseDetail',item)
				uni.navigateTo({
					url:"edit-or-add/edit-or-add?type=edit"
				})
			},
			delcourse(item){
				console.log(item)
				uni.showModal({
					title:'提示',
					content:'确认删除吗？',
					success: async (res) => {
						if(res.confirm){
							uni.showLoading({title:"提交中"})
							item.type = 'delete'
							let [err,res] = await this.$http.post('/user/timetable/edit',item,{
								token:true,
								checkToken:true
							});
							// 请求失败处理
							console.log(res)
							if (!this.$http.errorCheck(err,res)) return;
							// 拿到当前对象
							let index = this.courselist.findIndex(value =>{
								return value.id === item.id;
							});
							this.courselist.splice(index,1);
							var list = uni.getStorageSync("timeTable")
							// 拿到当前对象
							let i = list.findIndex(value =>{
								return value.id === item.id;
							});
							if(i >= 0){
								list.splice(i,1)
							}
							uni.setStorageSync("timeTable",list)
							uni.$emit('updateTimetable')
							uni.hideLoading();
							uni.showToast({
								title:"修改成功",
								icon:"none"
							})
						}
					}
				})
				
			}
		}
	}
</script>

<style>
	.delbutton-hover{
		background: #c82934!important;
	}
	.deleteButton>view{
		padding: 45upx 20upx;
		border-radius: 8upx;
		color: #FFFFFF;
		background: #ff3542;
	}
	.deleteButton{
		width: 15%;
	}
	.cl-hover{
		background: #EEEEEE!important;
	}
	.listbody{
		border-bottom: 1upx solid #EEEEEE;
	}
	.course-list{
		width: 85%;
		padding: 15upx 25upx;
	}
	.course-list>view{
		/* width: 80%; */
		font-size: 24upx;
		line-height: 36upx;
		color: #909090;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.course-list>view:nth-child(1){
		color: #101010!important;
		font-size: 34upx!important;
		line-height: 46upx!important;
	}
</style>
