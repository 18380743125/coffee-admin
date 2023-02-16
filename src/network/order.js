import request from './request'

// 获取所有订单信息
export function getAllOrderInfos(currentPage) {
  return request({
    url: '/api/order/getOrders',
    method: 'POST',
    params: {
      currentPage,
      pageSize: 10
    }
  })
}

// 根据用户名、咖啡名称进行获取订单信息(可选参数)
export function getOrdersByMnAndCn(currentPage, memberName, coffeeName) {
  return request({
    url: '/api/order/getOrders',
    method: 'POST',
    params: {
      currentPage,
      pageSize: 10
    },
    data: {
      userName: memberName,
      coffeeName
    }
  })
}

// 更改订单状态(接单、取消订单)
export function updateOrderStatus(orderId, state, reason) {
  return request({
    url: '/api/order/update',
    method: 'POST',
    data: {
      orderId,
      state,
      reason
    }
  })
}

// 搜索订单: 可根据用户名、咖啡名称、时间进行检索 (可选)
export function findOrderInfosByParams(currentPage, memberName, coffeeName, orderType, day, recentlyTime) {
  return request({
    url: '/api/order/getOrders',
    method: 'POST',
    params: {
      currentPage,
      pageSize: 10
    },
    data: {
      userName: memberName,
      coffeeName,
      state: orderType,
      oneDay: day,
      dateFlag: recentlyTime
    }
  })
}
