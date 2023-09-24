<template>
	<view class="Note" @click="check" @longpress="editAccount">
		<view class="Name">{{Name}}</view>
		<view class="Remark">{{Remark}}</view>
		
	</view>
</template>

<script>
	export default {
		props: {
			Name: {
				type: String,
				default: "账本名称"
			},
			Remark: {
				type: String,
				default: "备注内容备注内容备注内容备注内容备注内容备注内容备注内容备注内容备注内容备注内容备注备注内容备注"
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			check() {
				uni.navigateTo({
					url: "/pages/account?Name="+this.Name
				});
				setTimeout(function() {
				  uni.$emit('getRemark',this.Remark);
				}, 1);
				
			},
			editAccount() {
				uni.$emit("editAccount",this.Name);
			}
		}
	}
</script>

<style>
.Note {
  box-sizing: border-box;
  width: 340rpx;
  height: 310rpx;
  background: #ffffff; 
  border-radius: 10rpx;
  padding: 20rpx;
}

.Name {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.Remark {
  font-size: 28rpx;
  color: #777777;
}
</style>