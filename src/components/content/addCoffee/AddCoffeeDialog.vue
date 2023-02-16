<script setup>
import { ref } from 'vue'
import { Plus, ZoomIn, Delete } from '@element-plus/icons-vue'
import useVerify from '@/utils/useCoffeeVerify';
import useSubmit from './useSubmit';

// 从父组件中拿到控制弹窗的方法和是否显示弹窗的标记
const props = defineProps({
  dialogVisible: Boolean,
  addDialogClick: Function,
  getPagingCoffees: Function // 用于新增之后刷新当前页面
})

// 表单实例对象
const ruleFormRef = ref(null)
// 上传组件的实例
const uploadRef = ref(null)
// 图片预览的地址
const dialogImageUrl = ref('')
// 控制预览图片的显示
const dialogVisibleImg = ref(false)

// 删除准备上传的图片
const handleRemove = () => {
  uploadRef.value.clearFiles()
  fileObj.value = ''
}
// 预览上传的图片
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisibleImg.value = true
}
// 监听文件的改变
const handleFileChange = (item) => {
  fileObj.value = item
}

// 取消弹窗（关闭弹窗）
const handleClose = () => {
  for(let key in form) form[key] = ''
  props.addDialogClick(false)
  fileObj.value = ''
}

// 表单验证
const { rules } = useVerify()
// 添加咖啡记录
let { fileObj, form, handleBlur, onSubmit } = useSubmit(ruleFormRef, props.addDialogClick, props.getPagingCoffees )
</script>

<template>
  <!-- 添加咖啡的弹窗 -->
  <div>
    <el-dialog
      center
      title="新增咖啡"
      v-model="dialogVisible"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      width="60%"
      :destroy-on-close="true"
    >
      <div>
        <el-form
          ref="ruleFormRef"
          :rules="rules"
          :model="form"
          label-width="120px"
          status-icon
        >
          <el-form-item label="咖啡名称" prop="coffeeName">
            <el-input @blur="handleBlur" v-model="form.coffeeName" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="咖啡类别" prop="type">
            <el-select v-model="form.type" placeholder="请选择你的类别">
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
              v-model="form.coffeeDescription"
            ></el-input>
          </el-form-item>
          <el-form-item label="原价(元)" prop="priceTag">
            <el-input type="input" placeholder="请输入原价" v-model="form.priceTag" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="现有库存" prop="stock">
            <el-input placeholder="请输入库存" v-model.number="form.stock" type="input" style="width: 300px"></el-input>
          </el-form-item>
          <!-- 文件上传 -->
          <el-form-item label="咖啡图片">
            <el-upload
              ref="uploadRef"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              accept=".jpg, .jpeg, .png"
              :on-change="handleFileChange"
              :limit="1"
            >
              <template #default>
                <el-icon><plus /></el-icon>
              </template>
              <template #file="{ file }">
                <div>
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <el-icon><zoom-in /></el-icon>
                    </span>
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove"
                    >
                      <el-icon><delete /></el-icon>
                    </span>
                  </span>
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-dialog v-model="dialogVisibleImg">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        <el-form-item>
            <el-button type="primary" size="large" @click="onSubmit">提交</el-button>
            <el-button type="danger" size="large" @click="handleClose">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
  </el-dialog>
  </div>
</template>

<style lang="scss">
  .el-popup-parent--hidden {
    .el-message {
      background-color: #fef0f0;
      color: #f66c6c;
    }
  }
</style>
