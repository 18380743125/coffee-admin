import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import { openVip } from '@/network/member'

// 开通会员
export default function useOpenVip(handleCurrentPageChange) {

  // 控制开通会员确认框
  let openVipDialogVisible = ref(false)

  // 暂存开通vip的id
  let openVipOfMemberId = ''
  const handleOpenVip = (flag, isOpenVip, row) => {
    if(row) openVipOfMemberId = row.userId
    openVipDialogVisible.value = flag
    isOpenVip && confirmOpenVip()
  }

  // 管理员点击了确定开通
  const confirmOpenVip = () => {
    console.log(openVipOfMemberId);
    openVip(openVipOfMemberId).then(res => {
      if(res.msg === 'success') {
        ElMessage({
          type: 'success',
          message: '开通成功 !',
          duration: 2000
        })
        handleCurrentPageChange(0, true)
      }
    })
  }
  return {
    openVipDialogVisible,
    handleOpenVip
  }
}