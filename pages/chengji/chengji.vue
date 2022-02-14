<template>
	<view class="body" :style="{'min-height':screenHeight+'px',width:screenWidth+'px'}">
		<navigation-custom :config="config" @buttonTap="buttonTap"/>

		
		<view class="semester-changer u-f-ac">
			<view class="presem u-f-ac" @tap="gopresem"><view class="icon iconfont icon-fanhui"></view>上一学期</view>
			<view class="semetername u-f-ajc">{{semsters[semsterscurrent]}}</view>
			<view class="nextsem u-f-ac" @tap="gonextsem">下一学期<view class="icon iconfont icon-jinru"></view></view>
		</view>
		
		<view class="uni-tab-bar">
		<swiper 
		:style="{'height': swiperheight + 'px'}"
		:current="semsterscurrent"
		:duration="200"
		@change="tabChange">
			<swiper-item v-for="(items,m) in grades" :key="m">
				<scroll-view scroll-y class="list">
					<view class="grade-info">
						<view class="grade-head u-f-ac">
							<view class="course">
								<view class="pos-left">课程</view>
							</view>
							<view class="credit u-f-ajc">
								<view class="pos-right">学分</view>
							</view>
							<view class="sub-grade u-f-ajc">
								<view class="pos-right">成绩</view>
							</view>
							<view class="grade-credit u-f-ajc">
								<view class="pos-right">绩点</view>
							</view>
						</view>
						
						<block v-for="(item,n) in items" :key="n">
							<view class="grade-detail u-f" style="background: #FFFFFF;" :style="n%2==0?lighttheme:darktheme" hover-class="gl-hover" hover-stay-time="100" @tap="gotodetail(item,semsters[m])">
								<view class="ucoursename">{{item[2]}}</view>
								<view class="ucredit u-f-ajc">{{item[4]}}</view>
								<view class="usub-grade u-f-ajc">{{item[6]}}</view>
								<view class="ugrade-credit u-f-ajc">{{item[7]}}</view>
							</view>
						</block>
						<view class="gpa-part">学期GPA：{{gpa[m].gpa}}</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'',
				jwzh:'',
				academy:'',
				major:'',
				uclass:'',
				bodypb:Number,
				screenWidth:Number,
				swiperheight:Number,
				screenHeight:Number,
				semsterscurrent:0,
				semsters:[],
				grades:[],
				gpa:[],
				lighttheme:{'border-bottom':'1upx solid #eeeeee'},
				darktheme:{'border-bottom':'1upx solid #eeeeee'},
				config:{
					title:"我的成绩", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
					type:1, //type 1，3胶囊 2，4无胶囊模式
					buttons:[
						{
							iconfont:"icon-fanhui",
							width:"60px",
							text:"返回"
						},{
							iconfont:"icon-shezhi"
						}
					]
				}
				

			}
		},
		onReady() {
			uni.hideLoading()
		},
		async onLoad() {
			var data = uni.getStorageSync("schoolbind")
			if(!data){
				return uni.navigateTo({
					url:'../bangding/jiaowu/jiaowu'
				})
			}
			this.name=data.name,
			this.jwzh=data.jwzh,
			this.academy=data.academy,
			this.major=data.major,
			this.uclass=data.class,
			// console.log(data.name)
			uni.getSystemInfo({
				success: (res) => {
					this.screenWidth =res.screenWidth
					this.swiperheight = this.screenHeight =res.screenHeight-uni.getSystemInfoSync().statusBarHeight-44
				}
			})
			await this.getgrade()
			uni.$on('schoolbinddone', this.getgrade)
		},
		methods: {
			gopresem(){
				if(this.semsterscurrent>0){
					this.semsterscurrent--
				} else {
					uni.showToast({
						title:"没有更多数据了",
						icon:"none"
					})
				}
			},
			gonextsem(){
				if(this.semsterscurrent<this.grades.length-1){
					this.semsterscurrent++
				} else {
					uni.showToast({
						title:"没有更多数据了",
						icon:"none"
					})
				}
			},
			tabChange(e){
				this.semsterscurrent=e.detail.current;
			},
			async getgrade(){
				var result = uni.getStorageSync("grades")
				var gpa = result[0]
				result = result[1]
				this.gpa = gpa
				// console.log(JSON.stringify(gpa))
				let semsters = []
				let grades = []
				let collecter = []
				let gradeitem = []
				//console.log(semsters.indexOf('1'))
				for (var i=0 ;i<result.length;i++) {
					if(semsters.indexOf(result[i].semester)<0){
						if(i>0){grades.push(collecter)}
						collecter = []
						semsters.push(result[i].semester)
						gradeitem = []
						gradeitem.push(result[i].course_code)
						gradeitem.push(result[i].course_num)
						gradeitem.push(result[i].course)
						gradeitem.push(result[i].course_type)
						gradeitem.push(result[i].credit)
						gradeitem.push(result[i].overall_mark)
						gradeitem.push(result[i].final_mark)
						gradeitem.push(result[i].grade_point)
						collecter.push(gradeitem)
					} else {
						gradeitem = []
						gradeitem.push(result[i].course_code)
						gradeitem.push(result[i].course_num)
						gradeitem.push(result[i].course)
						gradeitem.push(result[i].course_type)
						gradeitem.push(result[i].credit)
						gradeitem.push(result[i].overall_mark)
						gradeitem.push(result[i].final_mark)
						gradeitem.push(result[i].grade_point)
						collecter.push(gradeitem)
					}
				}
				grades.push(collecter)
				collecter = []
				//console.log(semsters[0])
				//console.log(grades[0][2])
				this.semsters = semsters
				this.grades = grades
				return true;
			},
			gotodetail(item,semester){
				// console.log(item)
				uni.navigateTo({
					url:'chengji-detail/chengji-detail?info='+item+'&semester='+semester
				})
			},
			buttonTap(e){
				if(e.index==0){
					this.publicM.back1()
				} else if(e.index==1){
					uni.showActionSheet({
						itemList:['成绩排名','重新导入成绩'],
						success: (res) => {
							if(res.tapIndex==0){
								uni.showLoading({
									title:'获取数据中...'
								})
								uni.navigateTo({
									url:"my-ranking/my-ranking"
								})
							}else if(res.tapIndex==1){
								uni.navigateTo({
									url:"../bangding/jiaowu/jiaowu?type=2"
								})
							}
						}
					})
				}
			}
		}
	}
