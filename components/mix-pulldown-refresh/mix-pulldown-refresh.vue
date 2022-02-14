<template>
	<!-- #ifdef H5	 -->	
	<view 
		class="mix-refresh-content"
		:style="{
				transform: 'translateY('+ pageDeviation +'px)',
				transition: pageTransition + 's',
				height: 'calc(100% - ' + pageTop + 'px)',
				maxHeight: 'calc(100% - ' + pageTop + 'px)'
			}"
		@touchstart="pageTouchstart"
		@touchmove="pageTouchmove"
		@touchend="pageTouchend"
	>
	<!-- #endif -->
	<!-- #ifndef H5	 -->	
	<view 
		class="mix-refresh-content"
		:style="{
				transform: 'translateY('+ pageDeviation +'px)',
				transition: pageTransition + 's',
				height: 'calc(100vh - ' + pageTop + 'px)',
				maxHeight: 'calc(100vh - ' + pageTop + 'px)'
			}"
		@touchstart="pageTouchstart"
		@touchmove="pageTouchmove"
		@touchend="pageTouchend"
	>
	<!-- #endif -->
	
		<!-- 下拉刷新 -->
		<view class="mix-loading-wrapper">
			<image 
				class="mix-loading-icon" 
				:class="{active: refreshing, ready: refreshReady}" 
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAADd0lEQVR4nO3cP0hVYRgG8EcJIbOQKIeg/6DkYogNjRa4NZpJgbTpYlONDbnVUg2ZS4RQWW25NeTokKVTZZGZQYMFSYiBg8YX74WL4L/u9z3vdy/PD1wczvMeHzn3nnO+cyAiIiIiIiIiIiIiIiIiIiIiIiJSyaoY+/an/1qsTR0E0A6gDUATgCMA9gHYZfuyCOAngFkA0wAmAIwB+BYjfOfdmzE2s6EdyRNKdwhAD4ALAJo32dpe+2kE0FH0+3cARgAMA/ia885WZzDDeloAPAPwBcCNLZSxkWbbxoxts8Vlj7Ygx0IaADwEMAmgM/KM1bbNSctoiLjtKHIrpNOO/T2JP9+qLGPaMrORSyE1AO7Z4aSemFtvmYM2g7scCqkDMAqgz3GGXpuhznGGf7wLqQXwcs03Ii8dNkut5xCehdTYf+VpxxnWCrO88Dx8eRZyG8AZx/z1nAVwxyvcq5Au58+MzfTaiSidRyEHANz32NltGrRZqTwKuUX+avu/6m1WKnYhrQC62TtZgm6bmYZdyHXWFeZIqmxmGmYhhwGcY+5cJGHmo6wwZiGXMr+6vJ4w82VmGMtFYlZsXawgViHhTt8JUlYK4YbXMUYQq5Acz8i3q50RwiqkjZST0klGCKuQRlJOSk2MEFYhx0k5KVXUZ8h+Uk5KlMs9rEL2kHJS2s0IKccTtYrGKuR3BfwRFxkhrEJ+kHJS+sUIYRXymZST0gwjhFXIR1JOStOMEFYhE6SclKYYIaxCXpFyUhpjhLAKCc9nvCdlpfCp0j5DgkfErNiesoLYhawQ82IJMz9ghTELmbWlo+Vm1B4aomBfOhkAsFpGhazak1c07ELeAHhCzixFmPUtM9Dj4uJVAAsOudu1YLNSeRTyPfOF1gV9NiuV1+X3kcwXXA/ZjHSe90OuZHoGH2bq9wr3LGTZlmmOO86w1rjNtOw1gPcdw6WiZ/u8FZ51XPIcJIdbuIv2XxmO216GbAbKXcGN5HJPfdkeIztP/kq8YOt2ez0PU8VyW+Tw3BakDSc+o1+1jCZ7cUA2clx1Mm+vvWi1gmJekFyxbbZaxnzEbUeR8+uZpuwQVng9U3cJK+g/AHhcDq9nKof3Zc3ZRckBKyesQj9l64ULLzArvBKj+AVm4T7+a7vTN+e8DyIiIiIiIiIiIiIiIiIiIiIiIiICAH8BFhl/0a4wBhgAAAAASUVORK5CYII=">
			</image>
		</view>
		
		<slot></slot>
		
	</view>
</template>

<script>
	let startY, moveY, windowHeight = 500, platform;
	let timeDiff = 0;
	let touchending;
	export default {
		
		props: {
			top: {
				//距离顶部距离，单位upx
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				pageDeviation: 0, //下偏移量
				pageTransition: 0, //回弹过渡时间
				refreshReady: false, //进入刷新准备状态
				refreshing: false, // 进入刷新状态
			};
		},
		computed: {
			pageTop(){
				return uni.upx2px(this.top);
			}
		},
		created(){
			uni.getSystemInfo({
				success: function(e) {
					// console.log(e);
					platform = e.platform;
					windowHeight = e.windowHeight;
				}
			})
		},
		methods: {
			pageTouchstart(e){
				touchending = false;
				this.pageTransition = 0;
				startY = e.touches[0].pageY;
			},
			pageTouchmove(e){
				if(touchending){
					return;
				}
				moveY = (e.touches[0].pageY - startY) * 0.4;
				if(moveY >= 0){
					this.pageDeviation = moveY;
					
					this.$emit('setEnableScroll', false);
				}
				if(moveY >= 50 && this.refreshReady === false){
					this.refreshReady = true;
				}else if(moveY < 50 && this.refreshReady === true){
					this.refreshReady = false;
				}
				if(platform === 'ios' && e.touches[0].pageY > windowHeight + 10){
					this.pageTouchend();
				}
			},
			pageTouchend(){
				touchending = true;
				if(moveY === 0){
					return;
				}
				this.pageTransition = 0.3;
				if(moveY >= 50){
					this.startPulldownRefresh();
				}else{
					this.pageDeviation = 0;
				}
				
				if(this.refreshReady === true){
					this.refreshReady = false;
				}
				//修复下拉一点回弹后页面无法滚动的bug
				this.$emit('setEnableScroll', true);
				startY = moveY = 0;
			},
			//开启下拉刷新
			startPulldownRefresh(){
				if(+new Date() - timeDiff < 100){
					return;
				}
				timeDiff = +new Date();
				this.refreshing = true;
				this.pageDeviation = uni.upx2px(90);
				this.$emit('refresh');
			},
			//结束下拉刷新
			endPulldownRefresh(){
				this.refreshing = false;
				this.pageDeviation = uni.upx2px(0);
				//this.$emit('setEnableScroll', true);
			},
		}
	}
</script>

<style>
	.mix-refresh-content{
		display: flex;
		flex-direction: column;
		position: relative;
	}
	/* 下拉刷新部分 */
	.mix-loading-wrapper{
		position: absolute;
		left: 0;
		top: 0;
		transform: translateY(-100%);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	
	.mix-loading-icon{
		width: 70upx;
		height: 70upx;
		transition: .3s;
	}
	.mix-loading-icon.ready{
		transform: scaleX(1.3);
	}
	.mix-loading-icon.active{
		animation: loading .5s ease-in infinite both alternate;
	}
	
	@keyframes loading {
		0% {
			transform: translateY(-20upx) scaleX(1);
		}
		100% {
			transform: translateY(4upx)  scaleX(1.3);
		}
	}
	
</style>
