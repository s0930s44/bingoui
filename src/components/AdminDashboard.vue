<template>
  <div class="admin-dashboard">
    <div class="dashboard-container">
      <!-- 頂部控制區 -->
      <div class="top-section">
        <div class="dashboard-header">
          <div class="header-left">
            <div class="logo-badge">B</div>
            <h1>管理員控制中心</h1>
          </div>

          <div class="header-right">
            <div class="status-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" fill="currentColor"/>
                <path d="M11 7h2v8h-2V7zm0 10h2v2h-2v-2z" fill="currentColor"/>
              </svg>
              <span v-if="drawnNumbers.length === 0">準備開始遊戲</span>
              <span v-else>遊戲進行中</span>
            </div>

            <div class="player-stats">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473l.82-1.824zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609l.555-1.943z" fill="currentColor"/>
              </svg>
              <span>{{ playersCount }} 位玩家在線</span>
            </div>
          </div>
        </div>

        <!-- 操作控制區 -->
        <div class="control-panel">
          <div class="draw-controls">
            <div class="number-selector">
              <label for="draw-number">選擇號碼:</label>
              <div class="input-wrapper">
                <input
                    id="draw-number"
                    v-model.number="manualNumber"
                    type="number"
                    min="1"
                    max="36"
                    placeholder="1-36"
                    class="number-input"
                />
              </div>
            </div>

            <div class="action-buttons">
              <button
                  @click="drawNumber"
                  class="control-button draw-button"
                  :disabled="manualNumber === null || manualNumber < 1 || manualNumber > 36"
                  :class="{'pulse-animation': drawnNumbers.length === 0}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7h2v2h-2v-2zm0-8h2v6h-2V5z" fill="currentColor"/>
                </svg>
                開獎號碼
              </button>

              <button
                  @click="lockCards"
                  class="control-button lock-button"
                  :disabled="drawnNumbers.length === 0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zm-2 0V9A5 5 0 0 0 7 9v1h10zm-6 4v4h2v-4h-2z" fill="currentColor"/>
                </svg>
                鎖定卡片
              </button>
            </div>
          </div>

          <div v-if="adminError" class="error-display">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
            </svg>
            <span>{{ adminError }}</span>
          </div>
        </div>
      </div>

      <!-- 主要內容區域 -->
      <div class="dashboard-content">
        <!-- 左側面板 -->
        <div class="left-panel">
          <!-- 號碼開獎狀態 -->
          <div class="content-card number-status-card">
            <div class="card-header">
              <h2>號碼開獎狀態</h2>
              <div class="progress-badge">
                <span>{{ drawnNumbers.length }}</span> / 36
              </div>
            </div>

            <div class="card-content">
              <div class="number-grid">
                <div
                    v-for="num in 36"
                    :key="num"
                    class="number-box"
                    :class="{
                      'drawn': drawnNumbers.includes(num),
                      'latest': recentDrawnNumbers[0] === num
                    }"
                >
                  {{ num }}
                </div>
              </div>

              <div class="recent-numbers">
                <h3>最近開出號碼</h3>
                <div class="recent-numbers-list">
                  <div v-if="drawnNumbers.length === 0" class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" fill="currentColor"/>
                    </svg>
                    <span>尚未開出任何號碼</span>
                  </div>

                  <div v-else class="number-balls">
                    <div
                        v-for="(num, index) in recentDrawnNumbers"
                        :key="`recent-${index}`"
                        class="number-ball"
                        :class="{'latest-ball': index === 0}"
                    >
                      <span>{{ num }}</span>
                      <div v-if="index === 0" class="latest-indicator">最新</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 遊戲統計 -->
          <div class="content-card game-stats-card">
            <div class="card-header">
              <h2>遊戲統計</h2>
              <div class="refresh-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z" fill="currentColor"/>
                </svg>
              </div>
            </div>

            <div class="card-content">
              <div class="stats-tabs">
                <button
                    class="tab-button"
                    :class="{'active': statsTab === 'lines'}"
                    @click="statsTab = 'lines'"
                >
                  連線統計
                </button>
                <button
                    class="tab-button"
                    :class="{'active': statsTab === 'progress'}"
                    @click="statsTab = 'progress'"
                >
                  進度分析
                </button>
              </div>

              <div class="tab-content">
                <!-- 連線統計頁 -->
                <div v-if="statsTab === 'lines'" class="lines-stats">
                  <div class="line-stats-list">
                    <div
                        v-for="n in 14"
                        :key="`line-${n}`"
                        class="line-item"
                        :class="{'has-players': lineCountsMapping[n] && lineCountsMapping[n].length > 0}"
                    >
                      <div class="line-indicator">
                        <div class="line-number">{{ n }}</div>
                        <div class="line-label">連線</div>
                      </div>

                      <div class="line-players">
                        <template v-if="lineCountsMapping[n] && lineCountsMapping[n].length > 0">
                          <div
                              v-for="(player, idx) in lineCountsMapping[n]"
                              :key="`player-${idx}`"
                              class="player-badge"
                          >
                            {{ player }}
                          </div>
                        </template>
                        <div v-else class="no-players">尚無玩家達成</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 進度分析頁 -->
                <div v-if="statsTab === 'progress'" class="progress-stats">
                  <div class="progress-chart">
                    <div class="chart-header">
                      <div class="chart-title">遊戲進度</div>
                      <div class="chart-value">{{ Math.round((drawnNumbers.length / 36) * 100) }}%</div>
                    </div>

                    <div class="progress-bar">
                      <div class="progress-fill" :style="{width: `${(drawnNumbers.length / 36) * 100}%`}"></div>
                    </div>

                    <div class="chart-labels">
                      <div>開始</div>
                      <div>結束</div>
                    </div>
                  </div>

                  <div class="stats-summary">
                    <div class="stat-box">
                      <div class="stat-value">{{ drawnNumbers.length }}</div>
                      <div class="stat-label">已開號碼</div>
                    </div>

                    <div class="stat-box">
                      <div class="stat-value">{{ 36 - drawnNumbers.length }}</div>
                      <div class="stat-label">剩餘號碼</div>
                    </div>

                    <div class="stat-box">
                      <div class="stat-value">{{ getTopLine() }}</div>
                      <div class="stat-label">最高連線</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側面板 -->
        <div class="right-panel">
          <!-- 玩家列表 -->
          <div class="content-card players-card">
            <div class="card-header">
              <h2>玩家列表</h2>
              <div class="search-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" fill="currentColor"/>
                </svg>
                <input type="text" v-model="playerSearch" placeholder="搜尋玩家..." class="search-input">
              </div>
            </div>

            <div class="card-content">
              <div class="players-tabs">
                <button
                    class="tab-button"
                    :class="{'active': activeTab === 'names'}"
                    @click="activeTab = 'names'"
                >
                  玩家名稱
                </button>
                <button
                    class="tab-button"
                    :class="{'active': activeTab === 'ids'}"
                    @click="activeTab = 'ids'"
                >
                  玩家 ID
                </button>
                <button
                    class="tab-button"
                    :class="{'active': activeTab === 'ranking'}"
                    @click="activeTab = 'ranking'"
                >
                  排行榜
                </button>
              </div>

              <div class="players-list-wrapper">
                <!-- 玩家名稱列表 -->
                <div v-if="activeTab === 'names'" class="players-list">
                  <div v-if="filteredPlayers.length === 0" class="empty-state centered">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="currentColor"/>
                    </svg>
                    <span>暫無玩家資料</span>
                  </div>

                  <table v-else class="players-table">
                    <thead>
                    <tr>
                      <th width="60">#</th>
                      <th>玩家名稱</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(player, index) in filteredPlayers" :key="`player-name-${index}`">
                      <td class="index-cell">{{ index + 1 }}</td>
                      <td>{{ player }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 玩家 ID 列表 -->
                <div v-if="activeTab === 'ids'" class="players-list">
                  <div v-if="filteredPlayerIds.length === 0" class="empty-state centered">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="currentColor"/>
                    </svg>
                    <span>暫無玩家 ID 資料</span>
                  </div>

                  <table v-else class="players-table">
                    <thead>
                    <tr>
                      <th width="60">#</th>
                      <th>玩家 ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(id, index) in filteredPlayerIds" :key="`player-id-${index}`">
                      <td class="index-cell">{{ index + 1 }}</td>
                      <td class="id-cell">{{ id }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 排行榜列表 -->
                <div v-if="activeTab === 'ranking'" class="players-list">
                  <div v-if="Object.keys(lineCountsMapping).length === 0" class="empty-state centered">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M13 16.938V19h5v2H6v-2h5v-2.062A8.001 8.001 0 0 1 4 9V3h16v6a8.001 8.001 0 0 1-7 7.938zM6 5v4a6 6 0 1 0 12 0V5H6zM1 5h2v4H1V5zm20 0h2v4h-2V5z" fill="currentColor"/>
                    </svg>
                    <span>暫無排名資料</span>
                  </div>

                  <table v-else class="players-table ranking-table">
                    <thead>
                    <tr>
                      <th width="60">排名</th>
                      <th>玩家</th>
                      <th width="100">連線數</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(player, index) in rankedPlayers" :key="`ranked-player-${index}`">
                      <td class="index-cell">
                        <div class="rank-badge" :class="`rank-${index + 1}`" v-if="index < 3">{{ index + 1 }}</div>
                        <span v-else>{{ index + 1 }}</span>
                      </td>
                      <td>{{ player.name }}</td>
                      <td class="line-count-cell">{{ player.lineCount }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
  data() {
    return {
      drawnNumbers: [],
      players: [],
      playerIds: [],
      playersCount: 0,
      manualNumber: null,
      adminError: '',
      lineCountsMapping: {}, // 格式：{ 0: [...], 1: [...], ..., 14: [...] }
      activeTab: 'names',
      statsTab: 'lines',
      playerSearch: ''
    }
  },
  computed: {
    recentDrawnNumbers() {
      return [...this.drawnNumbers].reverse().slice(0, 5);
    },
    filteredPlayers() {
      if (!this.playerSearch) return this.players;
      const search = this.playerSearch.toLowerCase();
      return this.players.filter(player =>
          player.toLowerCase().includes(search)
      );
    },
    filteredPlayerIds() {
      if (!this.playerSearch) return this.playerIds;
      const search = this.playerSearch.toLowerCase();
      return this.playerIds.filter(id =>
          id.toLowerCase().includes(search)
      );
    },
    rankedPlayers() {
      // 構建排名數據
      const players = [];

      // 遍歷所有連線數統計
      for (let lineCount = 14; lineCount >= 0; lineCount--) {
        const playersWithThisCount = this.lineCountsMapping[lineCount] || [];
        playersWithThisCount.forEach(playerName => {
          players.push({
            name: playerName,
            lineCount: lineCount
          });
        });
      }

      return players;
    }
  },
  methods: {
    drawNumber() {
      if (this.manualNumber === null || this.manualNumber < 1 || this.manualNumber > 36) {
        this.adminError = '請輸入1-36之間的數字';
        return;
      }
      this.$socket.emit('drawNumber', { number: this.manualNumber });
      this.manualNumber = null;
      this.adminError = '';
    },
    lockCards() {
      if (this.drawnNumbers.length === 0) {
        this.adminError = '請先開出至少一個號碼';
        return;
      }
      this.$socket.emit('lockCards');
      this.adminError = '';
    },
    getTopLine() {
      // 查找最高線數
      for (let i = 14; i >= 0; i--) {
        if (this.lineCountsMapping[i] && this.lineCountsMapping[i].length > 0) {
          return i;
        }
      }
      return 0;
    }
  },
  mounted() {
    this.$socket.on('numberDrawn', (number) => {
      const num = Number(number);
      if (!this.drawnNumbers.includes(num)) {
        this.drawnNumbers.push(num);
      }
    });

    this.$socket.on('playersUpdate', (data) => {
      this.players = data.players;
      this.playersCount = data.count;
    });

    this.$socket.on('lineCountUpdate', (data) => {
      console.log("收到管理員線數統計更新：", data);
      this.lineCountsMapping = data;
    });

    this.$socket.on('errorMessage', (data) => {
      this.adminError = data.message;

      // 5秒後自動清除錯誤提示
      setTimeout(() => {
        if (this.adminError === data.message) {
          this.adminError = '';
        }
      }, 5000);
    });
  },
  beforeUnmount() {
    this.$socket.off('numberDrawn');
    this.$socket.off('playersUpdate');
    this.$socket.off('lineCountUpdate');
    this.$socket.off('errorMessage');
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap');

:root {
  --primary-color: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #a5b4fc;
  --accent-color: #f43f5e;
  --accent-dark: #e11d48;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --info-color: #3b82f6;
  --card-border-radius: 16px;
  --input-border-radius: 10px;
  --button-border-radius: 10px;
}

/* 主容器樣式 */
.admin-dashboard {
  font-family: 'Poppins', 'Noto Sans TC', sans-serif;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #e2e8f0;
  overflow-x: hidden;
}

.dashboard-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 頂部控制區 */
.top-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: var(--card-border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.dashboard-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-badge {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.4rem;
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  background: linear-gradient(45deg, #ffffff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
  padding: 8px 15px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
}

.player-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  padding: 8px 15px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 控制面板 */
.control-panel {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.draw-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.number-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.number-selector label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #e2e8f0;
}

.input-wrapper {
  position: relative;
}

.number-input {
  width: 120px;
  height: 42px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--input-border-radius);
  color: white;
  font-size: 1rem;
  padding: 0 15px;
  transition: all 0.3s;
}

.number-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.control-button {
  height: 42px;
  padding: 0 20px;
  border: none;
  border-radius: var(--button-border-radius);
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.draw-button {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.draw-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(99, 102, 241, 0.4);
}

.lock-button {
  background: linear-gradient(45deg, var(--warning-color), #fd9429);
  color: white;
}

.lock-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(245, 158, 11, 0.4);
}

.error-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(244, 63, 94, 0.15);
  color: #fda4af;
  padding: 8px 15px;
  border-radius: 50px;
  font-size: 0.9rem;
  max-width: 400px;
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}

/* 主要內容區域 */
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 內容卡片共通樣式 */
.content-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: var(--card-border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
}

.card-content {
  padding: 20px;
  flex: 1;
}

/* 左側面板 */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 號碼開獎狀態卡片 */
.progress-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  border-radius: 50px;
  padding: 5px 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.progress-badge span {
  color: white;
  font-size: 1rem;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 10px;
}

.number-box {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.number-box.drawn {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
  transform: scale(1.05);
  z-index: 1;
}

.number-box.latest {
  background: linear-gradient(45deg, var(--accent-color), var(--accent-dark));
  color: white;
  box-shadow: 0 4px 10px rgba(244, 63, 94, 0.3);
  transform: scale(1.1);
  z-index: 2;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.6); }
  70% { box-shadow: 0 0 0 10px rgba(244, 63, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
}

.recent-numbers {
  margin-top: 25px;
}
.recent-numbers h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: white;
  margin: 0 0 15px 0;
}
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.5);
  padding: 20px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.empty-state.centered {
  height: 200px;
}
.number-balls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.number-ball {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  position: relative;
}
.latest-ball {
  background: linear-gradient(45deg, var(--accent-color), var(--accent-dark));
  box-shadow: 0 5px 15px rgba(244, 63, 94, 0.3);
  transform: scale(1.1);
}
.latest-indicator {
  position: absolute;
  bottom: -8px;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(244, 63, 94, 0.9);
  padding: 2px 8px;
  border-radius: 10px;
  color: white;
}

.refresh-button {
width: 32px;
height: 32px;
border-radius: 50%;
background: rgba(255, 255, 255, 0.1);
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: all 0.3s;
}
.refresh-button:hover {
background: rgba(255, 255, 255, 0.2);
transform: rotate(30deg);
}
.stats-tabs, .players-tabs {
display: flex;
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
margin-bottom: 20px;
}
.tab-button {
padding: 10px 20px;
background: none;
border: none;
color: rgba(255, 255, 255, 0.6);
font-size: 0.95rem;
font-weight: 500;
cursor: pointer;
transition: all 0.3s;
position: relative;
}
.tab-button:after {
content: '';
position: absolute;
bottom: -1px;
left: 0;
width: 100%;
height: 2px;
background: var(--primary-color);
transform: scaleX(0);
transition: transform 0.3s;
}
.tab-button.active {
color: white;
}
.tab-button.active:after {
transform: scaleX(1);
}
.line-stats-list {
display: flex;
flex-direction: column;
gap: 15px;
max-height: 400px;
overflow-y: auto;
padding-right: 10px;
}
.line-stats-list::-webkit-scrollbar {
width: 6px;
}
.line-stats-list::-webkit-scrollbar-track {
background: rgba(255, 255, 255, 0.05);
border-radius: 10px;
}
.line-stats-list::-webkit-scrollbar-thumb {
background: rgba(255, 255, 255, 0.2);
border-radius: 10px;
}
.line-item {
display: flex;
gap: 15px;
padding: 12px 15px;
background: rgba(255, 255, 255, 0.05);
border-radius: 10px;
transition: all 0.3s;
}
.line-item.has-players {
background: rgba(99, 102, 241, 0.1);
border: 1px solid rgba(99, 102, 241, 0.2);
}
.line-indicator {
display: flex;
flex-direction: column;
align-items: center;
min-width: 50px;
}
.line-number {
width: 30px;
height: 30px;
background: var(--primary-color);
color: white;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-weight: 700;
font-size: 0.95rem;
}
.line-label {
font-size: 0.8rem;
margin-top: 5px;
color: rgba(255, 255, 255, 0.6);
}
.line-players {
flex: 1;
display: flex;
flex-wrap: wrap;
gap: 8px;
align-items: center;
}
.player-badge {
background: rgba(99, 102, 241, 0.2);
color: #a5b4fc;
border-radius: 20px;
padding: 5px 12px;
font-size: 0.85rem;
font-weight: 500;
}
.no-players {
color: rgba(255, 255, 255, 0.4);
font-size: 0.9rem;
font-style: italic;
}
.progress-stats {
display: flex;
flex-direction: column;
gap: 25px;
}
.progress-chart {
padding: 20px;
background: rgba(255, 255, 255, 0.05);
border-radius: 12px;
}
.chart-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 15px;
}
.chart-title {
font-size: 1rem;
font-weight: 600;
color: rgba(255, 255, 255, 0.8);
}
.chart-value {
font-size: 1.2rem;
font-weight: 700;
color: #a5b4fc;
}
.progress-bar {
height: 12px;
background: rgba(255, 255, 255, 0.1);
border-radius: 6px;
overflow: hidden;
margin-bottom: 10px;
}
.progress-fill {
height: 100%;
background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
border-radius: 6px;
transition: width 0.5s ease-out;
}
.chart-labels {
display: flex;
justify-content: space-between;
font-size: 0.8rem;
color: rgba(255, 255, 255, 0.5);
}
.stats-summary {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 15px;
}
.stat-box {
background: rgba(255, 255, 255, 0.05);
border-radius: 12px;
padding: 15px;
text-align: center;
transition: all 0.3s;
}
.stat-box:hover {
background: rgba(255, 255, 255, 0.1);
transform: translateY(-3px);
}
.stat-value {
font-size: 1.8rem;
font-weight: 700;
color: white;
margin-bottom: 5px;
}
.stat-label {
font-size: 0.85rem;
color: rgba(255, 255, 255, 0.6);
}

.right-panel {
display: flex;
flex-direction: column;
gap: 20px;
}

.search-container {
position: relative;
display: flex;
align-items: center;
gap: 8px;
background: rgba(255, 255, 255, 0.1);
border-radius: 10px;
padding: 5px 12px;
}
.search-input {
background: none;
border: none;
color: white;
padding: 5px;
font-size: 0.95rem;
width: 180px;
outline: none;
}
.search-input::placeholder {
color: rgba(255, 255, 255, 0.5);
}
.players-list-wrapper {
position: relative;
min-height: 200px;
}
.players-list {
position: absolute;
top: 0;
left: 0;
right: 0;
opacity: 1;
transition: opacity 0.3s;
}
.players-table {
width: 100%;
border-collapse: collapse;
text-align: left;
}
.players-table th {
padding: 12px 15px;
font-size: 0.9rem;
font-weight: 600;
color: rgba(255, 255, 255, 0.7);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.players-table td {
padding: 12px 15px;
font-size: 0.95rem;
border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.players-table tr:hover td {
background: rgba(255, 255, 255, 0.05);
}
.index-cell {
color: rgba(255, 255, 255, 0.5);
font-weight: 500;
text-align: center;
}
.id-cell {
font-family: 'Courier New', monospace;
color: #a5b4fc;
}
.line-count-cell {
font-weight: 700;
color: #a5b4fc;
text-align: center;
}
.rank-badge {
width: 24px;
height: 24px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-weight: 700;
font-size: 0.85rem;
margin: 0 auto;
}
.rank-1 {
background: linear-gradient(45deg, #ffd700, #ffb700);
color: #7a4100;
box-shadow: 0 2px 5px rgba(255, 215, 0, 0.4);
}
.rank-2 {
background: linear-gradient(45deg, #c0c0c0, #e0e0e0);
color: #505050;
box-shadow: 0 2px 5px rgba(192, 192, 192, 0.4);
}
.rank-3 {
background: linear-gradient(45deg, #cd7f32, #e29c45);
color: #6d3200;
box-shadow: 0 2px 5px rgba(205, 127, 50, 0.4);
}

.pulse-animation {
animation: pulse-button 2s infinite;
}
@keyframes pulse-button {
0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.6); }
70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}

@media (max-width: 1200px) {
.dashboard-content {
grid-template-columns: 1fr;
}
.left-panel, .right-panel {
gap: 20px;
}
.number-grid {
grid-template-columns: repeat(6, 1fr);
}
}
@media (max-width: 768px) {
.dashboard-header {
flex-direction: column;
align-items: flex-start;
gap: 15px;
}
.header-right {
width: 100%;
justify-content: space-between;
}
.control-panel {
flex-direction: column;
}
.draw-controls {
flex-direction: column;
width: 100%;
}
.number-selector {
width: 100%;
justify-content: space-between;
}
.action-buttons {
width: 100%;
justify-content: space-between;
}
.control-button {
flex: 1;
}
.number-grid {
grid-template-columns: repeat(4, 1fr);
}
.stats-summary {
grid-template-columns: 1fr;
}
}
@media (max-width: 480px) {
.number-grid {
grid-template-columns: repeat(3, 1fr);
}
.players-table th, .players-table td {
padding: 10px 8px;
font-size: 0.85rem;
}
}</style>