// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/App.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import PlayerDashboard from '@/components/PlayerDashboard.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/admin', component: AdminDashboard },
    { path: '/player', component: PlayerDashboard },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
