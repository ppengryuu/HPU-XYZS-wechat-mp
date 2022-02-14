<template>
  <div class="mpvue-picker">
    <div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
    <div class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
      <div class="mpvue-picker__hd" catchtouchmove="true">
        <div class="mpvue-picker__action" @click="pickerCancel">取消</div>
        <div class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">确定</div>
      </div>
      <picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange">
        <block>
          <picker-view-column>
            <div class="picker-item" v-for="(item,index) in AweekDataList" :key="index">第{{item.label}}周 {{index+1==inSchoolww?'(本周)':''}}</div>
          </picker-view-column>
        </block>
      </picker-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
		inSchoolww:Number,
      pickerValue: [0, 0, 0],
      weekDataList: [],
      startsecDataList: [],
      endsecDataList: [],
			/* 是否显示控件 */
			showPicker: false,
    };
  },
  computed:{
	AweekDataList(){
		var data = []
		for(var i=1;i<31;i++){
			data.push({
				label:i.toString(),
				value:i.toString()
			})
		}
		return data;
	}  
  },
  mounted() {
  		  this.inSchoolww = this.schoolww
		  console.log(this.schoolww)
  },
  created() {
    this.init()
  },
  props: {
    /* 默认值 */
    pickerValueDefault: {
      type: String,
	  default:'1'
    },
    /* 主题色 */ 
    themeColor: String,
	schoolww:Number
  },
	watch:{
		pickerValueDefault(){
			this.init();
		}
	},
  methods: {
		init() {
			let index = this.AweekDataList.findIndex(value =>{
				return value.label === this.pickerValueDefault;
			});
			console.log(this.pickerValueDefault,index)
			this.pickerValue[0] = index
		},
    show() {
      setTimeout(() => {
        this.showPicker = true;
      }, 0);
    },
    maskClick() {
      this.pickerCancel();
    },
    pickerCancel() {
      this.showPicker = false;
      this._$emit('onCancel');
    },
    pickerConfirm(e) {
      this.showPicker = false;
      this._$emit('onConfirm');
    },
    showPickerView() {
      this.showPicker = true;
    },
    pickerChange(e) {
		console.log(e.mp.detail)
      let changePickerValue = e.mp.detail.value;
	  if (this.pickerValue[0] !== changePickerValue[0]) {
	    // 第一级发生滚动
	  }
	  this.pickerValue = changePickerValue;
	  this._$emit('onChange');
    },
    _$emit(emitName) {
      let pickObj = {
        label: this._getLabel(),
        value: this._getValue(),
      };
      this.$emit(emitName, pickObj);
    },
    _getLabel() {
      let pcikerLabel =
	  '第'+this.AweekDataList[this.pickerValue[0]].label+'周'
      return pcikerLabel;
    },
	_getValue(){
		var value = this.AweekDataList[this.pickerValue[0]].label
		var obj = {
			index:parseInt(value)-1
		}
		return obj;
	}
  }
};
</script>

<style>
.pickerMask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.mpvue-picker-content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
}
.mpvue-picker-view-show {
  transform: translateY(0);
}
.mpvue-picker__hd {
  display: flex;
  padding: 9px 15px;
  background-color: #fff;
  position: relative;
  text-align: center;
  font-size: 17px;
}
.mpvue-picker__hd:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}
.mpvue-picker__action {
	font-size: 32upx;
  display: block;
  flex: 1;
  color: #1aad19;
}
.mpvue-picker__action:first-child {
  text-align: left;
  color: #888;
}
.mpvue-picker__action:last-child {
  text-align: right;
}
.picker-item {
  text-align: center;
  line-height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
}
.mpvue-picker-view {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 238px;
  background-color: rgba(255, 255, 255, 1);
}
</style>
