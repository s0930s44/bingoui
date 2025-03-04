// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'     // ← 匯入你的 router 設定
import { io } from 'socket.io-client'

// 與後端連線 (請確認後端實際 IP / 網域與 port)
const socket = io('https://bingo.windmaplestoryv113.com')

const app = createApp(App)

// 將 router 掛載到應用
app.use(router)

// 將 socket 實例掛載到全域 (GlobalProperties)
app.config.globalProperties.$socket = socket

// 最後掛載到 #app
app.mount('#app')
