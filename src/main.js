// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import { io } from 'socket.io-client'

// 與後端連線 (請確認後端網址與 port)
const socket = io('http://3.27.69.79:3000')

const app = createApp(App)
app.config.globalProperties.$socket = socket
app.mount('#app')
