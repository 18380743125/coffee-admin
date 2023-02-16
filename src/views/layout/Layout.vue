<script setup>
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { Fold, User, Coffee, List } from '@element-plus/icons-vue'
import { getItem } from '../../utils/useLocalStorage'
import { logout } from '../../network/member'

const route = useRoute()

const userInfo = getItem('userInfo') || ''

// 注销登录
function handleLogout() {
  logout().then(() => {
    ElMessage({ // 注销成功
      type: 'success',
      message: '注销成功 !',
      duration: 2000
    })
    setTimeout(() => {
      localStorage.clear()
      location.href = '/login'
    }, 1000)
  })
}

</script>

<template>
  <div class="layout">
    <el-container>
    <!-- 头部区域 -->
    <el-header>
      <el-row align="middle" style="position: relative;">
        <el-col :span="8">
          <el-icon :size="22">
            <fold/>
          </el-icon>
          <span>咖啡管理后台</span>
        </el-col>
        <!-- 个人中心 -->
        <el-col :span="6" :offset="10">
          <el-row align="middle" style="padding-left: 30px; margin-left: 160px;">
            <!-- 头像 -->
            <el-col :span="4">
              <el-image src="/manager.png" style="width: 50px;" />
            </el-col>
            <!-- 用户名信息 -->
            <el-col :span="8" :offset="4">
              <el-dropdown>
              <span style="color: #f8f5f9;">
                {{userInfo.userName}}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边导航栏区域 -->
      <el-aside width="150px">
        <el-menu
          backgroundColor="#324157"
          text-color="#bfcbd9"
          active-text-color="#409eff"
          :default-active="route.path"
          router
        >
          <el-menu-item index="/member">
            <el-icon color="#8a9299"><user /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/coffee">
            <el-icon color="#8a9299"><coffee /></el-icon>
            <span>咖啡管理</span>
          </el-menu-item>
          <el-menu-item index="/order">
            <el-icon color="#8a9299"><list /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<style lang="scss">
.layout {
  height: 100vh;
  display: flex;
}
  // 头部区域
  .el-header {
    background-color: #242f42;
    height: 70px;
    width: 100%;
    .el-row {
      height: 70px;
      color: #f8f5f9;
      .el-col:first-child {
        font-size: 22px;
        position: relative;
        svg {
          position: absolute;
          top: 3px;
        }
        span {
          margin-left: 10px;
        }
      }
      .el-col:last-child {
        .el-collapse {
          height: 30px;
          border: none;
          .el-collapse-item__header {
            color: #fff;
            background-color: #242f42;
            border-color: #242f42;
            font-size: 15px;
          }
        }
        .el-collapse-item__content {
          font-size: 15px;
          height: 20px;
          background-color: #242f42;
          color: #fff;
          text-align: center;
        }
      }
    }
  }
  // 侧边导航栏
  .el-aside {
    background-color: #324157;
  }
  .el-main {
    background-color: #e2e2e2;
  }
</style>
