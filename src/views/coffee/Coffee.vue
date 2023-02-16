<script setup>
import { ref } from 'vue'
import { Search, CirclePlusFilled, Edit, Delete } from '@element-plus/icons-vue'
import AddCoffeeDialog from '@/components/content/addCoffee/AddCoffeeDialog.vue'
import EditCoffeeDialog from '@/components/content/editCoffee/EditCoffeeDialog.vue';
import MyConfirm from '@/components/common/MyConfirm.vue';
import useDel from './useDel'
import useSelect from './useSelectCoffee'

let loading = ref(true)
// 控制确认删除咖啡的确认框的显示
let confirmDialogVisible = ref(false)
// 控制是否打开新增咖啡的对话框
let addDialogVisible = ref(false)
// 控制是否显示编辑对话框
let editDialogVisible = ref(false)
// 正在编辑的当前行
let editRow = ref('')
// 多行选择(选择的所有行数据)
const multipleSelection = ref([])
// 对价格展示加工
const handlePrice = (_r, _c, content) => {
  return '￥' + content
}

// 暂存当前编辑的行
const handleEdit = (row) => {
  editRow.value = row
  editDialogVisible.value = true
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
// 控制新增咖啡的弹窗
const addDialogClick = (flag) => {
  addDialogVisible.value = flag
}
// 控制编辑咖啡的弹窗
const editDialogClick = flag => {
  editDialogVisible.value = flag
  editRow.value = ''
}
// 查询咖啡的钩子函数
let {
  search,
  coffeeData,
  currentPage,
  totalCount,
  coffeeType,
  getPagingCoffees,
  handleCurrentPageChange,
  handleSearch,
  handleTypeChange,
} = useSelect(loading)
// 操作删除咖啡信息的钩子函数
const {
  confirmDialogClick,
  handleDelRows
} = useDel(confirmDialogVisible, loading, multipleSelection, getPagingCoffees)
</script>
<template>
  <MyConfirm
    title="你确认要删除吗?"
    :isWarning="true"
    :dialogVisible="confirmDialogVisible"
    :handleOpen="confirmDialogClick"
  />
  <AddCoffeeDialog
    :dialogVisible="addDialogVisible"
    :addDialogClick="addDialogClick"
    :getPagingCoffees="getPagingCoffees"
  />
  <EditCoffeeDialog
    v-if="editRow !== ''"
    :dialogVisible="editDialogVisible"
    :editDialogClick="editDialogClick"
    :form="editRow"
    :getPagingCoffees="getPagingCoffees"
  />
  <div style="padding: 10px; background-color: #fff; position: relative;">
    <!-- 操作区域 -->
    <el-row :gutter="10" style="height: 60px;" align="middle">
      <el-col :span="2"><el-button @click="handleDelRows" type="danger">批量删除</el-button></el-col>
      <el-col :span="4" :offset="1"><el-input v-model="search" placeholder="请输入咖啡名称..." /></el-col>
      <el-col :span="2"><el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button></el-col>
      <el-col :span="2"><el-button type="success" @click="addDialogClick(true)" :icon="CirclePlusFilled">新增商品</el-button></el-col>
      <el-col :lg="3" :sm="3" :xl="3" :offset="1" :xs="3">
        <el-select placeholder="请选择你的类别" v-model="coffeeType" @change="handleTypeChange">
          <el-option label="默认" value=""></el-option>
          <el-option label="拿铁" value="Latte"></el-option>
          <el-option label="卡布奇诺" value="Cappuccino"></el-option>
          <el-option label="摩卡咖啡" value="CafeMocha"></el-option>
          <el-option label="速溶咖啡" value="Espresso"></el-option>
          <el-option label="马琪雅朵" value="Machiatto"></el-option>
          <el-option label="美式咖啡" value="Americano"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- 表格展示区域 -->
    <el-empty description="" v-show="coffeeData.length === 0"></el-empty>
    <el-table
      v-loading="loading"
      border
      @selection-change="handleSelectionChange"
      :data="coffeeData"
      height="480"
      max-height="800"
      style="width: 100%;"
      v-if="coffeeData.length > 0"
      :default-sort="{ prop: 'coffeeId', order: 'descending' }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="咖啡名称" prop="coffeeName" align="center" width="140" />
      <el-table-column label="图片" width="130" align="center">
        <template #default="scope">
          <el-image :src="scope.row.coffeeImage" style="height: 50px;"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="handlePrice"
        label="原价"
        prop="priceTag"
        align="center"
        class-name="price"
      />
      <el-table-column
        :formatter="handlePrice"
        label="会员价格"
        prop="priceMember"
        align="center"
        class-name="price"
      />
      <el-table-column
        label="咖啡简介"
        prop="coffeeDescription"
        align="center"
      />
      <el-table-column
        label="销量"
        prop="salesVolume"
        sortable
        align="center"
      />
      <el-table-column label="库存" prop="stock" align="center" />
      <el-table-column label="类型" prop="type" align="center" />
      <el-table-column align="center" width="200px">
        <template #header>
          操作
        </template>
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            @click="confirmDialogClick(true, false, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-row style="height: 60px;" align="middle">
      <el-col :span="8" :offset="16">
        <el-pagination
          v-show="coffeeData.length !== 0"
          background layout="prev, pager, next"
          :total="totalCount"
          v-model:current-page="currentPage"
          hide-on-single-page
          @current-change="handleCurrentPageChange"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<style>
  .price {
    color: #f87974;
    font-size: 16px;
  }
</style>