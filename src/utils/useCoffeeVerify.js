import { reactive } from "vue"

// 对咖啡字段进行校验（目前用于添加和编辑咖啡信息的校验）

// 表单校验
export default function useVerify() {
  // 对原价进行限制
  const validatePriceTag = (_, value, callback) => {
    if(isNaN(value)) callback(new Error('请输入有效的值'))
    else if (value <= 0 || value >= 600) callback(new Error('价格范围必须在1~599之间'))
    else callback()
  }
  // 对库存进行限制
  const validateStock = (_, value, callback) => {
    setTimeout(() => {
      if (!Number.isInteger(value)) {
        callback(new Error('库存必须是一个整数'))
      } else {
        if (value < 0) {
          callback(new Error('库存不能小于0'))
        } else {
          callback()
        }
      }
    }, 300)
  }
  // 表单验证规则
  const rules = reactive({
    coffeeName: [
      {
        required: true,
        message: '请输入咖啡名称',
        trigger: 'blur',
      },
      {
        max: 30,
        message: '咖啡名称不能超过30个字符',
        trigger: 'blur',
      }
    ],
    type: [
      {
        required: true,
        message: '请选择咖啡类型',
        trigger: 'change'
      },
    ],
    coffeeDescription: [
      {
        required: true,
        message: '请输入咖啡简介',
        trigger: 'blur'
      },
      {
        max: 32,
        message: '咖啡简介不能超过32个字符',
        trigger: 'blur'

      }
    ],
    priceTag: [
      {
        required: true,
        message: '请输入原价',
        trigger: 'blur'
      },
      {
        validator: validatePriceTag,
        trigger: 'blur'
      },
    ],
    stock: [
      {
        required: true,
        message: '请输入库存',
        trigger: 'blur'
      },
      {
        validator: validateStock,
        trigger: 'blur'
      }
    ]
  })
  return {
    rules
  }
}