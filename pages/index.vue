<template>
	<view>
		<image class="MenuButton" src="../static/menu.png" mode="aspectFit" style="width: 60rpx; height: 60rpx;" @click="switchMenu()"></image>
		<uni-popup ref="datasyncs" type="message">
			<uni-popup-message :type="success" :message="datasyncsuccessmessage" :duration="2000"></uni-popup-message>
		</uni-popup>
		<view class="Menu" v-show="showMenu">
			<view class="SubMenuButton" @click="addAccount">添加账本</view>
			<view class="Divider"><view class="Line"></view></view>
			<view class="SubMenuButton" @click="addDetail">添加收支记录</view>
			<view class="Divider"><view class="Line"></view></view>
			<view class="SubMenuButton" @click="dataSync">数据同步</view>
		</view>
		
		<view class="MenuCover" v-show="showMenu" @click="switchMenu"></view>
		
		<uni-popup ref="addAccount" background-color="#fff">
			<uni-popup ref="illegalAccountNameMessage" type="message">
				<uni-popup-message :type="error" :message="messages[x]" :duration="2000"></uni-popup-message>
			</uni-popup>
			<view class="AccountDialog">
				<view class="FormTitle">新账本名称</view>
				<input focus placeholder="新帐本" maxlength="7" v-model="newAccount.Name" />
				<view class="FormTitle">新账本备注</view>
				<input placeholder="备注内容" maxlength="48" v-model="newAccount.Remark" />
				<view class="FormButtonLine1">
					<button size="mini" type="default" @click="closeAddAccountDialog">取消</button>
					<button size="mini" type="primary" @click="addAccountConfirm">添加</button>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="editAccount" background-color="#fff">
			<view class="AccountDialog">
				<view class="FormTitle">账本名称：{{editingAccount.Name}}</view>
				<view class="FormTitle">账本备注</view>
				<input placeholder="备注内容" maxlength="48" v-model="editingAccount.Remark" />
				<view class="FormButtonLine2">
					<button size="mini" type="default" @click="closeEditAccountDialog">取消</button>
					<button size="mini" type="warn" @click="removeAccount">删除</button>
					<button size="mini" type="primary" @click="editAccountConfirm">修改</button>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="addDetail" background-color="#fff">
			<uni-popup ref="illegalDetailMessage" type="message">
				<uni-popup-message :type="error" :message="messages[x]" :duration="2000"></uni-popup-message>
			</uni-popup>
			<view class="DetailDialog">
				<view class="FormTitle">记录原因</view>
				<input focus placeholder="收入/支出原因" maxlength="18" v-model="newDetail.Cause" />
				<view class="FormTitle">记录数据</view>
				<input placeholder="请输入数字" maxlength="15" v-model="effect" />
				<view class="FormTitle">记录所属账本</view>
				<view style="border: 5rpx solid #888888; border-radius: 10rpx; width: 95%; height: 80rpx;">
					<rudon-multiSelector :is_using_slot="true" :localdata="range" @change="whenChanged">
						{{display}}
					</rudon-multiSelector>
				</view>
				<view class="FormButtonLine1">
					<button size="mini" type="default" @click="closeAddDetailDialog">取消</button>
					<button size="mini" type="primary" @click="addDetailConfirm">添加</button>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="dataSync" background-color="#fff">
			<uni-popup ref="datasynce" type="message">
				<uni-popup-message :type="error" :message="messages[x]" :duration="2000"></uni-popup-message>
			</uni-popup>
			<view class="DataSyncDialog">
				<view class="FormTitle GetCardLine" @click="getNewCard">点此获取邀请卡</view>
				<view class="FormTitle">卡号</view>
				<input focus placeholder="32位" maxlength="36" v-model="invitationCard.card" />
				<view class="FormTitle">卡密</view>
				<input placeholder="8位" maxlength="8" v-model="invitationCard.pwd" />
				<view class="FormButtonLine1">
					<button size="mini" type="default" @click="closeDataSyncDialog">取消</button>
					<button size="mini" type="primary" @click="dataSyncConfirm">同步</button>
				</view>
			</view>
		</uni-popup>
		
		<view class="Header">
			<view class="HeaderContent">
				全部账单
			</view>
		</view>
		<view class="AccountList">
			<view class="PackagedNote" v-for="(item, index) in $Accounts" :key="item.Name+item.Remark">
				<note :Name="item.Name" :Remark="item.Remark"></note>
			</view>
			<view class="tips">点击右上角按钮打开菜单，长按账本进行编辑</view>
		</view>
	</view>
</template>

