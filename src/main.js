import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

// 创建根组件实例
createApp(App).use(router).mount('#app')
