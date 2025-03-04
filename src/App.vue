<template>
  <div id="app" :class="{ 'logged-in': loggedIn }">
    <!-- 動態背景元素 -->
    <div class="background-elements">
      <div class="animated-bg"></div>
      <div class="particles-container">
        <div v-for="n in 20" :key="n" class="particle"></div>
      </div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- 房間列表側邊欄 -->
    <div class="sidebar" :class="{ 'expanded': sidebarExpanded }">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="app-logo">B</div>
          <h3>BINGO大挑戰</h3>
        </div>
        <button class="toggle-sidebar" @click="sidebarExpanded = !sidebarExpanded">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div class="rooms-container">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617z" fill="currentColor"/>
          </svg>
          <input type="text" v-model="roomSearch" placeholder="搜尋房間..." />
        </div>

        <div class="rooms-list">
          <div class="room-item"
               v-for="room in filteredRooms"
               :key="room"
               @click="selectRoom(room)"
               :class="{ 'active': room === roomInput }">
            <div class="room-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M21 19h2v2H1v-2h2V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v15h4v-8h-2V9h3a1 1 0 0 1 1 1v9zM5 5v14h8V5H5z" fill="currentColor"/>
              </svg>
            </div>
            <div class="room-name">{{ room }}</div>
            <div class="room-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          <div v-if="filteredRooms.length === 0" class="empty-rooms">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" fill="currentColor"/>
            </svg>
            <p>沒有可用的房間</p>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="app-info">
          <div class="app-version">版本 1.0</div>
          <div class="app-copyright">&copy; {{ currentYear }}</div>
        </div>
      </div>
    </div>

    <!-- 主內容區域 -->
    <div class="main-content">
      <!-- 登入表單 -->
      <div v-if="!loggedIn" class="login-container">
        <div class="login-card">
          <div class="login-header">
            <div class="app-branding">
              <div class="app-logo">B</div>
              <h1>BINGO大挑戰</h1>
            </div>
            <p class="welcome-text">歡迎來到最刺激的數字對決遊戲</p>
          </div>

          <form @submit.prevent="login" class="login-form">
            <div class="form-group">
              <label for="username">使用者名稱</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="currentColor"/>
                </svg>
                <input
                    id="username"
                    type="text"
                    v-model="username"
                    placeholder="輸入您的名稱"
                    required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="room">房間名稱</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M21 19h2v2H1v-2h2V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v15h4v-8h-2V9h3a1 1 0 0 1 1 1v9zM5 5v14h8V5H5z" fill="currentColor"/>
                </svg>
                <input
                    id="room"
                    type="text"
                    v-model="room"
                    placeholder="輸入或從左側選擇房間"
                    required
                />
              </div>
            </div>

            <div class="form-group checkbox-group">
              <div class="custom-checkbox">
                <input type="checkbox" id="isAdmin" v-model="isAdmin" />
                <label for="isAdmin" class="checkbox-label">
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">我是遊戲管理員</span>
                </label>
              </div>
            </div>

            <div class="login-error" v-if="loginError">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
              </svg>
              <span>{{ loginError }}</span>
            </div>

            <button type="submit" class="login-button">
              <span>進入遊戲</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"/>
              </svg>
            </button>
          </form>

          <div class="login-footer">
            <div class="footer-features">
              <div class="feature">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.5-6H14a.5.5 0 1 0 0-1h-4a2.5 2.5 0 1 1 0-5h1V6h2v2h2.5v2H10a.5.5 0 1 0 0 1h4a2.5 2.5 0 1 1 0 5h-1v2h-2v-2H8.5v-2z" fill="currentColor"/>
                </svg>
                <span>即時獎勵</span>
              </div>
              <div class="feature">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm9 6h1v5h-8v-5h1v-1a3 3 0 0 1 6 0v1zm-2 0v-1a1 1 0 0 0-2 0v1h2z" fill="currentColor"/>
                </svg>
                <span>安全遊戲</span>
              </div>
              <div class="feature">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm-1 2H4v14h16V5zm-2 2v2H6V7h12z" fill="currentColor"/>
                </svg>
                <span>多平台支援</span>
              </div>
            </div>
            <p class="copyright">BINGO大挑戰 &copy; {{ currentYear }} 版權所有</p>
          </div>
        </div>
      </div>

      <!-- 遊戲區域 -->
      <div v-else class="game-content">
        <div v-if="isAdmin">
          <AdminDashboard />
        </div>
        <div v-else>
          <PlayerDashboard :username="username" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminDashboard from './components/AdminDashboard.vue'
import PlayerDashboard from './components/PlayerDashboard.vue'

