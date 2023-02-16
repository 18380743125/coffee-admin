import { ref, reactive, handleError } from 'vue'
import { ElMessage } from 'element-plus'
import { login } from '../../network/member'
import { setItem } from '@/utils/useLocalStorage'

// 处理登录
export default function useHandleLogin(router, handleLoginErr) {

  // 绑定表单组件的实例
  const formRef = ref(null)
  // 验证码
  let verifyCode = ref('')

  // 表单字段
  const loginForm = reactive({
    uname: '',
    pwd: '',
    captcha: ''
  })

  // 处理成功后
  function afterLogin(res) {
    setItem('userInfo', res.data)
    router.replace('/member')
  }

  const handleLogin = (params) => {
    login(params).then(res => {
      switch(res.msg) {

        case 'success':
          ElMessage({ // 登录成功
            type: 'success',
            message: '登录成功 !',
            duration: 2000
          })
          afterLogin(res)
          break
        case 'code_error':
          ElMessage({ // 提示验证码错误
            type: 'error',
            message: '验证码错误 !',
            duration: 2000
          })
          break
        case 'mismatch':
          ElMessage({ // 提示验证码错误
            type: 'error',
            message: '用户名或密码错误 !',
            duration: 2000
          })
          break
        default: ElMessage({ // 服务器错误
          type: 'error',
          message: '网络异常 !',
          duration: 2000
        })
      }
      if(res.msg !== 'success') handleLoginErr() // 登录失败重新刷新验证码和清除已输入的
    })
  }

  // 校验成功后去登录
  function submitForm() {
    const formVal = formRef.value
    formVal.validate(valid => {
      if (valid) { // 表单验证通过
        handleLogin(formVal.model)
      } else { // 验证失败
        ElMessage({
          type: 'error',
          message: '请按规则填写 !',
          duration: 2000
        })
      }
    })
  }
  return {
    formRef,
    verifyCode,
    loginForm,
    submitForm
  }
}