<template>
	<view class="navigation-bar" :style="{height:height}">
		<view class="navigation-bar-fixed" :style="{height:height,background:(!config.transparent&&!config.linear)?config.bgcolor:'transparent'}">
			<!-- custom plus -->
			<view v-if="[1,2].indexOf(config.type)!= -1" :class="config.type==1?'navigation-bar-capsule':'navigation-bar-textbox'" :style="{top:marginTop}">
				<block v-for="(item,m) in config.buttons" :key ="m">
					<view class="button-action" hover-class="button-action-active" hover-stay-time="100" @tap="emitIndex(m)">
						<view :style="{width:item.width?item.width:'auto','border-left': m>0?'1px solid rgba(238, 238, 238, .3)':''}">
							<view style="padding: 0 8px;" class="custom-describe u-f-ac">
								<view v-if="item.iconfont" :class="'icon iconfont '+item.iconfont"></view>
								<text v-if="item.text" :style="{color:item.fontColor?item.fontColor:'#0c0c0c','font-size':item.fontSize?item.fontSize:'13.5px'}">{{item.text}}</text>
							</view>
						</view>
					</view>
					 
				</block>
			</view>
			
			<!-- title -->  
			<view v-if="config.linear" class="navigation-bar-title" :style="'margin-top:'+marginTop+';color:'+config.fontcolor+';opacity:'+scrollTop/scrollMaxHeight">
				{{config.title}}
			</view>
			
			<view v-else class="navigation-bar-title" :style="'margin-top:'+marginTop+';color:'+config.fontcolor">
				{{config.title}}
			</view>
			
			<!-- linear background -->
			<view v-if="config.linear" class="navigation-bar-linear" :style="{height:height,background:config.bgcolor,opacity:scrollTop/scrollMaxHeight}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		computed:{
			height(){
				const {platform,statusBarHeight} = uni.getSystemInfoSync()
				let height = statusBarHeight +4 //ios 24px
				if (platform.toLowerCase() == "android" ){
					height +=4 //android 28px
				}
				// 胶囊高度 32px 下边框6px height 状态栏高度
				this.$emit("navHeight", {height: height+ 38})
				return height+ 38 + "px"
			},
			marginTop(){
				const {platform,statusBarHeight} = uni.getSystemInfoSync()
				let height = statusBarHeight +4
				if (platform.toLowerCase() == "android" ){
					height +=4
				}
				return height + "px"				
			}
		},
		updated() {
			console.log(this.config)
		},
		mounted() {
			console.log(this.config)
			
		},
		props:{
			config:{
				type:Object,
				default(){
					return {
						title:"",
						bgcolor:{
							type:String,
							default:"#f8f8f8"
						},
						type:1,
						linear:false,
						transparent:false,
						fontcolor:"#0c0c0c",
						buttons:[]
					}
				}
			},
			scrollTop:{
				type:Number,
				default:0
			},
			scrollMaxHeight:{
				type:Number,
				default:288
			}
		},
		methods:{
			titleTap(){
				
			},
			emitIndex(e){
				this.$emit("buttonTap",{index:e,text:this.config.buttons[e].text})
			}
		}
	}
</script>

<style lang="scss">
	.custom-describe>view{
		font-size: 15px!important; 
	}
	.navigation-bar{
		width: 100%;
		box-sizing: border-box;
		.navigation-bar-fixed{
			width: 100%;
			position: fixed;
			top:0;
			box-sizing: border-box;
			z-index: 9999999999999;
			background: #fff;
			display: flex;
			justify-content: center;
			.navigation-bar-linear{
				width: 100%;
				position: absolute;
				box-sizing: border-box;
				z-index: -1;
			}
			.navigation-bar-title{
				text-align: center;
				width: 280upx;
				line-height: 32px;
				height: 32px;
				color: #fff;
				font-size: 15px;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.navigation-bar-custom-capsule{
				position: absolute;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 32px;
				left: 10px;
				background-color: rgba(255,255,255,.5);
				border-radius: 16px;
				padding: 0 23upx;
				// border:0.5px solid rgba(255,255,255,.3);
				box-sizing: border-box;
				overflow: hidden;
				z-index: 9;
				.custom-icon{
					width: 45upx;
					height: 45upx;
				}
				.custom-describe{
					font-size: 28upx;
				}
			}
			.navigation-bar-custom-textbox{
				position: absolute;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 32px;
				left: 0px;
				padding: 0 23upx;
				// border:0.5px solid rgba(255,255,255,.3);
				box-sizing: border-box;
				overflow: hidden;
				z-index: 9;
				.custom-icon{
					width: 55upx;
					height: 55upx;
				}
				.custom-describe{
					font-size: 32upx;
				}
			}
			.navigation-bar-textbox{
				position: absolute;
				// height: 32px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				line-height: 32px;
				height: 32px;
				font-size: 30upx;
				// width: 85px;
				min-width: 36px;
				left: 0px;
				// border:0.5px solid rgba(255,255,255,.3);
				box-sizing: border-box;
				overflow: hidden;
				z-index: 9;
				.button-action{
					flex: 1;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					.button_clear{
						line-height: 1;
						background-color: transparent;
						border: none;
						margin: 0;
						padding: 0;
					}
					.button_clear::after{
						border:none;
					}
					image{
						width: 60upx;
						height: 60upx;
						padding: 6upx;
						box-sizing: border-box;
					}
				}
				.button-v-line{
					width: 0.5px;
					height: 18px;
					background-color: rgba(0,0,0,.2);
				}
			}
			.navigation-bar-capsule{
				position: absolute;
				// height: 32px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				line-height: 32px;
				height: 32px;
				font-size: 30upx;
				// width: 89px;
				min-width: 36px;
				left: 10px;
				background-color: rgba(255,255,255,.5);
				border-radius: 16px;
				// border:0.5px solid rgba(255,255,255,.3);
				box-sizing: border-box;
				overflow: hidden;
				z-index: 9;
				.button-action{
					flex: 1;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						width: 60upx;
						height: 60upx;
						padding: 10upx;
						box-sizing: border-box;
					}
					.button_clear{
						line-height: 1;
						background-color: transparent;
						border: none;
						margin: 0;
						padding: 0;
						text-decoration: none;
					}
					.button_clear::after{
						border:none;
					}
				}
				.button-action-active{
					background-color: rgba(0,0,0,.3)
					
				}
				.button-v-line{
					width: 0.5px;
					height: 18px;
					background-color: rgba(0,0,0,.2);
				}
			}
		}
	}


</style>
