<script setup>

const props = defineProps({
  title: String,
  isWarning: Boolean,
  dialogVisible: Boolean,
  handleOpen: Function
})

const handleClose = () => {
  props.handleOpen(false, false)
}
</script>

<template>
  <div :class="{'my-confirm': isWarning}">
    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      :destroy-on-close="true"
      center
      width="20%"
      :title="title"
      top="30vh"
      :before-close="handleClose"
    >
      <template #footer>
        <el-button type="primary" @click="handleOpen(false, false)">取消</el-button>
        <el-button type="danger" @click="handleOpen(false, true)"
        >确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
  .my-confirm {
    .el-dialog {
      .el-dialog__header {
        .el-dialog__title {
          color: red;
        }
      }
    }
  }
</style>