<script setup>
import { ref, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue'
import EditIntegralDialog from '@/components/content/editIntegral/EditIntegralDialog.vue';
import MyConfirm from '@/components/common/MyConfirm.vue'
import { getMemberInfos, findMemberByMname } from '@/network/member'
import useOpenVip from './useOpenVip'
import useEditIntegral from './useEditIntegral'

// 当前页的用户信息
let memberInfos = ref([])
// 当前是第几页
let currentPage = ref(1)
// 总记录条数
let totalCount = ref(0)
// 0是全部 1是会员, 2是普通用户
let memberType = ref(0)
// 搜索的内容(用户名)
let search = ref('')

// 当前用户是否是vip, 若是, 则可修改积分(修改积分按钮激活)
const isVip = (row) => {
  return isNaN(row.points)
}

// 判断是否是点击的搜索和下拉框筛选
let isSearch = true
let isSelectBox = true
// 改变is
function changeIs(flag) {
  isSearch = flag
  isSelectBox = flag
}

// 判断男女显示在表格中
const checkSex = (_r, _c, content) => {
  if(content === 1) return '男'
  else return '女'
}

// 0 查询全部用户  1 按照用户名查询  2 按照用户类型查询
let selectType = 0

// 加工处理用户信息
function processData(data) {
  if(data === '') return
  memberInfos.value = data.rows.map(item => {
    item.memberType = item.member ? '尊贵会员' : '普通用户'
    item.points = item.member ? item.member.points : '-----'
    delete item.member
    return item
  })
}

// 根据用户类型和当前页来查询
function getInfos() {
  getMemberInfos(currentPage.value, memberType.value).then(res => {
    processData(res.data)
    totalCount.value = res.data.totalCount
  })
}

onMounted(() => {
  // 初始化数据
  getInfos()
})

// 处理切换页面, 第二个参数是为了处理子组件处理完成后刷新问题
const handleCurrentPageChange = (curr, isRefresh) => {
  changeIs(false)
  !isRefresh && (currentPage.value = curr)
  if(selectType === 0) getInfos()
  else if(selectType === 1) handleSearch()
  else if(selectType === 2) handleTypeChange()
  changeIs(true)
}
// 按照用户类型查询
const handleTypeChange = () => {
  search.value = ''
  if(isSelectBox) currentPage.value = 1
  getInfos()
}
// 根据用户名进行模糊搜索
const handleSearch = () => {
  selectType = 1
  if(isSearch) currentPage.value = 1
  findMemberByMname(currentPage.value, search.value, memberType.value).then(res => {
    processData(res.data)
    totalCount.value = res.data.totalCount
  })
}

// 修改会员积分
let {
  memberId,
  memberIntegral,
  memberName,
  editDialogVisible,
  editDialogClick,
  handleUpdateIntegral
} = useEditIntegral()

// 开通会员
let { openVipDialogVisible, handleOpenVip } = useOpenVip(handleCurrentPageChange)

</script>

<template>
  <MyConfirm
    title="您确认要开通吗 ?"
    :isWarning="true"
    :dialogVisible="openVipDialogVisible"
    :handleOpen="handleOpenVip"
  />
  <EditIntegralDialog
    v-if="editDialogVisible"
    :memberId="memberId"
    :memberIntegral="memberIntegral"
    :memberName="memberName"
    :dialogVisible="editDialogVisible"
    :editDialogClick="editDialogClick"
    :getPagingMember="handleCurrentPageChange"
  />
  <div style="padding: 10px; background-color: #fff; position: relative;">
    <!-- 操作区域 -->
    <el-row :gutter="10" style="height: 60px;" align="middle">
      <el-col :span="4"><el-input v-model="search" placeholder="请输入用户名..." /></el-col>
      <el-col :span="2"><el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button></el-col>
      <el-col :lg="3" :sm="3" :xl="3" :offset="1" :xs="3">
        <el-select v-model="memberType" @change="handleTypeChange">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="尊贵会员" :value="1"></el-option>
          <el-option label="普通用户" :value="2"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- 表格展示区域 -->
    <el-empty description="" v-show="memberInfos.length === 0"></el-empty>
    <el-table
      v-if="memberInfos.length > 0"
      border
      :data="memberInfos"
      height="480"
      max-height="600"
      style="width: 100%;"
    >
      <el-table-column
        label="用户名"
        prop="userName"
        align="center"
      />
      <el-table-column
        label="年龄"
        prop="age"
        align="center"
      />
      <el-table-column
        label="性别"
        prop="gender"
        align="center"
        :formatter="checkSex"
      />
      <el-table-column
        label="电话号码"
        prop="phone"
        align="center"
      />
      <el-table-column
        label="余额"
        prop="balance"
        align="center"
      />
      <el-table-column
        label="会员类型"
        prop="memberType"
        align="center"
        class-name="member-type"
      />
      <el-table-column
        label="积分"
        prop="points"
        align="center"
      />
      <el-table-column align="center" width="200px">
        <template #header>
          操作
        </template>
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            :disabled="!isVip(scope.row)"
            @click="handleOpenVip(true, false, scope.row)"
          >开通会员</el-button>
          <el-button
            type="success"
            size="small"
            :disabled="isVip(scope.row)"
            @click="handleUpdateIntegral(scope.row)"
          >修改积分</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-row style="height: 60px;" align="middle">
      <el-col :span="8" :offset="16">
        <el-pagination
          v-show="memberInfos.length !== 0"
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
  .member-type {
    color: #f87974;
  }
</style>