import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

Vue.prototype.$Accounts = getAccountsFromStorage();

Vue.prototype.$Details = getDetailsFromStorage();

function getAccountsFromStorage() {
	let ret = []
	if (uni.getStorageSync("myOritentionAccountsRecord")!="") {
		ret = uni.getStorageSync("myOritentionAccountsRecord");
	}
	return ret;
}

function getDetailsFromStorage() {
	let ret = []
	if (uni.getStorageSync("myOritentionAccountsDetailsRecord")!="") {
		ret = uni.getStorageSync("myOritentionAccountsDetailsRecord");
	}
	return ret;
}

Vue.prototype.$getDataVersion = () => {
	if (uni.getStorageSync("myOritentionAccountsDataVersion")=="") {
		uni.setStorageSync("myOritentionAccountsDataVersion",0);
	}
	return uni.getStorageSync("myOritentionAccountsDataVersion");
}

Vue.prototype.$getDetailsByAccount = (accountName) => {
	let ret = [];
	let details = getDetailsFromStorage();
	console.log(details);
	for (var i = 0; i < details.length; i++) {
		let obj = details[i];
		if (obj.BelongsTo.includes(accountName)) {
			ret.push(obj);
		}
	}
	return ret;
}

Vue.prototype.$getRemarkByAccount = (accountName) => {
	let accounts = getAccountsFromStorage();
	for (var i = 0; i < accounts.length; i++) {
		let obj = accounts[i];
		if (obj.Name == accountName) {
			return obj.Remark;
		}
	}
}

Vue.prototype.$getStatsByAccount = (accountName) => {
	let stats = [0,0,0];
	let details = Vue.prototype.$getDetailsByAccount(accountName);
	for (var i = 0; i<details.length; i++) {
		if (details[i].Effect.charAt(0)=="+") {
			stats[0] += parseInt(details[i].Effect.substring(1));
		} else {
			stats[2] += parseInt(details[i].Effect.substring(1));
		}
	}
	stats[1] = stats[0]-stats[2];
	
	console.log(stats);
	return stats;
}