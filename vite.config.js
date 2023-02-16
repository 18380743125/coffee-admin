import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { SERVER_ADDRESS } from './src/utils/constant'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: SERVER_ADDRESS,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/mockjs': {
        target: 'http://192.168.0.9:9919/',
        changeOrigin: true
      },
      '/myapi': {
        target: 'http://192.168.0.101:9090/PetShop/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/myapi/, '')
      },
    }
  }
})