<script>
import { effect } from "vue";
	export default {
		data() {
			return {
				x: 0,
				datasyncsuccessmessage: "",
				showMenu: false,
				newAccount: {
					Name: "",
					Remark: ""
				},
				editingAccount: {
					Name: "",
					Remark: ""
				},
				newDetail: {
					Cause: "",
					Effect: 0,
					TimeRecord: "",
					BelongsTo: []
				},
				invitationCard: {
					card: "",
					pwd: ""
				},
				effect: 0,
				display: "",
				range: [],
				success: "success",
				error: "error",
				messages: ["账本间不可重名","账本必须有一个名字","记录必须至少归属一个有效的账本","记录必须有一个名字","无效的记录数据","远程服务器出错，请联系管理员","申请邀请卡功能未开放","邀请卡不存在或邀请卡密错误"]
			}
		},
		onLoad() {
			uni.$on("editAccount",(name)=>{
				this.editAccount(name);
			})
		},
		methods: {
			whenChanged(e) {
				this.range = e;
				this.display = "";
				for (var i=0; i<this.range.length; i++) {
					if (this.range[i].is_selected) {
						this.display = this.display.concat(this.range[i].text)+",";
					}
				}
			},
			switchMenu() {
				this.showMenu = !this.showMenu;
			},
			addAccount() {
				this.switchMenu();
				this.$refs.addAccount.open('center');
			},
			addDetail() {
				this.display = "";
				this.range = [];
				for(var i=0; i<this.$Accounts.length; i++) {
					this.range.push({
						value: i,
						text: this.$Accounts[i].Name,
						is_selected: false
					});
				}
				this.switchMenu();
				this.$refs.addDetail.open('center');
			},
			dataSync() {
				this.$refs.dataSync.open('center');
			},
			closeAddAccountDialog() {
				this.$refs.addAccount.close();
			},
			closeAddDetailDialog() {
				this.$refs.addDetail.close();
			},
			closeDataSyncDialog() {
				this.$refs.dataSync.close();
			},
			addAccountConfirm() {
				if (this.newAccount.Name=="") {
					this.x = 1;
					this.$refs.illegalAccountNameMessage.open();
					return;
				}
				for (var i = 0; i<this.$Accounts.length; i++) {
					if (this.newAccount.Name == this.$Accounts[i].Name) {
						this.x = 0;
						this.$refs.illegalAccountNameMessage.open();
						return;
					}
				}
				var newAccountReal = JSON.parse(JSON.stringify(this.newAccount))
				this.$Accounts.push(newAccountReal);
				uni.setStorage({
					key: "myOritentionAccountsRecord",
					data: this.$Accounts
				});
				uni.setStorage({
					key: "myOritentionAccountsDataVersion",
					data: this.$getDataVersion()+1
				});
				this.newAccount = {
					Name: "",
					Remark: ""
				};
				this.$forceUpdate();
				this.$refs.addAccount.close();
			},
			editAccount(name) {
				this.editingAccount.Name = name;
				this.editingAccount.Remark = this.$getRemarkByAccount(name);
				this.$refs.editAccount.open('center');
			},
			closeEditAccountDialog() {
				this.$refs.editAccount.close();
			},
			removeAccount() {
				for (var i = 0; i<this.$Accounts.length; i++) {
					if (this.editingAccount.Name == this.$Accounts[i].Name) {
						this.$Accounts.splice(i,1);
					}
				}
				for (var i = 0; i < this.$Details.length; i++) {
					if (this.$Details[i].BelongsTo.includes(this.editingAccount.Name)) {
						if (this.$Details[i].BelongsTo.length == 1) {
							this.$Details.splice(i,1);
						} else {
							this.$Details[i].BelongsTo.splice(this.$Details[i].BelongsTo.indexOf(this.editingAccount.Name),1);
						}
					}
				}
				uni.setStorage({
					key: "myOritentionAccountsRecord",
					data: this.$Accounts
				});
				uni.setStorage({
					key: "myOritentionAccountsDataVersion",
					data: this.$getDataVersion()+1
				});
				this.editingAccount = {
					Name: "",
					Remark: ""
				};
				this.$forceUpdate();
				this.$refs.editAccount.close();
				
			},
			editAccountConfirm() {
				for (var i = 0; i<this.$Accounts.length; i++) {
					if (this.editingAccount.Name == this.$Accounts[i].Name) {
						this.$Accounts[i].Remark = this.editingAccount.Remark;
					}
				}
				uni.setStorage({
					key: "myOritentionAccountsRecord",
					data: this.$Accounts
				});
				uni.setStorage({
					key: "myOritentionAccountsDataVersion",
					data: this.$getDataVersion()+1
				});
				this.editingAccount = {
					Name: "",
					Remark: ""
				};
				this.$forceUpdate();
				this.$refs.editAccount.close();
			},
			addDetailConfirm() {
				if (this.newDetail.Cause == "") {
					this.x = 3;
					this.$refs.illegalDetailMessage.open();
					return;
				}
				for (var i=0; i<this.range.length; i++) {
					if (this.range[i].is_selected) {
						this.newDetail.BelongsTo.push(this.range[i].text);
					}
				}
				if (this.newDetail.BelongsTo.length==0) {
					this.x = 2;
					this.$refs.illegalDetailMessage.open();
					return;
				}
				
				let regex = /^[-]?[1-9]\d*|0$/;
				if (regex.test(this.effect)) {
					if (this.effect.charAt(0)=="-") {
						this.newDetail.Effect = this.effect;
					} else {
						this.newDetail.Effect = "+"+this.effect;
					}
				} else {
					this.x = 4;
					this.effect = "";
					this.$refs.illegalDetailMessage.open();
					return;
				}
				
				let currentTime = new Date();
				this.newDetail.TimeRecord = currentTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
				
				this.$Details.push(this.newDetail);
				uni.setStorage({
					key: "myOritentionAccountsDetailsRecord",
					data: this.$Details
				});
				uni.setStorage({
					key: "myOritentionAccountsDataVersion",
					data: this.$getDataVersion()+1
				});
				this.newDetail = {
					Cause: "",
					Effect: 0,
					TimeRecord: "",
					BelongsTo: []
				};
				this.effect = "";
				this.$refs.addDetail.close();
			},
			dataSyncConfirm() {
				uni.request({
					url: "",
					method: "POST",
					data: {
						"invitationCard": {
							"card": this.invitationCard.card,
							"pwd": this.invitationCard.pwd
						},
						"version": this.$getDataVersion(),
						"accounts": JSON.stringify(this.$Accounts),
						"details": JSON.stringify(this.$Details)
					},
					success: (res) => {
						if (res.data.code==20000) {
							this.x=7;
							this.$refs.datasynce.open();
						} else if (res.data.code==20001) {
							this.datasyncsuccessmessage = res.data.msg;
							this.$refs.dataSync.close();
							this.$refs.datasyncs.open();
						} else if (res.data.code==20002) {
							uni.setStorageSync("myOritentionAccountsRecord",JSON.parse(res.data.data.accounts));
							uni.setStorageSync("myOritentionAccountsDetailsRecord",JSON.parse(res.data.data.details));
							uni.setStorageSync("myOritentionAccountsDataVersion",res.data.data.version);
														
							this.$Accounts = JSON.parse(res.data.data.accounts);
							this.$Details = JSON.parse(res.data.data.details);
							
							this.$forceUpdate();
							uni.$emit("accountPageUpdate");
							
							this.datasyncsuccessmessage = res.data.msg;
							this.$refs.dataSync.close();
							this.$refs.datasyncs.open();
						}
					},
					fail: () => {
						this.x=5;
						this.$refs.datasynce.open();
					}
				});
			},
			getNewCard() {
				this.x=6;
				this.$refs.datasynce.open();
			}
		},
	}
