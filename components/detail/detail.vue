<template>
	<view class="Detail" @longpress="deleteDetail">
		<view class="Cause">{{Cause}}</view>
		<view class="Effect" :style="{color: Effect.charAt(0)=='+' ? 'green' : 'red'}">{{Effect}}</view>
		<view class="TimeRecord">{{TimeRecord}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			Cause: {
				type: String,
				default: "原因原因原因原因原因原因原因原因原因"
			},
			Effect: {
				type: String,
				default: "+xxxxxxxxxxxxxxx"
			},
			TimeRecord: {
				type: String,
				default: "记录时间：xxxx/xx/xx xx:xx:xx"
			}
		},
		data() {
			return {
			};
		},
		methods: {
			deleteDetail() {
				uni.$emit("deleteDetail",this.$Details.findIndex((value)=>{
					return (value.Cause==this.Cause&&value.TimeRecord==this.TimeRecord);
				}));
			}
		}
	}
</script>

<style>
.Detail {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	width: 750rpx;
	height: 100rpx; 
	border-radius: 20rpx;
	background: #ffffff;

}

.Cause {
	font-size: 30rpx;
	color: #777777;
	margin-right: auto;
	padding-left: 18rpx;
}

.Effect {
	font-size: 36rpx;
	font-weight: bold;
	margin-left: auto;
	padding-right: 18rpx;
}
.TimeRecord {
	width: 750rpx;
	text-align: center;
	font-size: 16rpx;
	color: #777777;
}
</style>