<template>
	<view>
		<view class="u-f">
			<!-- 节次 -->
			<view>
				<view v-for="(item,n) in [1,2,3,4,5,6,7,8,9,10]" :key="n" :style="{
					'width':0.09*contentWidth+'px',
					'height':0.092*contentHeight+'px', 
					'color':'#282828',
					'background':'rgba(250, 254, 255, 0.8)',
					'box-sizing':'border-box',
					'border-bottom':'1px dashed rgb(219, 219, 219)'
				}" class="u-f-ajc">
					<view>
						<view class="u-f-ajc" style="color: #9c9c9c;font-size: 25rpx;line-height: 40rpx;">{{item}}</view>
						<view class="u-f-ajc" style="color: #666;font-size: 25rpx;line-height: 40rpx;">{{lefttime[n]}}</view>
					</view>
				</view>
			</view>
			<!-- 课程表 -->
			<view>
				<view v-for="(s,i) in [1,2,3,4,5,6,7,8,9,10]" :key="i" class="u-f">
					<view v-for="(w,j) in [1,2,3,4,5,6,7]" :key="j">
						<view :style="{
							'width':0.13*contentWidth+'px',
							'height':0.092*contentHeight+'px',
							'position':'relative',
							'z-index':100-s
						}">
							<view v-for="(item,k) in courseslist" :key="k">
								<view v-if="item.weekday==w&&item.sections[0]==s" :style="{
									'box-sizing':'border-box',
									'height':(item.sections.length*0.092*contentHeight)-3+'px',
									'width':(0.13*contentWidth)-3+'px',
									'position':'absolute',
									'right':'1.5px',
									'top':'1.5px',
									'padding':'2px',
									'line-height':'35rpx',
									'font-size':'25rpx',
									'color':'#fff',
									'border-radius': '2px',
									'background':isBoxColor(item)?Palette[s+w+customTheme]:'#b6b6b6'
								}" style="word-break: break-all;overflow: hidden;" @tap="tapCourse(item.ids)">
									{{BoxText(item)}}
									
								</view>
								<view v-if="item.weekday==w&&item.sections[0]==s&&item.ids.length>1" class="morecDot"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		props:{
			schoolww:{
				default:1,
				type:Number
			},
			customTheme:{
				default:0,
				type:Number
			},
			coursesObject:{
				type:Object,
				default() { return {} }
			},
			courseslist:{
				type:Array,
				default() { return [] }
			},
			contentWidth:{
				type:Number,
				default:0
			},
			contentHeight:{
				type:Number,
				default:0
			},
			lefttime:{
				type:Array,
				default() { return [] }
			}
		},
		data() {
			return {
				Palette:[
					"#f05261", "#f3db49", "#76bfcd", "#b495e1", "#ff9800", "#8bc34a","#48a8e4", 
					"#ffd061", "#52db9a", "#70d3e6", "#52db9a", "#f3d147", "#4adbc3", "#f05261",
					"#f3db49", "#76bfcd", "#b495e1", "#ff9800", "#8bc34a","#48a8e4", "#ffd061", 
					"#52db9a", "#70d3e6", "#52db9a", "#f3d147", "#4adbc3","#f05261", "#f3db49", 
					"#76bfcd", "#b495e1", "#ff9800", "#8bc34a","#48a8e4", "#ffd061", "#52db9a", 
					"#70d3e6", "#52db9a", "#f3d147", "#4adbc3", "#f05261","#f3db49", "#76bfcd", 
					"#b495e1", "#ff9800", "#8bc34a","#48a8e4", "#ffd061", "#52db9a", "#70d3e6", 
					"#52db9a", "#f3d147", "#4adbc3","#f05261", "#f3db49", "#76bfcd", "#b495e1", 
					"#ff9800", "#8bc34a","#48a8e4", "#ffd061", "#52db9a", "#70d3e6", "#52db9a", 
					"#f3d147", "#4adbc3", "#f05261","#f3db49", "#76bfcd", "#b495e1", "#ff9800", 
					"#8bc34a","#48a8e4", "#ffd061", "#52db9a", "#70d3e6", "#52db9a", "#f3d147", 
					"#4adbc3","#f05261", "#f3db49", "#76bfcd", "#b495e1", "#ff9800", "#8bc34a",
				],
			};
		},
		computed:{
			isBoxColor(item){
				return function(item){
					var ids = item.ids
					var res = false
					ids.forEach(u => {
						res = res||this.coursesObject[u].vaildWeeks[this.schoolww]=="1"
					})
					return res
				}
			},
			BoxText(item){
				return function(item){
					var ids = item.ids
					for (var i=0;i<ids.length;i++) {
						var text = (this.coursesObject[ids[i]].course+"@")+(this.coursesObject[ids[i]].loc?this.coursesObject[ids[i]].loc:"未填写")
						if(this.coursesObject[ids[i]].vaildWeeks[this.schoolww]=="1"){
							return text;
						}
					}
					return text
					
				}
			}
		},
		onReady() {
			this.$emit("timetableReady", true)
			uni.hideLoading()
		},
		created() {
			this.$emit("created", true)
		},
		methods:{
			tapCourse(ids){
				this.$emit("tapCourse", ids)
			}
		}
	}
</script>

<style>

</style>
