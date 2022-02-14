<template>
	<view class="rank-list u-f-ac">
		<view class="ranking">{{item.rank}}</view>
		<view class="info-part">
			<view style="width: 100%;" class="u-f-jsb u-f-ac">
				<view>{{item.stu_num==mystu_num?mystu_name:item.stu_info.name}}</view>
				<view>GPA：{{item.gpa}}</view>
			</view>
			<view>{{item.stu_info.academy+'-'+item.stu_info.class}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				mystu_num:"",
				mystu_name:""
			}
		},
		props:{
			item:Object
		},
		mounted() {
			this.mystu_num = this.User.schoolbind.jwzh
			this.mystu_name = this.User.schoolbind.name
		}
	}
</script>

<style scoped>
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
	.rank-list{
		width: 100%;
		border-top: 1upx solid #EEEEEE;
		box-sizing: border-box;
		padding: 10upx 10upx;
	}
</style>
