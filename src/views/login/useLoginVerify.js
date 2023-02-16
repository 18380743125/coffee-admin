import { reactive } from 'vue'

export default function useLoginVerify() {
  const rules = reactive({
    uname: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
      },
      {
        max: 16,
        message: '用户名不能超过16个字符',
        trigger: 'blur'
      }
    ],
    pwd: [
      {
        required: true,
        message: '请输入密码',
        trigger: 'blur'
      },
      {
        max: 16,
        message: '密码不能超过16个字符',
        trigger: 'blur'
      }
    ],
    captcha: [
      {
        required: true,
        message: '请输入验证码',
        trigger: 'blur'
      },
      {
        min: 4,
        max: 4,
        message: '验证码必须为4位',
        trigger: 'blur'
      }
    ]
  })
  return {
    rules
  }
}