</script>

<style lang="scss">
	.MenuButton {
		position: absolute;
		margin-left: 650rpx;
		margin-top: 80rpx;
		z-index: 98;
	}
	
	.Menu {
		position: absolute;
		margin-left: 440rpx;
		margin-top: 140rpx;
		z-index: 99;
		width: 280rpx;
		height: 280rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: space-around; 
		justify-content: space-around;
	}
	
	.MenuCover {
		position: absolute;
		z-index: 97;
		width: 750rpx;
		height: 1240rpx;
	}
	
	.Divider {
		width: 100%;
		height: 0.25rpx;
		display: flex;
		justify-content: center;
		.Line {
			width: 80%;
			height: 0.25rpx;
			background-color: #888888;
		}
	}
	
	.SubMenuButton {
		display: flex;
		align-items: center; 
		justify-content: center;
		width: 100%;
		text {
		}
	}
	
	.Header {
		display: flex;
		padding-top: 40rpx;
		align-items: flex-end;
		height: 240rpx;
	}
	
	.HeaderContent {
		font-weight: bold;
		font-size: 60rpx;
		padding-left: 30rpx;
		padding-bottom: 30rpx;
	}

	.AccountList {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: flex-start;
		overflow-y: scroll;
		height: 1080rpx;
	}

	.PackagedNote {
		display: flex;
		width: 50%;
		height: 340rpx;
		justify-content: center;
		padding-top: 12px;
		box-sizing: border-box;
	}
	
	.AccountDialog {
		width: 500rpx;
		height: 400rpx;
		padding-left: 20rpx;
	}
	
	.DetailDialog {
		width: 500rpx;
		height: 540rpx;
		padding-left: 20rpx;
	}
	
	.DataSyncDialog {
		width: 500rpx;
		height: 450rpx;
		padding-left: 20rpx;
	}
	
	.GetCardLine {
		text-decoration: underline;
	}
	
	.FormTitle {
		margin-top: 30rpx;
		margin-bottom: 10rpx;
		font-weight: bold;
		font-size: 24rpx;
	}
	
	.FormButtonLine1 {
		margin-top: 100rpx;
		margin-left: auto;
		width: 300rpx;
		display: flex;
		justify-content: space-around;
		
	}
	.FormButtonLine2 {
		margin-top: 150rpx;
		margin-left: auto;
		width: 420rpx;
		display: flex;
		justify-content: space-around;
		
	}
	
	input {
		margin-bottom: 20rpx;
	}
	
	.tips {
		margin-top: 30rpx;
		width: 100%;
		text-align: center;
		font-size: 25rpx;
		color: #777777;
	}
</style>