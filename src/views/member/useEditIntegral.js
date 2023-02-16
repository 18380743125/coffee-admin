import { ref } from 'vue';

// 修改积分
export default function useEditIntegral() {
  // 修改积分的memberId
  let memberId = ref(0)
  // 修改积分的用户的现有积分
  let memberIntegral = ref(0)
  // 修改积分的用户名
  let memberName = ref('')
  // 控制是否显示修改积分对话框
  let editDialogVisible = ref(false)
  // 控制修改积分的对话框
  const editDialogClick = flag => editDialogVisible.value = flag
  const handleUpdateIntegral = (row) => {
    memberId.value = row.userId
    memberIntegral.value = row.points
    memberName.value = row.userName
    editDialogVisible.value = true
  }
  return {
    memberId,
    memberIntegral,
    memberName,
    editDialogVisible,
    editDialogClick,
    handleUpdateIntegral
  }
}