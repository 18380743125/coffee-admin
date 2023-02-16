import { ref, reactive } from 'vue'
import { uploadCoffee, isExist } from '@/network/coffee'
import { ElMessage } from 'element-plus'

// 提交表单
export default function useSubmit(ruleFormRef, addDialogClick, getPagingCoffees) {

  // 上传图片的file
  let fileObj = ref('')

  // 表单字段（不包含文件字段）
  let form = reactive({
    coffeeName: '',
    type: '',
    coffeeDescription: '',
    priceTag: '',
    stock: ''
  })

  // 输入咖啡名称失去焦点后校验名称是否已存在
  const handleBlur = () => {
    isExist(form.coffeeName).then(res => {
      if(res.msg === 'Repeated') {
        ElMessage({
          type: 'error',
          message: '咖啡名称已存在 !',
          duration: 1000
        })
      }
    })
  }

  // 处理提交表单
  const onSubmit = () => {
    const ruleFormRefVal = ruleFormRef.value
    ruleFormRefVal.validate((valid) => {
      if(!valid) {
        return ElMessage({
          type: 'error',
          message: '请按规则填写 !',
          duration: 1000
        })
      }
      if(fileObj.value === '') {
        return ElMessage({
          type: 'error',
          message: '请选择咖啡图片',
          duration: 1000
        })
      }
      // 校验通过直接上传咖啡记录
      uploadCoffee(fileObj.value, form).then(res => {
        if(res.msg === 'Repeated') { // 咖啡名已重复
          return ElMessage({
            type: 'error',
            message: '咖啡名称已存在 !',
            duration: 1000
          })
        } else if(res.msg === 'success') { // 添加成功
          ElMessage({
            type: 'success',
            message: '提交成功 !',
            duration: 1000
          })
          addDialogClick(false)
          for(let key in form) form[key] = ''
          // 重新刷新页面
          getPagingCoffees()
          // 将预览图片的对象删除
          fileObj.value = ''
        } else { // 服务端错误
          ElMessage({
            type: 'error',
            message: '网络异常 !',
            duration: 1000
          })
        }
      }).catch(() => { // 网络异常
        ElMessage({
          type: 'error',
          message: '网络异常 !',
          duration: 1000
        })
      })
    })
  }
  return {
    fileObj,
    form,
    handleBlur,
    onSubmit
  }
}