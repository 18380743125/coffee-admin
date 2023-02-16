// 根据 key 获取 value
export function getItem(key) {
  if((localStorage.getItem(key) === 'undefined')) removeItem(key)
  return (localStorage.getItem(key) !== 'undefined') ? JSON.parse(localStorage.getItem(key)) : null
}
// 将数据存入本地存储中
export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// 删除指定 key
export function removeItem(key) {
  localStorage.removeItem(key)
}