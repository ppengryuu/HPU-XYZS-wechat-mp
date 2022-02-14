<template>
  <view>
    <view>
      <view
        class="a-img" 
        v-for="(item, index) in viewList" 
        :key="item.elId" 
        :ref="item.elId"
        :style="{
          'right': site.x || site[0] + 'rpx',
          'bottom': site.y || site[1] + 'rpx'
        }">
        <image :style="{
          'width': imgWidth + 'rpx',
          'height': imgHeight + 'rpx'
        }" mode="widthFix" :src="item.src" :animation="item.animation"></image>
      </view>
    </view>
    <view>
      <image :src="src" mode="widthFix" :style="{
        'width': width + 'rpx',
        'height': height + 'rpx'
      }" v-if="!$slots.default" @click="handleClick"></image>
      <view class="el_like_btn" @click="handleClick">
        <slot></slot>
      </view>
    </view>
  </view>
  
</template>

<script>
	export default {
    props: {
      src: {
        type: String,
        default: '/static/images/aixin.png'
      },
      showImgs: { // 显示图标路径
        type: Array,
        default: () => {
          return [
            `data:image/png;base64,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`,
            '/static/images/aixin.png',
          ]
        }
      },
      duration: { // 动画效果时间
        type: Number,
        default: 5000
      },
      range: { // x 间隔幅度
        type: Number,
        default: 50
      },
      high: {
        type: Number,
        default: 360
      },
      width: { // 图标宽度
        type: Number || String,
        default: 52
      },
      height: { // 图标高度
        type: Number || String,
        default: 52
      },
      imgWidth: { // 图标宽度
        type: Number || String,
        default: 52
      },
      imgHeight: { // 图标高度
        type: Number || String,
        default: 52
      },
      throttle: { // 点击节流 ms
        type: Number,
        default: 200
      },
      site: { // x y 坐标 [x<Number>, y<Number>]
        type: Array || Object, 
        default: () => {
          return [30, 160] || { x: 30, y: 160 }
        }
      },
      large: { // 是否缩放冒泡
        type: [Number, Boolean],
        default: false
      },
      alone: {
        type: Boolean,
        default: true
      }
    },
		data() {
			return {
				viewList: [], // 渲染元素
        elId: 0, // 元素渲染id
				oldTime: 0, // 全局时间用于函数节流
        timer: null // 定时器
			}
		},
		methods: {
			handleClick (e) {
				console.log(e)
        // console.log(this.viewList.length)
				// 函数节流
        let interval = e.timeStamp - this.oldTime
				if(interval < this.throttle) return null;
        this.oldTime = e.timeStamp
        let animation = {}
        // 创建animate配置
        // #ifdef APP-NVUE
				animation = weex.requireModule('animation')
        // #endif
				let randomImg = Math.floor(Math.random() * this.showImgs.length)
				let _item = {
					elId: 'el_likeicon_' + this.elId, // 生成元素ref
					src: this.showImgs[randomImg],	// 随机图标
					animation: animation, // 每个盒子动画
					x: Math.ceil(Math.random() * this.range),	// 方向间距
					q: Math.floor(Math.random() * 2), // 随机方向
				}
        
				// 动画
        let _abs = ['-', '']
        let _dirX = Number(_abs[_item.q] + _item.x)		// 随机的方向和间距
        let _dirY = this.high - Math.random() * 10
        // 生成DOM
				this.elId ++
				this.viewList.push(_item)
        // #ifndef APP-NVUE
        _item.animation = uni.createAnimation({
          duration: this.duration,
          timingFunction: 'ease-out',
        })
        setTimeout(() => {
          // console.log('animation finished.')
          // 完成后事件回调
          this.$emit('finished')
          // 逐渐消失
          if (this.alone) return this.viewList.splice(0, 1);
          // 完成动画后在n秒后清空
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.viewList = []
          }, this.duration)
        }, this.duration)
        // #endif
        // 执行动画
        setTimeout(() => {
          let _n = 1
          if (this.large) _n = typeof(this.large) === 'number' ? this.large : 2;
          // #ifndef APP-NVUE
          _item.animation.translateY(-_dirY).translateX(_dirX).scale(_n, _n).opacity(0).step()
          _item.animation = _item.animation.export()
          // #endif
          // #ifdef APP-NVUE
          let el = this.$refs[_item.elId][0];
          clearTimeout(this.timer)
          _item.animation.transition(el, {
            styles: {
              transform: `translate(${_dirX}rpx, -${_dirY}rpx) scale(${_n}, ${_n}])`,
              transformOrigin: 'center center',
              opacity: 0
            },
            duration: this.duration, // ms
            timingFunction: 'ease-out',
            delay: 0 // ms
          }, () => {
            // console.log('animation finished.')
            // 完成后事件回调
            this.$emit('finished')
            // 逐渐消失
            if (this.alone) {
              setTimeout(() => {
                this.viewList.splice(0, 1)
              }, 0)
              return null
            } else {
              // 完成动画后在n秒后清空
              clearTimeout(this.timer)
              this.timer = setTimeout(() => {
                this.viewList = []
              }, this.duration)
            }
          })
          // #endif
        }, 100)
        // 点击立即触发组件事件
        this.$emit('handleClick', this.elId)
			}
		}
	}
</script>

<style lang="scss">
	.a-img {
		position: fixed;
		z-index: 100;
	}
</style>