export default {
  name: 'App',
  components: { AdminDashboard, PlayerDashboard },
  data() {
    return {
      username: '',
      room: '',
      isAdmin: false,
      loggedIn: false,
      loginError: '',
      roomsList: [],  // 示範用房間列表
      roomSearch: '',    // 搜尋用
      sidebarExpanded: false,
      currentYear: new Date().getFullYear(),
      roomInput: ''      // 用來記錄目前輸入框中的房間名稱
    }
  },
  computed: {
    filteredRooms() {
      if (!this.roomSearch) return this.roomsList;
      const search = this.roomSearch.toLowerCase();
      return this.roomsList.filter(room => room.toLowerCase().includes(search));
    }
  },
  methods: {
    login() {
      if (this.username.trim() === '' || this.room.trim() === '') {
        this.loginError = '使用者名稱與房間名稱不能為空';
        return;
      }
      // 同時更新 room 與 roomInput
      this.roomInput = this.room;
      this.$socket.emit('login', { username: this.username, room: this.room, isAdmin: this.isAdmin });
    },
    selectRoom(selectedRoom) {
      this.room = selectedRoom;
      this.roomInput = selectedRoom;
      // 在小屏幕上選擇房間後自動收起側邊欄
      if (window.innerWidth < 768) {
        this.sidebarExpanded = false;
      }
    }
  },
  mounted() {
    this.$socket.on('loginSuccess', (data) => {
      this.loggedIn = true;
      this.loginError = '';
      console.log(data.message);
    });
    this.$socket.on('loginError', (data) => {
      this.loginError = data.message;
    });
    this.$socket.on('errorMessage', (data) => {
      console.error(data.message);
    });
    // 接收後端更新的房間列表
    this.$socket.on('roomsListUpdate', (rooms) => {
      this.roomsList = rooms;
    });

    // 為粒子動畫設置隨機屬性
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      const size = Math.random() * 30 + 10;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 20 + 10;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
    });
  },
  beforeUnmount() {
    this.$socket.off('loginSuccess');
    this.$socket.off('loginError');
    this.$socket.off('errorMessage');
    this.$socket.off('roomsListUpdate');
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap');

:root {
  --primary-color: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #a5b4fc;
  --accent-color: #f43f5e;
  --accent-dark: #e11d48;
  --text-dark: #1f2937;
  --text-medium: #4b5563;
  --text-light: #9ca3af;
  --bg-light: #f9fafb;
  --border-light: #e5e7eb;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --card-border-radius: 16px;
  --button-border-radius: 10px;
  --input-border-radius: 10px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', 'Noto Sans TC', sans-serif;
  background-color: var(--bg-light);
  color: var(--text-dark);
  line-height: 1.6;
  overflow-x: hidden;
  height: 100vh;
  width: 100vw;
}

#app {
  display: flex;
  position: relative;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 動態背景效果 */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
}

.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  opacity: 0.92;
}

.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
  opacity: 0.2;
  filter: blur(8px);
  animation: float-particle 20s infinite linear;
}

@keyframes float-particle {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 0.1;
  }
  25% {
    opacity: 0.3;
  }
  50% {
    transform: translate(100px, 100px) rotate(180deg) scale(1.5);
    opacity: 0.2;
  }
  75% {
    opacity: 0.3;
  }
  100% {
    transform: translate(0, 0) rotate(360deg) scale(1);
    opacity: 0.1;
  }
}

.gradient-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 70%),
  radial-gradient(circle at bottom left, rgba(244, 63, 94, 0.1), transparent 70%);
}

/* 側邊欄 */
.sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  box-shadow: var(--shadow-lg);
  color: white;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
}

.sidebar-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0 10px;
  background: linear-gradient(45deg, #ffffff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.toggle-sidebar {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  display: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.toggle-sidebar:hover {
  opacity: 1;
}

.rooms-container {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.search-box {
  position: relative;
  margin-bottom: 15px;
}

.search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--input-border-radius);
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  backdrop-filter: blur(5px);
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.room-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: var(--input-border-radius);
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.room-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: rgba(255, 255, 255, 0.2);
}

.room-item.active {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.5);
  border-color: transparent;
}

.room-icon {
  margin-right: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.room-item.active .room-icon,
.room-item.active .room-arrow {
  color: white;
}

.room-name {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
}

.room-arrow {
  color: rgba(255, 255, 255, 0.5);
  opacity: 0;
  transition: all 0.3s;
}

.room-item:hover .room-arrow {
  opacity: 1;
  transform: translateX(3px);
}

.empty-rooms {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  color: rgba(255, 255, 255, 0.5);
}

.empty-rooms svg {
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.3);
}

