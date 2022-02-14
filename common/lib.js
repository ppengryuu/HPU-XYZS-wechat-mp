// 网络监听
const NetWork = {
	// 网络状态
	isConnect:false,
	// 监听网络状态
	On(){
		// 获取当前网络状态
		uni.getNetworkType({
			success: (res) => {
				if(res.networkType!=='none'){ this.isConnect=true; return;}
				// plus.nativeUI.toast('无网络')
			}
		})
		// 监听网络状态变化
		uni.onNetworkStatusChange((res)=>{
			this.isConnect = res.isConnected;
			if(!res.isConnected){
				// uni.showToast({title:'网络连接已断开',icon:'none'})
			} else {
				// uni.showToast({title:'网络已连接',icon:'none'})
				// plus.nativeUI.toast('网络已连接')
				// 初始化用户状态
				User.__init();
				// 初始化配置 
				appconfig.__init();
			}
		})
	}
}

// app更新
const Update = async function(){
	// #ifdef APP-PLUS  
	let [err,res] = await $http.get('/app/update');
	console.log(res)
	var new_version = res.data.data
	var old_version = plus.runtime.version // 当前软件版本
	var result = versionStringCompare(new_version,old_version)
	console.log(result) // 1 有新版本  0 版本相同 -1 新版本比现版本还老???
	if(result != 1){return;}else{
		appconfig.haveupdate=true
	}
	// #endif  
}

const versionStringCompare = (preVersion='', lastVersion='') => {
    var sources = preVersion.split('.');
    var dests = lastVersion.split('.');
    var maxL = Math.max(sources.length, dests.length);
    var result = 0;
    for (let i = 0; i < maxL; i++) {  
        let preValue = sources.length>i ? sources[i]:0;
        let preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
        let lastValue = dests.length>i ? dests[i]:0;
        let lastNum =  isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
        if (preNum < lastNum) {
            result = -1;
            break;
        } else if (preNum > lastNum) { 
            result = 1;
            break;
        }
    }
    return result;
}

import config from "./config.js"
import User from "./user.js";
import appconfig from "./appconfig.js";
import $http from "./request.js";

export default {
	versionStringCompare,
	NetWork,
	Update,
}