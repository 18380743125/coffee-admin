import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllOrderInfos, updateOrderStatus } from '@/network/order'

export default function useHandleOrder(handleCurrentPageChange, currentPage) {
  // 当前订单id(商家接单或取消订单)
  let orderId = 0

  // 控制 取消订单/接单 对话框(打开和关闭)
  let acceptConfirmVisible = ref(false)
  let cancelConfirmVisible = ref(false)

  // 操作按钮是否可用
  const isCanHandle = (state) => state !== 0

  // 接单
  const acceptConfirmClick = (flag, isConfirm, row) => {
    if(row) orderId = row.orderId
    acceptConfirmVisible.value = flag
    if(isConfirm) handleOrder(1)
  }
  // 取消订单
  const cancelConfirmClick = (flag, isConfirm, row, reason) => {
    if(row) orderId = row.orderId
    cancelConfirmVisible.value = flag
    if(isConfirm) handleOrder(3, reason)
  }
  const handleOrder = (status, reason) => {
    updateOrderStatus(orderId, status, reason).then(res => {
      if(res.msg === 'success') {
        ElMessage({
          type: 'success',
          message: '操作成功 !',
          duration: 2000
        })
      }
      // 操作完成后热刷新
      handleCurrentPageChange(currentPage.value)
    })
  }
  return {
    acceptConfirmVisible,
    cancelConfirmVisible,
    isCanHandle,
    acceptConfirmClick,
    cancelConfirmClick
  }
}