import { ElMessage } from 'element-plus'
import { deleteCoffee } from '@/network/coffee'

export default function useDel(confirmDialogVisible, loading, multipleSelection, getPagingCoffees) {

  // 当前行或者选择的多行
  let delRows = null

    /**
   * 控制删除确认框的打开与关闭
   * flag 是否显示删除确认框
   * isDel 是否确认删除的标记
   * row 当前要删除的行
   */
  const  confirmDialogClick = (flag, isDel, row) => {
    if(row) delRows = (row instanceof Array) ? row : [row.coffeeId]
    confirmDialogVisible.value = flag
    isDel && handleDelete()
  }
  // 删除当前行或选择的多行
  const handleDelete = () => {
    deleteCoffee(delRows).then(res => {
      // 删除成功后刷新页面
      getPagingCoffees()
      multipleSelection.value = null
      if(res.msg === 'success') {
        ElMessage({
          type: 'success',
          message: '删除成功 !',
          duration: 2000
        })
      }
    })
  }
  // 删除选择的行数据
  const handleDelRows = () => {
    if(multipleSelection.value.length === 0) return
    const coffeeIds = []
    multipleSelection.value.map(item => coffeeIds.push(item.coffeeId))
    confirmDialogClick(true, false, coffeeIds)
  }

  return {
    confirmDialogClick,
    handleDelRows
  }
}