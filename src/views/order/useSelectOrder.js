import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllOrderInfos, findOrderInfosByParams } from '@/network/order'

// 查询的钩子
export default function useSelectOrder() {

  // 查找类型, 0是初始化状态下的搜索, 1是按照多条件状态下的搜索, 为了处理搜索后点击操作时热刷新问题
  let selectType = 0
  let isClickSearchBox = false // 是否点击的搜索框进行搜索

  // 当前是第几页
  let currentPage = ref(1)
  // 当前所有订单信息
  let orderInfos = ref([])
  // 当前总记录条数
  let totalCount = ref(0)
  // 订单类型, 默认全部
  let orderType = ref(10)
  // 某一天
  let day = ref(null)
  // 最近时间类型
  let recentlyTime = ref(0)
  // 搜索框内容
  let memberName = ref('')
  let coffeeName = ref('')

  // 处理分页
  function handleCurrentPageChange(curr) {
    currentPage.value = curr
    if(selectType === 0) getInfos()
    else if(selectType === 1) { // 是点击的搜索框
      isClickSearchBox = true
      handleSearch()
      isClickSearchBox = false // 搜索完成后应将值归位为了搜索后点击切换页面
    }
  }

  // 加工请求回来的数据
  const processOrderInfos = (data) => {
    console.log(data)
    if(data === '') return
    orderInfos.value = data.rows.map(item => {
      // 添加总金额
      item.totalMoney = item.price * item.cnt
      return item
    })
    totalCount.value = data.totalCount
  }

  const getInfos = () => {
    selectType = 0
    getAllOrderInfos(currentPage.value).then(res => {
      processOrderInfos(res.data)
    })
  }

  // 根据多条件进行搜索
  const handleSearch = () => {
    if(!isClickSearchBox) currentPage.value = 1
    selectType = 1
    if(day.value !== null && recentlyTime.value !== 0) {
      day.value = null
      recentlyTime.value = 0
      return ElMessage({ // 校验不通过(选择具体某一天与最近不能同时选择)
        type: 'error',
        message: '两个时间不能同时选择哟 !',
        duration: 2000
      })
    }
    // 根据条件发生请求
    findOrderInfosByParams(
      currentPage.value,
      memberName.value,
      coffeeName.value,
      orderType.value,
      day.value,
      recentlyTime.value
    ).then(res => {
      if(res.msg === 'success') {
        processOrderInfos(res.data)
      }
    })
  }
  return {
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
  }
}