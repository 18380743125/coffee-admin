<script setup>
import { Search } from '@element-plus/icons-vue'
import CancelOrderDialog from '@/components/content/cancelOrder/cancelOrderDialog.vue';
import dayjs from 'dayjs'
import MyConfirm from '@/components/common/MyConfirm.vue'
import useHandleOrder from './useHandleOrder'
import useSelectOrder from './useSelectOrder'

// 格式化时间
const handleTime = (_r, _c, content) => {
  return dayjs(content).format('YYYY-MM-DD HH:mm')
}
// 对价格数据展示加工
const handlePrice = (_r, _c, content) => {
  return '￥' + content
}
// 对用户名进行处理后进行展示
const handleUsername = (content) => {
  if(!content) return '-------'
  else return content
}
// 对订单状态展示加工
const handleOrderStatus = (content) => {
  if(content === 0) return '待接单'
  else if(content === 1) return '待取餐'
  else if(content === 2) return '已完成'
  else return '已取消'
}
// 对已注销、订单已取消的打重点颜色
const checkUserState = (row) => row.userState === '已注销' ? '#f56c6c' : ''
const checkOrderCancel = (row) => row.state === 3 ? '#f56c6c' : ''
// 处理查询订单的钩子
const {
  currentPage,
  orderInfos,
  totalCount,
  orderType,
  day,
  recentlyTime,
  memberName,
  coffeeName,
  getInfos,
  handleCurrentPageChange,
  handleSearch
} = useSelectOrder()
// 处理订单的钩子
const {
  acceptConfirmVisible,
  cancelConfirmVisible,
  isCanHandle,
  acceptConfirmClick,
  cancelConfirmClick
} = useHandleOrder(handleCurrentPageChange, currentPage)
// 初始化数据(获取所有订单信息)
getInfos()
</script>

<template>
  <!-- 确认接单的对话框 -->
  <MyConfirm
    v-if="acceptConfirmVisible"
    title="你确认要接单吗 ?"
    :isWarning="false"
    :dialogVisible="acceptConfirmVisible"
    :handleOpen="acceptConfirmClick"
  />
  <!-- 确认取消订单的对话框 -->
  <CancelOrderDialog
    v-if="cancelConfirmVisible"
    title="您确认要取消订单吗 ?"
    :isWarning="true"
    :dialogVisible="cancelConfirmVisible"
    :handleConfirm="cancelConfirmClick"
  />
  <div class="order" style="padding: 10px; background-color: #fff; position: relative;">
  <!-- 操作区域 -->
    <el-row :gutter="10" style="height: 60px;" align="middle">
      <el-col :span="4"><el-input v-model="memberName" placeholder="请输入用户名..." /></el-col>
      <el-col :span="4"><el-input v-model="coffeeName" placeholder="请输入咖啡名称..." /></el-col>
      <el-col :lg="3" :sm="3" :xl="3" :xs="3">
        <el-select v-model="orderType">
          <el-option label="全部" :value="10"></el-option>
          <el-option label="待接单" :value="0"></el-option>
          <el-option label="待取餐" :value="1"></el-option>
          <el-option label="已完成" :value="2"></el-option>
          <el-option label="已取消" :value="3"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2"><el-button @click="handleSearch" type="primary" :icon="Search">搜索</el-button></el-col>
      <el-col :span="2">
        <el-date-picker v-model="day" type="date" placeholder="请选择一个日期">
        </el-date-picker>
      </el-col>
      <el-col :lg="2" :sm="2" :xl="2" :xs="2" :offset="2">
        <el-select v-model="recentlyTime">
          <el-option label="默认" :value="0"></el-option>
          <el-option label="最近一周" :value="1"></el-option>
          <el-option label="最近一个月" :value="2"></el-option>
          <el-option label="最近三个月" :value="3"></el-option>
          <el-option label="最近一年" :value="4"></el-option>
          <el-option label="一年以前" :value="5"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- 表格展示区域 -->
    <el-empty v-show="orderInfos.length === 0"></el-empty>
    <el-table
      v-if="orderInfos.length > 0"
      border
      :data="orderInfos"
      height="480"
      max-height="600"
      style="width: 100%;"
    >
      <el-table-column
        label="用户名"
        prop="userName"
        align="center"
      >
        <template #default="scope">
          <div :style="{color: checkUserState(scope.row)}">{{handleUsername(scope.row.userName)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        align="center">
        <template #default="scope">
          <div :style="{color: checkUserState(scope.row)}">{{ scope.row.userState }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="咖啡名称"
        width="120"
        prop="coffeeName"
        align="center"
      />
      <el-table-column label="图片" width="130" align="center">
        <template #default="scope">
          <el-image :src="scope.row.coffeeImage" style="height: 50px;"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="原价"
        prop="priceTag"
        align="center"
        class-name="emp"
        :formatter="handlePrice"
      />
      <el-table-column
        label="实际价格"
        prop="price"
        align="center"
        class-name="emp"
        :formatter="handlePrice"
      />
      <el-table-column
        label="数量"
        prop="cnt"
        align="center"
      />
      <el-table-column
        label="总金额"
        prop="totalMoney"
        align="center"
        class-name="emp"
        :formatter="handlePrice"
      />
      <el-table-column
        label="订单状态"
        prop="state"
        align="center"
        :formatter="handleOrderStatus"
      >
        <template #default="scope">
          <div :style="{color: checkOrderCancel(scope.row)}">{{ handleOrderStatus(scope.row.state) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        :formatter="handleTime"
        width="160"
        align="center"
      />
      <el-table-column align="center" width="160px">
        <template #header>
          操作
        </template>
        <template #default="scope">
          <el-button
            type="primary"
            @click="acceptConfirmClick(true, false, scope.row)"
            :disabled="isCanHandle(scope.row.state)"
            size="small"
          >接单</el-button>
          <el-button
            type="danger"
            @click="cancelConfirmClick(true, false, scope.row)"
            :disabled="isCanHandle(scope.row.state)"
            size="small"
          >取消订单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-row style="height: 60px;" align="middle">
      <el-col :span="8" :offset="16">
        <el-pagination
          v-show="orderInfos.length !== 0"
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

<style lang="scss" scoped>
  .emp {
    color: #f87974;
    font-size: 14px;
  }
  .true-status {
    color: #85ce61;
  }
</style>