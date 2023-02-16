import request from './request'
import { getItem } from '@/utils/useLocalStorage'

// 管理员登录
export function login({ uname, pwd, captcha }) {
  return request({
    url: '/api/user/login',
    method: 'POST',
    data: {
      role: 0,
      loginName: uname,
      loginPassword: pwd,
      checkCode: captcha
    }
  })
}

// 拿取用户信息（根据用户类型）
export function getMemberInfos(currentPage, memberType) {
  return request({
    url: '/api/user/getInfo',
    params: {
      currentPage,
      pageSize: 10,
      memberType
    }
  })
}
// 拿取用户信息(根据用户名)
export function findMemberByMname(currentPage, Mname, memberType) {
  return request({
    url: '/api/user/getInfo',
    method: 'POST',
    params: {
      currentPage,
      pageSize: 10,
      memberType
    },
    data: {
      userName: Mname
    }
  })
}

// 增加积分
export function saveIntergal(memberId, integral) {
  return request({
    url: '/api/member/update',
    method: 'POST',
    data: {
      userId: memberId,
      points: integral
    }
  })
}

// 开通会员
export function openVip(memberId) {
  return request({
    url: '/api/member/add',
    method: 'GET',
    params: {
      id: memberId
    }
  })
}

// 注销登录
export function logout() {
  return request({
    url: '/api/user/logout'
  })
}