.empty-rooms p {
  font-size: 0.9rem;
}

.sidebar-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.app-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
}

.app-logo {
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
}

/* 主內容區域 */
.main-content {
  flex: 1;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 100%;
  max-width: 500px;
  perspective: 1200px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: var(--card-border-radius);
  padding: 35px;
  box-shadow: var(--shadow-lg);
  transform-style: preserve-3d;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: card-appear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes card-appear {
  0% { opacity: 0; transform: translateY(40px) rotateX(10deg); }
  100% { opacity: 1; transform: translateY(0) rotateX(0); }
}

.login-header {
  margin-bottom: 35px;
  text-align: center;
}

.app-branding {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.app-branding .app-logo {
  width: 60px;
  height: 60px;
  font-size: 1.8rem;
  margin-bottom: 15px;
  animation: logo-pulse 3s infinite alternate cubic-bezier(0.455, 0.03, 0.515, 0.955);
  position: relative;
}

.app-branding .app-logo::after {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border-radius: 12px;
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  opacity: 0.3;
  filter: blur(12px);
  z-index: -1;
  animation: glow 3s infinite alternate cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

@keyframes glow {
  0% { opacity: 0.3; filter: blur(12px); }
  100% { opacity: 0.6; filter: blur(16px); }
}

@keyframes logo-pulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.12); }
}

.app-branding h1 {
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  position: relative;
}

.welcome-text {
  font-size: 1.05rem;
  color: var(--text-medium);
  margin-top: 10px;
  position: relative;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-medium);
  margin-left: 2px;
}

.input-with-icon {
  position: relative;
}

.input-with-icon svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  transition: color 0.3s;
}

.input-with-icon input:focus + svg {
  color: var(--primary-color);
}

.input-with-icon input {
  width: 100%;
  padding: 14px 14px 14px 44px;
  font-size: 1rem;
  border: 2px solid var(--border-light);
  border-radius: var(--input-border-radius);
  transition: all 0.3s;
  background-color: white;
}

.input-with-icon input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  outline: none;
}

.checkbox-group {
  margin-top: 5px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
}

.custom-checkbox input[type="checkbox"] {
  display: none;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-custom {
  width: 22px;
  height: 22px;
  border: 2px solid var(--border-light);
  border-radius: 6px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  position: relative;
}

.custom-checkbox input[type="checkbox"]:checked + .checkbox-label .checkbox-custom {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-custom::after {
  content: '';
  width: 6px;
  height: 11px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  position: absolute;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.custom-checkbox input[type="checkbox"]:checked + .checkbox-label .checkbox-custom::after {
  transform: rotate(45deg) scale(1);
}

.checkbox-text {
  font-size: 0.95rem;
  color: var(--text-medium);
}

.login-error {
  background-color: rgba(244, 63, 94, 0.1);
  color: var(--accent-dark);
  padding: 12px 16px;
  border-radius: var(--input-border-radius);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  border: 1px solid rgba(244, 63, 94, 0.2);
}

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}

.login-button {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  border-radius: var(--button-border-radius);
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.4);
}

.login-button:hover::before {
  left: 100%;
}

.login-button:active {
  transform: translateY(1px);
}

.login-button svg {
  transition: transform 0.3s;
}

.login-button:hover svg {
  transform: translateX(5px);
}

.login-footer {
  margin-top: 35px;
}

.footer-features {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-medium);
  font-size: 0.85rem;
}

.feature svg {
  color: var(--primary-color);
}

.copyright {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-light);
}

.game-content {
width: 100%;
height: 100%;
animation: fade-in 0.5s ease;
padding: 20px;
}
@keyframes fade-in {
from { opacity: 0; }
to { opacity: 1; }
}

.dashboard {
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(15px);
border-radius: var(--card-border-radius);
box-shadow: var(--shadow-lg);
overflow: hidden;
border: 1px solid rgba(255, 255, 255, 0.2);
height: 100%;
display: flex;
flex-direction: column;
}
.dashboard-header {
padding: 20px;
border-bottom: 1px solid var(--border-light);
display: flex;
justify-content: space-between;
align-items: center;
}
.dashboard-title {
font-size: 1.5rem;
font-weight: 600;
color: var(--text-dark);
}
.dashboard-content {
padding: 20px;
flex: 1;
overflow-y: auto;
}

