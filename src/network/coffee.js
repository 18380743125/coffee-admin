import request from './request'

// 文件上传
export function uploadCoffee(file, coffeeInfo) {
  // 将文件转换为Blob
  let blob = new Blob([file.raw], { type: "image/png, image/jpeg"})
  const formData = new FormData()
  formData.append('file', blob, 'coffee.png')
  formData.append('coffeeName', coffeeInfo.coffeeName)
  formData.append('type', coffeeInfo.type)
  formData.append('desc', coffeeInfo.coffeeDescription)
  formData.append('priceTag', coffeeInfo.priceTag)
  formData.append('stock', coffeeInfo.stock)
  return request({
    url: '/api/coffee/add',
    // url: '/myapi/add_coffee',
    Headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'POST',
    data: formData
  })
}

// 获取咖啡信息
export function getCoffees(currentPage) {
  return request({
    // url: '/mockjs/manager/get_coffee_infos',
    url: '/api/coffee/getInfo',
    params: {
      currentPage,
      pageSize: 10
    }
  })
}

// 根据咖啡id删除咖啡信息
export function deleteCoffee(coffee_id) {
  return request({
    url: '/api/coffee/delete',
    method: 'POST',
    data: coffee_id
  })
}

// 判断咖啡名称重复
export function isExist(coffeeName) {
  return request({
    url: '/api/coffee/isExist',
    params: { coffeeName }
  })
}

// 保存咖啡编辑
export function saveCoffee(coffeeId, coffee) {
  return request({
    url: '/api/coffee/modify',
    method: 'POST',
    data: {
      coffeeId,
      coffeeName: coffee.coffeeName,
      coffeeDescription: coffee.coffeeDescription,
      priceTag: coffee.priceTag,
      stock: coffee.stock,
      type: coffee.type
    }
  })
}

// 按照咖啡名称进行模糊匹配
export function findByCoffeeName(currentPage, coffeeName) {
  return request({
    url: '/api/coffee/getInfo',
    method: 'POST',
    params: {
      currentPage,
      pageSize: 10
    },
    data: {
      coffeeName
    }
  })
}

export function findByCoffeeType(currentPage, type) {
  return request({
    url: '/api/coffee/getInfo',
    method: 'POST',
    params: {
      currentPage,
      pageSize: 10
    },
    data: {
      type
    }
  })
}