<template>
    <view class="page">
		<navigation-custom :config="config" @buttonTap="publicM.cusNavOnlyBack"/>

        <view class='feedback-title'>
            <text>问题和意见</text>
        </view>
        <view class="feedback-body">
            <textarea placeholder="请详细描述你的问题和意见..." maxlength="200" v-model="data" placeholder-class="" class="phclass"/>
        </view>
		<view class="edit-tip"><view>* 最长200个字符</view><view> {{data.length+'/200'}}</view></view>
		<view class="senbutton">
			<button type="primary" class="verifybutton" hover-class="verifybuttonhover" @tap="send">提交</button>
		</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
				data:"",
				config:{
					title:"反馈和意见", //title
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
        onLoad() {
            
        },
        methods: {
            async send() { //发送反馈
				let sdata = {
					appid: "HPUBOX",
					p: "wxmp", //平台类型，i表示iOS平台，a表示Android平台。
					md: "0", //设备型号
					app_version: "0",
					os: '0',
					net: "",
					data:this.data
				}
                console.log(JSON.stringify(sdata));
				let [err,res] = await this.$http.post('/feedback',sdata);
				console.log(res)
				if (!this.$http.errorCheck(err,res)) {
					return uni.hideLoading();
				}
				uni.showToast({title:'提交成功',icon:'none'})
            }
        }
    }
</script>

<style>
    page {
        background-color: rgb(243,246,248);
    }
    view{
        font-size: 28upx;
    }
	.edit-tip{
		padding-top: 20upx;
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
	.phclass{
		box-sizing: border-box;
		width: 100%;
		padding: 20upx;
	}
	.senbutton{
		position: fixed;
		bottom: 0;
		padding: 20upx 0;
		width: 96%;
		margin-left: 2%;
	}
	.verifybuttonhover[type=primary]{
		background: #00b9ff!important;
	}
	.verifybutton{
		background: #00aaff!important;
		border-radius: 50upx!important;
	}
	button::after{ border: none;}
</style>
