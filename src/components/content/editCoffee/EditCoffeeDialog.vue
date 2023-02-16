<script setup>
import { reactive, toRaw, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { saveCoffee } from '@/network/coffee'
import useVerify from '@/utils/useCoffeeVerify';

// 从父组件中拿到控制弹窗的方法和是否显示弹窗的标记
const props = defineProps({
  form: Object,
  dialogVisible: Boolean,
  editDialogClick: Function,
  getPagingCoffees: Function
})

const ruleFormRef = ref(null)

const form = toRaw(props.form)
// 当前编辑咖啡记录的id
const coffeeId = form.coffeeId

const editForm = reactive({
  coffeeName: form.coffeeName,
  coffeeDescription: form.coffeeDescription,
  priceTag: form.priceTag,
  stock: form.stock,
  type: form.type,
})

// 取消编辑
const handleClose = () => props.editDialogClick(false)

const handleSave = () => {
  ruleFormRef.value.validate(value => {
    if(!value) {
      return ElMessage({ // 填写规则不正确
        type: 'error',
        message: '请按规则填写 !',
        duration: 1000
      })
    }
    saveCoffee(coffeeId, editForm).then(res => {
      if(res.msg === 'success') { // 编辑成功
        props.getPagingCoffees()
        props.editDialogClick(false)
        return ElMessage({
          type: 'success',
          message: '编辑成功 !',
          duration: 1000
        })
      } else if(res.msg === 'Repeated') { // 咖啡名称已存在
        return ElMessage({
          type: 'error',
          message: '用户名已存在 !',
          duration: 1000
        })
      } else {
        ElMessage({ // 服务器错误
          type: 'error',
          message: '网络异常 !',
          duration: 1000
        })
      }
    })
  })
}

const { rules } = useVerify()
</script>

<template>
  <!-- 编辑咖啡的弹窗 -->
  <div class="edit-coffee">
    <el-dialog
    center
    title="编辑咖啡"
    v-model="dialogVisible"
    append-to-body
    :show-close="false"
    width="50%"
    :destroy-on-close="true"
    :before-close="handleClose"
    >
      <div>
        <el-form
          ref="ruleFormRef"
          :rules="rules"
          :model="editForm"
          label-width="120px"
          status-icon
        >
          <el-form-item label="咖啡名称" prop="coffeeName">
            <el-input v-model="editForm.coffeeName" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="咖啡类别" prop="type">
            <el-select v-model="editForm.type" placeholder="请选择你的类别">
              <el-option label="拿铁" value="Latte"></el-option>
              <el-option label="卡布奇诺" value="Cappuccino"></el-option>
              <el-option label="摩卡咖啡" value="CafeMocha"></el-option>
              <el-option label="速溶咖啡" value="Espresso"></el-option>
              <el-option label="马琪雅朵" value="Machiatto"></el-option>
              <el-option label="美式咖啡" value="Americano"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="咖啡简介" prop="coffeeDescription">
            <el-input
              type="textarea"
              style="width: 500px;"
              v-model="editForm.coffeeDescription"
            ></el-input>
          </el-form-item>
          <el-form-item label="原价(元)" prop="priceTag">
            <el-input type="input" placeholder="请输入原价" v-model="editForm.priceTag" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="现有库存" prop="stock">
            <el-input placeholder="请输入库存" v-model.number="editForm.stock" type="input" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="large" @click="handleClose">取消</el-button>
            <el-button type="primary" size="large" @click="handleSave">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
  .edit-coffee {
    .el-message {
      background-color: #f0f9eb;
      color: #67c23a;
    }
  }
</style>