@media (max-width: 1024px) {
.login-card {
padding: 30px;
}
.app-branding h1 {
font-size: 2rem;
}
}
@media (max-width: 768px) {
#app {
flex-direction: column;
}
.sidebar {
width: 100%;
height: 60px;
overflow: hidden;
position: fixed;
top: 0;
left: 0;
right: 0;
z-index: 100;
}
.sidebar.expanded {
height: 100vh;
}
.toggle-sidebar {
display: block;
}
.main-content {
margin-top: 60px;
padding: 20px 15px;
}
.login-card {
padding: 25px;
}
.app-branding h1 {
font-size: 1.8rem;
}
.welcome-text {
font-size: 0.95rem;
}
.footer-features {
flex-direction: column;
gap: 15px;
align-items: center;
}
}
@media (max-width: 480px) {
.main-content {
padding: 15px 10px;
}
.login-card {
padding: 20px;
}
.app-branding h1 {
font-size: 1.6rem;
}
.welcome-text {
font-size: 0.9rem;
}
.form-group label {
font-size: 0.85rem;
}
.input-with-icon input {
padding: 12px 12px 12px 40px;
font-size: 0.95rem;
}
.login-button {
padding: 12px 16px;
font-size: 0.95rem;
}
.app-branding .app-logo {
width: 50px;
height: 50px;
font-size: 1.6rem;
}
}

@media (prefers-color-scheme: dark) {
.login-card {
background: rgba(30, 41, 59, 0.95);
border-color: rgba(255, 255, 255, 0.05);
}
.welcome-text {
color: rgba(255, 255, 255, 0.7);
}
.form-group label {
color: rgba(255, 255, 255, 0.8);
}
.input-with-icon input {
background-color: rgba(15, 23, 42, 0.3);
border-color: rgba(255, 255, 255, 0.1);
color: white;
}
.input-with-icon input::placeholder {
color: rgba(255, 255, 255, 0.4);
}
.checkbox-text {
color: rgba(255, 255, 255, 0.8);
}
.checkbox-custom {
border-color: rgba(255, 255, 255, 0.2);
}
.feature {
color: rgba(255, 255, 255, 0.7);
}
.copyright {
color: rgba(255, 255, 255, 0.5);
}
.dashboard {
background: rgba(30, 41, 59, 0.95);
border-color: rgba(255, 255, 255, 0.05);
}
.dashboard-title {
color: white;
}
.dashboard-header {
border-color: rgba(255, 255, 255, 0.1);
}
}

button:disabled,
input:disabled {
opacity: 0.6;
cursor: not-allowed;
}

* {
transition: cursor 0.3s;
}

.fade-enter-active,
.fade-leave-active {
transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
opacity: 0;
}

.loading-indicator {
display: inline-block;
width: 20px;
height: 20px;
border: 3px solid rgba(255, 255, 255, 0.3);
border-radius: 50%;
border-top-color: white;
animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
to { transform: rotate(360deg); }
}

.content-card {
background: rgba(255, 255, 255, 0.5);
border-radius: 12px;
padding: 20px;
margin-bottom: 20px;
box-shadow: var(--shadow-sm);
border: 1px solid rgba(255, 255, 255, 0.2);
transition: all 0.3s;
}
.content-card:hover {
transform: translateY(-3px);
box-shadow: var(--shadow-md);
}

.btn {
display: inline-flex;
align-items: center;
justify-content: center;
gap: 8px;
padding: 10px 16px;
border-radius: var(--button-border-radius);
font-weight: 500;
cursor: pointer;
transition: all 0.3s;
border: none;
outline: none;
}
.btn-primary {
background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
color: white;
box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
}
.btn-primary:hover {
transform: translateY(-2px);
box-shadow: 0 6px 15px rgba(99, 102, 241, 0.4);
}
.btn-secondary {
background: rgba(255, 255, 255, 0.8);
color: var(--text-dark);
border: 1px solid var(--border-light);
}
.btn-secondary:hover {
background: white;
transform: translateY(-2px);
box-shadow: var(--shadow-md);
}
.btn-danger {
background: linear-gradient(45deg, var(--accent-color), var(--accent-dark));
color: white;
box-shadow: 0 4px 10px rgba(244, 63, 94, 0.3);
}
.btn-danger:hover {
transform: translateY(-2px);
box-shadow: 0 6px 15px rgba(244, 63, 94, 0.4);
}

.tooltip {
position: relative;
display: inline-block;
}
.tooltip .tooltip-text {
visibility: hidden;
width: 120px;
background-color: rgba(0, 0, 0, 0.8);
color: white;
text-align: center;
border-radius: 6px;
padding: 5px;
position: absolute;
z-index: 1;
bottom: 125%;
left: 50%;
transform: translateX(-50%);
opacity: 0;
transition: opacity 0.3s;
font-size: 0.8rem;
}
.tooltip:hover .tooltip-text {
visibility: visible;
opacity: 1;
}
</style>