<script setup>
import { useRouter } from 'vue-router'
import useLoginVerify from './useLoginVerify'
import useHandleLogin from './useHandleLogin'
import { SERVER_ADDRESS } from '@/utils/constant'

const router = useRouter()

// 登录验证规则
const { rules } = useLoginVerify()

// 切换验证码
function switchVerifyCode() {
  verifyCode.value = SERVER_ADDRESS + '/user/checkCode?t='+Math.random()
}
function handleErr() {
  switchVerifyCode()
}

// 验证通过并登录
const { formRef, verifyCode, loginForm, submitForm } = useHandleLogin(router, handleErr)

</script>

<template>
  <el-container>
    <el-main>
      <el-row style="margin-top: 130px;">
        <el-col :span="8" :offset="8">
          <el-card shadow="always" style="width: 430px;">
            <h3 style="text-align: center;">管理员登录</h3>
            <el-form label-width="80px"
              ref="formRef"
              :model="loginForm" 
              :rules="rules" 
              status-icon
            >
              <el-form-item label="用户名" prop="uname">
                <el-input type="text" v-model.lazy="loginForm.uname" style="width: 280px;"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pwd" style="margin-top: 20px;">
                <el-input type="password" v-model.lazy="loginForm.pwd" style="width: 280px;"></el-input>
              </el-form-item>
              <el-form-item
                label="验证码"
                prop="captcha"
                style="position: relative; margin-top: 20px;"
              >
                <el-input type="text" v-model.lazy="loginForm.captcha" style="width: 100px;"></el-input>
                <img
                  @click="switchVerifyCode"
                  :src="verifyCode"
                  @error="handleErr"
                  style="width: 120px; border-radius: 6px; height: 32px; margin-left: 40px; position: absolute; top: 0; left: 90px;"
                />
              </el-form-item>
              <el-form-item style="margin-top: 30px;">
                <el-button
                  @click="submitForm"
                  type="primary"
                  style="width: 360px; height: 40px; margin-left: -60px;"
                >登录</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
  background: linear-gradient(to right, #242f42, #324157);
  // position: relative;
}
</style>
