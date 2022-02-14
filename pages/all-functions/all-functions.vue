<template>
	<view class="bodypart2" id="boaypart2">
		<navigation-custom :config="config"/>
		<view style="background: rgb(243,246,248);position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: -999;"></view>
		
		<swiper :indicator-dots="adList.length==1?false:true" :autoplay="true" :interval="4600" :duration="300" style="height: 300rpx!important;">
			<block v-for="(item,n) in adList" :key="n">
				<swiper-item>
					<view>
						<image :src="item.src" mode="aspectFill" :style="{
						height:'280rpx',
						width:(funSideLen)*3+'px',
						'margin':'20rpx '+FZPaddingLeft+'px',
						'border-radius':'12rpx' 
						}" 
						@tap="openAD(item)">
						</image>
					</view>
				</swiper-item>
			</block>
		</swiper>
		
		<view style="height: 15rpx;"></view>
		<view class="functionzone" :style="{
			opacity: pageReady?1:0,
			'padding-left':FZPaddingLeft+'px'
		}">
			<block v-for="(item,n) in Functions1" :key="n">
				<view class="function" :style="{width:funSideLen+'px',height:funSideLen+'px'}" hover-class="f-hover" hover-stay-time="100" @tap="nFunction({functionInfo:item,index:n})" >
					<view>
						<image :src="item.icon" mode="scaleToFill"></image>
					</view>
					<view><text>{{item.name}}</text></view>
				</view>
			</block>
		</view>
		<view style="height: 50rpx;"></view>
		
		<!-- <official-account></official-account> -->
		
		<!-- <view style="height: 200rpx;width: 750rpx;background: #00A075;"></view> -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageReady:false,
				screenWidth:0,
				funSideLen:0,
				FZPaddingLeft:0,
				config:{
					title:"全部功能", //title
					bgcolor:"#f8f8f8", //背景颜色
					fontcolor:'#0c0c0c',
				},
				adList:Array,
				Functions1:[
					{
						"name":"成绩",
						"icon":"../../static/icons/chwngji_icon.png"
					},{
						"name":"课程表",
						"icon":"../../static/icons/kcb_icon.png"
					},{
						"name":"空教室",
						"icon":"../../static/icons/kjs_icon.png"
					},{
						"name":"图书馆",
						"icon":"../../static/icons/library_icon.png"
					},{
						"name":"学校贴吧",
						"icon":"../../static/icons/huati_icon2.png"
					},{
						"name":"学校地图",
						"icon":"../../static/icons/Map-Icon.png"
					},{
						"name":"校历",
						"icon":"../../static/icons/school-calender.png"
					},{
						"name":"电费查询",
						"icon":"../../static/icons/electric.png"
					},{
						"name":"捡到校园卡",
						"icon":"../../static/icons/find_school_card_icon.png"
					},{
						"name":"体测成绩",
						"icon":"../../static/icons/tice_icon.png"
					},{
						"name":"校园报修",
						"icon":"../../static/icons/baoxiu_icon.png"
					},{
						"name":"公告和讲座",
						"icon":"../../static/icons/gonggao_icon.png"
					}
					
				]
			}
		},
		onReady() {
			this.pageReady = true
		},
		onLoad() {
			this.screenWidth = uni.getSystemInfoSync().screenWidth
			this.funSideLen = this.screenWidth*0.3
			this.FZPaddingLeft = this.screenWidth*0.05
			this.getADs()
		},
		methods: {
			openAD(e){
				uni.navigateTo({
					url:"../json-docView/json-docView?url="+e.url
				})
			},
			async getADs(){
				let [err,res] = await this.$http.get('/adsense/1');
				console.log(res)
				if (!this.$http.errorCheck(err,res)) return;
				this.adList = res.data.data.list
			},
			nFunction(obj){
				var e = obj.index
				switch(e){
					case 0:
						this.entergradepage()
						break;
					case 1:
						this.entercspage()
						break;
					case 2:
						this.enterkjspage()
						break;
					case 3:
						this.entertushu()
						break;
					case 4:
						this.enterww_tieba()
						break;
					case 5:
						this.nNavgate('../school-map/school-map')
						break;
					case 6:
						this.nNavgate('../school-calender/school-calender')
						break;
					case 7:
						this.enterdl()
						break;
					case 8:
						this.enterfc()
						break;
					case 9:
						this.entertice()
						break;
					case 10:
						this.enterbaoxiu()
						break;
					case 11:
						this.entergg()
						break;
				}
			},
			
			entergg(){
				this.navCheckVpn("../school-gonggao/school-gonggao")
			},
			enterbaoxiu(){
				this.navCheckLogin("../school-logistics/school-logistics")
			},
			async entertice(){
				this.navCheckVpn("../tice-grade/tice-grade")
			},
			enterdl(){
				this.navCheckLogin("../electricity/electricity")
			},
			enterfc(){
				this.navCheckLogin("../find-school-card/find-school-card")
			},
			enterww_tieba(){
				uni.navigateToMiniProgram({
					appId: 'wx7a2de562948f667b',
					path: "pages/frs/frs?kw=河南理工大学"
				})
			},
			async enterkjspage(){
				if(!this.User.token){
					return uni.showModal({
						title:"提示",
						content:"请先登录",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({url:"../user-login/user-login"})
							}
						}
					})
				}
				uni.showLoading({ 
					title:"检查登录状态",
					// mask:true
				})
				let [err,res] = await this.$http.post('/app/freeroom/buildings',{
					user_id:this.User.userinfo.id,
				},{
					token:true,
					checkToken:true
				}); 
				console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					// plus.nativeUI.toast(res.data.msg)
					return;
				}
				var data = res.data.data.data
				uni.setStorageSync("freeroomBuildings", data)
				uni.hideLoading()
				uni.navigateTo({
					url:data?"../empty-classroom/empty-classroom":"../empty-classroom/login-new-eams/login-new-eams"
				})
			},
			entertushu(){
				this.navCheckLogin("../tushu/tushu")
			},
			entercspage(){
				uni.switchTab({url:"../timetable/timetable"})
			},
			entergradepage(){
				if(!this.User.token){
					return uni.showModal({
						title:"提示",
						content:"请先登录",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({url:"../user-login/user-login"})
							}
						}
					})
				}
				if(this.User.schoolbind){
					uni.showLoading({
						title:'获取数据中',
						// mask:true
					})
					return uni.navigateTo({url:'../chengji/chengji'})
				} else {
					return uni.showModal({
						title:"提示",
						content:"请先绑定教务",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({url:"../bangding/jiaowu/jiaowu"})
							}
						}
					})
				}
			},
			navCheckLogin(url){
				if(!this.User.token){
					return uni.showModal({
						title:"提示",
						content:"请先登录",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({url:"../user-login/user-login"})
							}
						}
					})
				} else {
					return uni.navigateTo({url:url});
				}
			},
			nNavgate(url){
				uni.navigateTo({url:url})
			},
			async navCheckVpn(url){
				if(!this.User.token){
					return uni.showModal({
						title:"提示",
						content:"请先登录",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({url:"../user-login/user-login"})
							}
						}
					})
				}
				uni.showLoading({ 
					title:"检查登录状态",
					// mask:true 
				})
				let [err,res] = await this.$http.get('/app/hpuvpn/tc/code',{
					user_id:this.User.userinfo.id,
				},{
					token:true,
					checkToken:true
				}); 
				console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					// plus.nativeUI.toast(res.data.msg)
					return;
				}
				var data = res.data.data
				// uni.setStorageSync("ticeCode", data)
				uni.hideLoading()
				uni.navigateTo({
					url:data?url:"../loginvpn/loginvpn?redirect="+url
				})
			},
		}
	}
</script>

<style>
	.f-hover{
		background: #EEEEEE!important;
	}
	.function {
		background: #FFFFFF; 
		position: relative;
		/* background: #007AFF; */
		display: flex;
		box-sizing: border-box;
		border: 1px solid #EEEEEE;
		/* flex: 1; */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.function>view:last-child {
		font-size: 26upx;
		color: #3e3e3e;
	}
	
	.functionzone {
		display: flex;
		flex-direction: row;
		/* justify-content: center; */
		/* background: #00A075; */
		margin-top: 10upx;
		flex-wrap: wrap;
	}
	.functionzone image {
		width: 70upx;
		height: 70upx;
	}
	/* .x{
		background: #60ce95;
	} */
</style>
