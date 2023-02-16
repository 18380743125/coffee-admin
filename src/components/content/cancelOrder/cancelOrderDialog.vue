<script setup>
import { reactive } from 'vue'

const form = reactive({ reason: '' })
const rules = reactive({
  reason: [
    {
      required: true,
      message: '请输入取消原因',
      trigger: 'blur'
    }
  ]
})

const props = defineProps({
  title: String,
  isWarning: Boolean,
  dialogVisible: Boolean,
  handleConfirm: Function
})

const handleClose = () => {
  props.handleConfirm(false, false)
}
</script>

<template>
  <div :class="{'my-confirm': isWarning}">
    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      :destroy-on-close="true"
      center
      width="30%"
      :title="title"
      top="30vh"
      :before-close="handleClose"
    >
      <el-row>
        <el-col :span="12">
          <el-form
            :model="form"
            :rules="rules"
            status-icon
            style="width: 400px;"
          >
            <el-form-item label="退单原因: ">
              <el-input
                style="width: 320px;"
                type="textarea"
                v-model="form.reason"
                placeholder="请输入退单原因..."
                rows="5"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <el-button type="primary" @click="handleConfirm(false, false)">取消</el-button>
        <el-button type="danger" @click="handleConfirm(false, true, null, form.reason)"
        >确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
</style>