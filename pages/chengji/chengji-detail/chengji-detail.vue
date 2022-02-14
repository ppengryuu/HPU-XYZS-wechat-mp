<template>
	<view>
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>
		
		<view v-if="data1Ready">
			<view class="mini-title">课程详情</view>
			<view class="grade-detail">
				<view>课程代码：{{gradeinfo[0]?gradeinfo[0]:"无"}}</view>
				<view>课程序号：{{gradeinfo[1]?gradeinfo[1]:"无"}}</view>
				<view>课程名称：{{gradeinfo[2]?gradeinfo[2]:"无"}}</view>
				<view>课程类别：{{gradeinfo[3]?gradeinfo[3]:"无"}}</view>
				<view>学分：{{gradeinfo[4]?gradeinfo[4]:"无"}}</view>
				<view>总评成绩：{{gradeinfo[5]?gradeinfo[5]:"无"}}</view>
				<view>最终：{{gradeinfo[6]?gradeinfo[6]:"无"}}</view>
				<view>绩点：{{gradeinfo[7]?gradeinfo[7]:"无"}}</view>
			</view>
			<view class="mini-title">排名
				<view class="edit-tip"><view>* 仅统计所有在本平台查询的用户</view></view>
			</view>
			
			<view class="grade-detail">
				<view>专业排名：{{dataloading?'加载中...':graderank.major_rank}}</view>
				<view>学院排名：{{dataloading?'加载中...':graderank.academy_rank}}</view>
				<view>学校排名：{{dataloading?'加载中...':graderank.school_rank}}</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gradeinfo:[],
				graderank:{},
				semester:'',
				data1Ready:false,
				dataloading:true,
				config:{
					title:"成绩详情", //title
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
		onLoad(e) {
			uni.showLoading({title:"加载中"})
			// this.gradeinfo = e.info.split(',')
			this.gradeinfo = uni.getStorageSync("gradeItemInfo")
			// console.log(e)
			this.semester = e.semester
			this.data1Ready = true
			uni.hideLoading()
			this.getcourserank(this.gradeinfo[2])
		},
		methods: {
			async getcourserank(coursename){
				let [err,res] = await this.$http.get('/user/rank/subject',{
					semester:this.semester,
					coursename:coursename
				},{
					token:true,
					checkToken:true
				});
				
				if (!this.$http.errorCheck(err,res)) {
					// plus.nativeUI.toast(res.data.msg)
					return;
				}
				this.dataloading = false
				// console.log(res)
				this.graderank = res.data.data
			}
		}
	}
</script>

<style>
	.edit-tip view{
		/* margin-left: 5upx; */
		text-align: left!important;
		padding: 0 30upx;
		font-size: 20upx;
		color: #9B9B9B;
	}
	.grade-detail>view{
		padding: 10upx 30upx;
		border-top: 1upx dashed #e4e4e4;
		color: #323232;
		word-break: break-all;
	}
	.grade-detail>view:last-child{
		border-bottom: 1upx dashed #e4e4e4;
	}
	.mini-title{
		color: #323232!important;
		font-size: 36upx;
		text-align: center;
		box-sizing: border-box;
		padding: 20upx 0 10upx 0;
	}
</style>