</script>

<style>
	.gpa-part{
		text-align: right;
		padding: 20upx 20upx 0 0;
	}
	.gl-hover{
		background: #EEEEEE!important;
	}
	.grade-head{
		padding-bottom: 20upx;
		border-bottom: 1upx solid #EEEEEE;
	}
	.grade-head>view>view{
		font-size: 30upx;
		font-weight: bold;
	}
	.grade-detail>view{
		padding: 16upx 0;
	}
	.grade-head>view,.grade-detail>view{
		width: 12%;
	}
	.grade-head>view:nth-child(1),.grade-detail>view:nth-child(1){
		width: 64%!important;
		padding-left: 16upx;
	}
	.grade-info{
		display: flex;
		flex-direction: column;
		width: 96%;
		margin-left: 2%;
		/* position: absolute; */
		height: auto;
		/* background: #007AFF; */
		background: #F8F8F8;
		margin-top: 150upx;
		padding: 30upx 0upx 20upx 0;
		box-sizing: border-box;
		border-radius: 8upx;
		box-shadow: 0 0 2upx 2upx #eeeeee;
	}
	.semester-changer{
		position: fixed;
		z-index: 9999;
		width: 100%;
		height: 10%;
		background: #FFFFFF;
		border-bottom: 1upx solid #EEEEEE;
		padding: 10upx 0;
		box-sizing: border-box;
	}
	.presem{
		width: 20%;
		box-sizing: border-box;
		color: #00a0f0;
	}
	.semetername{
		font-size: 32upx;
		width: 60%;
		background: #f6f6f6;
		box-sizing: border-box;
	}
	.nextsem{
		width: 20%;
		box-sizing: border-box;
		color: #00a0f0;
	}
	.stuinfo{
		/* position: fixed; */
		background: #00a075;
		width: 100%;
		border-bottom: 1upx solid #e6e6e6;
		padding: 16upx 30upx;
		box-sizing: border-box;
		height: 20%;
	}
	.stuinfo>view{
		color: #ffffff;
		font-size: 32upx;
	}
	
	
	.body{
		/* position: absolute;
		z-index: -1; */
		/* background: rgb(170, 170, 127); */
		/* position: relative; */
		/* box-sizing: border-box; */
	}
</style>
