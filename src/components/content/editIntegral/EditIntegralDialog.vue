<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus'
import { saveIntergal } from '@/network/member'

// 从父组件中拿到控制弹窗的方法和是否显示弹窗的标记
const props = defineProps({
  memberId: Number,
  memberIntegral: Number,
  memberName: String,
  dialogVisible: Boolean,
  editDialogClick: Function,
  getPagingMember: Function
})

let ruleFormRef = ref(null)

const validateIntegral =  (_, value, callback) => {
  setTimeout(() => {
    if (isNaN(value)) {
      callback(new Error('积分必须为数字'))
    } else if((props.memberIntegral + value) < 0) {
      callback(new Error('积分不能减到为负数哟'))
    } else {
      callback()
    }
  }, 300)
}
const rules = reactive({
  integral: [
    {
      required: true,
      message: '请输入积分',
      trigger: 'blur',
    },
    {
      validator: validateIntegral,
      trigger: 'blur'
    }
  ]
})
const pointsForm = reactive({
  integral: ''
})

function handleClose() {
  props.editDialogClick(false)
}

const handleSave = () => {
  ruleFormRef.value.validate((valid) => {
    if(!valid) return
    // 校验通过
    saveIntergal(props.memberId, pointsForm.integral).then(res => {
      if(res.msg === 'success') {
        props.getPagingMember(0, true)
        props.editDialogClick(false)
        ElMessage({
          type: 'success',
          message: '保存成功 !',
          duration: 1000
        })
      } else {
        ElMessage({
          type: 'error',
          message: '网络异常 !',
          duration: 1000
        })
      }
    })
  })
}


</script>

<template>
  <!-- 修改会员积分 -->
  <div class="member-integral">
    <el-dialog
      center
      title="修改会员积分"
      v-model="dialogVisible"
      append-to-body
      :show-close="false"
      width="30%"
      top="30vh"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <el-row>
        <el-col :span="12" :offset="3"><h3>当前用户名: {{memberName}}</h3></el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="3"><h3>当前积分数: {{memberIntegral}}</h3></el-col>
      </el-row>
      <el-form
        ref="ruleFormRef"
        label-width="120px"
        :rules="rules"
        :model="pointsForm"
        status-icon
      >
        <el-form-item label="增减积分(如10, -10)" prop="integral" label-width="100" style="margin-top: 10px; margin-left: 50px;">
          <el-input type="input" v-model.number="pointsForm.integral" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 30px;">
          <el-button type="danger" size="large" @click="handleClose">取消</el-button>
          <el-button type="success" size="large" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss">
</style>