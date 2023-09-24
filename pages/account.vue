<template>
	<view>
		<uni-popup ref="deleteDetailConfirmDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="删除" title="通知" content="确认要删除该条记录吗" @confirm="deleteDetailConfirm"></uni-popup-dialog>
		</uni-popup>
		<view class="Header">
			<image src="../static/back.png" mode="aspectFit" style="width: 40rpx; height: 40rpx; margin-top: 40rpx; margin-left: 10rpx; margin-right: auto;" @click="back"></image>
		</view>
		<view class="Account">
			<view class="Title">{{Name}} - 详情</view>
			<view class="Remark">
				<view class="Text">{{Remark}}</view>
			</view>
			<view class="Stats">
				<view class="in">总收入: {{totalIncome}}</view>
				<view class="balance">净收入: {{netIncome}}</view>
				<view class="out">总支出: {{totalExpenditure}}</view>
			</view>
			<view class="Details">
				<view class="PackagedDetail" v-for="(item, index) in $getDetailsByAccount(Name)" :key="index">
					<detail :Cause="item.Cause" :Effect="item.Effect" :TimeRecord="item.TimeRecord"></detail>
				</view>
				<view class="tips">长按记录进行删除</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.Name = options.Name;
			this.Remark = this.$getRemarkByAccount(this.Name);
			this.stats = this.$getStatsByAccount(this.Name);
			this.totalIncome = this.stats[0];
			this.netIncome = this.stats[1];
			this.totalExpenditure = this.stats[2];
			
			uni.$on("deleteDetail",(index)=>{
				this.indexToBeDeleted = index;
				this.$refs.deleteDetailConfirmDialog.open();
			})
			
			uni.$on("accountPageUpdate",(index)=>{
				this.$forceUpdate();
			})
		},
		data() {
			return {
				Name: "账本名称",
				Remark: "备注内容备注内容备注内容备注内容备注内容备注内容备注内容备注内容备注内容备注内容备注备注内容备注",
				stats: [],
				totalIncome: 0,
				netIncome: 0,
				totalExpenditure: 0,
				indexToBeDeleted: -1
			}
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			deleteDetailConfirm() {
				console.log(this.indexToBeDeleted);
				this.$Details.splice(this.indexToBeDeleted, 1);
				uni.setStorage({
					key: "myOritentionAccountsDetailsRecord",
					data: this.$Details
				});
				uni.setStorage({
					key: "myOritentionAccountsDataVersion",
					data: this.$getDataVersion()+1
				});
				
				this.Remark = this.$getRemarkByAccount(this.Name);
				this.stats = this.$getStatsByAccount(this.Name);
				this.totalIncome = this.stats[0];
				this.netIncome = this.stats[1];
				this.totalExpenditure = this.stats[2];
				this.$forceUpdate();
			}
		}
	}
</script>

<style lang="scss">
.Header {
	display: flex;
	background-color: #ffffff;
	width: 100%;
	height: 160rpx;
	align-items: center;
}
.Account {
	width: 100%;
	height: 1256rpx;
	
	.Title {
		width: 100%;
		height: 80rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 50rpx;
		font-weight: bold;
	}
	
	.Remark {
		width: 100%;
		height: 160rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		.Text {
			width: 400rpx;
			font-size: 30rpx;
			color: #777777;
		}
	}
	
	.Stats {
		width: 100%;
		height: 120rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		text-align: center;
		.in {
			width: 200rpx;
			font-size: 30rpx;
			color: green;
		}
		.out {
			width: 200rpx;
			font-size: 30rpx;
			color: red;
		}
		.balance {
			width: 200rpx;
			font-size: 34rpx;
			font-weight: bold;
		}
	}
	
	.Details {
		width: 100%;
		height: 996rpx;
		overflow-y: scroll;
		display: flex;
		flex-wrap: wrap;
		padding-top: 10rpx;
		align-content: flex-start;
		.PackagedDetail {
			padding: 10rpx 0;
		}
	}
	.tips {
		margin-top: 30rpx;
		width: 100%;
		text-align: center;
		font-size: 30rpx;
		color: #777777;
	}
}
</style>
