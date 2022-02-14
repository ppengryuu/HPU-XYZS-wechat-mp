<template>
	<image :src="img_url" :mode="mode" :lazy-load="lazyLoad" :style="setStyle" @tap.stop="previewImages()"></image>
</template>

<script>
export default {
	name: 'image-cache',
    props: {
		previewarr:{
    		type: Array,
    		default(){
				return [];
			}
    	},
		previewable:false,
    	mode: {
    		type: String,
    		default: ''
    	},
        lazyLoad:{
            type:Boolean,
            default:false
        },
        imgSrc:{
            type:String
        },
        defaultImg:{
            type:String,
            default:'/static/img_load_error.png'
        },
        setStyle:{
            type:String,
            default:''
        }
    },
	data() {
		return {
            img_url:'',
			imgReferer:''
		}
	},
    watch:{
        img_url:{
            handler:function(){
                var the = this;
				// console.log('image-cache 下载地址 :'+the.imgSrc)
                uni.getStorage({
                    key:the.imgSrc,
                    success:function(res){
						// console.log(res)
                        if(res.data!=''){
                            the.img_url = res.data;
                        }else{
							// plus.downloader.clear()
							uni.downloadFile({
							    url:the.imgSrc,
							    success: (ress) => {
							        if (ress.statusCode === 200) {
							            uni.setStorage({
							                key:the.imgSrc,
							                data:ress.tempFilePath,
							                success:function(){
							                    
							                }
							            })
							            the.img_url = ress.tempFilePath;
							        }else{
							            the.img_url = the.defaultImg;
							        }
							    },
							    fail:()=>{
							        the.img_url = the.defaultImg;
							    }
							}); 
                        }
                    },
                    fail:function(res){
						// console.log(res)
						// plus.downloader.clear()
                        uni.downloadFile({
                            url:the.imgSrc,
                            success: (ress) => {
                                if (ress.statusCode === 200) {
                                    uni.setStorage({
                                        key:the.imgSrc,
                                        data:ress.tempFilePath,
                                        success:function(){
                                            
                                        }
                                    })
                                    the.img_url = ress.tempFilePath;
                                }else{
                                    the.img_url = the.defaultImg;
                                }
                            },
                            fail:()=>{
                                the.img_url = the.defaultImg;
                            }
                        }); 
                    }
                })
				this.emitdata()
                // console.log(this.img_url)
            },
            immediate: true
        }
    },
	methods:{
		emitdata(){
			this.$emit('cachedone',{data:this.imgSrc})
		},
		previewImages(){
			this.$emit('tapimg')
			// console.log(JSON.stringify(this.imgSrc) )
			if(!this.previewable){return;}
			if(!uni.getStorageSync(this.imgSrc)){
				return uni.showToast({
					title:"图片加载失败",
					icon:"none"
				})
			}
			var img_arr = []
			var item
			var currentimg = uni.getStorageSync(this.imgSrc)
			// console.log(currentimg)
			if(this.previewarr.length==0){
				img_arr.push(uni.getStorageSync(this.imgSrc))
			}
			for (var i=0;i<this.previewarr.length;i++) {
				item = uni.getStorageSync(this.previewarr[i].url)
				img_arr.push(item)
			}
			// 拿到当前对象
			let index = img_arr.findIndex(value =>{
				return value === currentimg;
			});
			uni.previewImage({
				current:img_arr[index],
				urls:img_arr
			})
		},
	}
}
</script>
<style scoped>
</style>