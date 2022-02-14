<template>
	<view class="body">
		<navigation-custom :config="barConfig" @buttonTap="buttonTap"/>

		<view class="mini-title">我</view>
		<view class="myranking u-f-jsb u-f-ac">
			<view class="ranking">{{my_ranking}}</view>
			<view class="info-part">
				<view style="width: 100%;" class="u-f-jsb u-f-ac">
					<view>{{myname}}</view>
					<view>GPA：{{my_gpa}}</view>
				</view>
				<view>{{mydetail}}</view>
			</view>
		</view>
		
		<view class="mini-title">学霸排行
			<view class="edit-tip"><view>* 仅统计在本平台查询的用户中前100名</view></view>
		</view>
		<view class="all-ranking">
			<block v-for="(item,index) in rankinglist" :key="index">
				<ranking-list :item="item"></ranking-list>
			</block>
			
		</view>
	</view>
</template>

<script>
	import rankingList from '../../../components/my-ranking/ranking-list.vue';
	export default {
		components:{
			rankingList
		},
		data() {
			return {
				title:'专业排名',
				my_ranking:'',
				my_gpa:'',
				rankinglist:[],
				myname:'',
				mydetail:''
			}
		},
		computed:{ 
			barConfig(){ 
				return { 
					title:this.title, //title
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

		onLoad() {
			var me = uni.getStorageSync('schoolbind')
			// console.log(me)
			this.myname = me.name
			this.mydetail = me.academy+'-'+me.class
			this.gettopranklist()
		},
		methods: {
			buttonTap(e){
				if(e.index==0){
					this.publicM.back1()
				}else if(e.index==1){
					// console.log('nav tap event')
					uni.showActionSheet({
						itemList:['专业','学院','全校'],
						success: (e) => {
							if(e.tapIndex==0){
								uni.showLoading({
									title:'获取数据中...'
								})
								this.gettopranklist(0)
								this.title = '专业排名'
							}else if(e.tapIndex==1){
								uni.showLoading({
									title:'获取数据中...'
								})
								this.gettopranklist(1)
								this.title = '学院排名'
							}else if(e.tapIndex==2){
								uni.showLoading({
									title:'获取数据中...'
								})
								this.gettopranklist(2)
								this.title = '学校排名'
							}
						}
					})
				}
			},
			async gettopranklist(type){
				let [err,res] = await this.$http.get('/user/gettopranking',{
					type:type?type:0
				},{
					token:true,
					checkToken:true
				});
				console.log(res)
				var rankofme = res.data.data[0][0]
				this.my_ranking = rankofme.rank
				this.my_gpa = rankofme.gpa
				var data = res.data.data[1]
				// console.log(JSON.stringify(data))
				this.rankinglist = data
				uni.hideLoading()
				// this.my_gpa = res.data.data[0]
				// this.my_ranking = res.data.data[0][0]
			}
		}
	}
</script>

<style scoped>
	.edit-tip view{
		/* margin-left: 5upx; */
		font-size: 20upx;
		color: #9B9B9B;
	}
	.edit-tip{
		display: flex;
		flex-direction: row;
		width: 96%;
		justify-content: space-between;
	}
	.all-ranking>view:last-child{
		border-bottom: 1upx solid #EEEEEE;
	}
	.info-part>view:nth-child(1)>view:nth-child(1){
		color: #262626!important;
		font-size: 32upx!important;
	}
	.info-part>view,.info-part>view:nth-child(1)>view{
		font-size: 24upx;
		color: #9B9B9B;
	}
	.info-part{
		padding-left: 10upx;
		width: 90%;
	}
	.ranking{
		font-size: 45upx;
		text-align: center;
		color: #262626;
		/* background: #00A075; */
		width: 10%;
	}
	.myranking{
		width: 100%;
		border-top: 1upx solid #EEEEEE;
		border-bottom: 1upx solid #EEEEEE;
		box-sizing: border-box;
		padding: 10upx 10upx;
	}
	.mini-title{
		color: #323232!important;
		font-size: 32upx;
		box-sizing: border-box;
		padding: 20upx 0 10upx 30upx;
	}
		
</style>
