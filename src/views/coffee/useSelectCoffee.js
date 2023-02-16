import { ref } from 'vue'
import { getCoffees, findByCoffeeName, findByCoffeeType } from '@/network/coffee'

export default function useSelectCoffee(loading) {

  // 0 查询全部咖啡  1 按照咖啡名称查询  2 按照咖啡类型查询
  let selectType = 0
  // 判断是否是点击的搜索和下拉框筛选
  let isSearch = true
  let isSelectBox = true

  // 按照咖啡名称进行模糊匹配
  let search = ref('')
  // 从后端拿到的数据
  let coffeeData = ref([])
  // 当前页号
  let currentPage = ref(1)
  // 总共有多少条数据
  let totalCount = ref(0)
  // 咖啡类型(根据下拉框进行筛选)
  let coffeeType = ref('')

  function changeIs(flag) {
    isSearch = flag
    isSelectBox = flag
  }

  // 加工咖啡记录
  function processCoffeeData(res) {
    loading.value = false
    if(res.data === '') return
    coffeeData.value = res.data.rows.map(item => {
      item.priceTag = parseFloat(item.priceTag).toFixed(2)
      item.priceMember =(item.priceTag * 0.9).toFixed(2)
      return item
    })
  }

  // 拿取所有咖啡信息
  function getPagingCoffees() {
    loading.value = true
    selectType = 0
    getCoffees(currentPage.value).then(res => {
      // 加工原数据
      totalCount.value = res.data.totalCount
      processCoffeeData(res)
    })
  }
  // 初始化咖啡数据
  getPagingCoffees()

  // 处理页面的改变
  const handleCurrentPageChange = curr => {
    changeIs(false)
    loading.value = true
    currentPage.value = curr
    if(selectType === 0) getPagingCoffees()
    else if(selectType === 1) handleSearch()
    else handleTypeChange()
    changeIs(true)
  }

  // 按照咖啡名称进行搜索
  const handleSearch = () => {
    coffeeType.value = ''
    loading.value = true
    selectType = 1
    if(isSearch) currentPage.value = 1
    findByCoffeeName(currentPage.value, search.value).then(res => {
      processCoffeeData(res)
      coffeeData.value = res.data.rows
      totalCount.value = res.data.totalCount
    })
  }

  // 按照咖啡类型查询
  const handleTypeChange = () => {
    loading.value = true
    selectType = 2
    if(isSelectBox) currentPage.value = 1
    findByCoffeeType(currentPage.value, coffeeType.value).then(res => {
      processCoffeeData(res)
      coffeeData.value = res.data.rows
      totalCount.value = res.data.totalCount
    })
  }
  return {
    search,
    coffeeData,
    currentPage,
    totalCount,
    coffeeType,
    getPagingCoffees,
    handleCurrentPageChange,
    handleSearch,
    handleTypeChange
  }
}