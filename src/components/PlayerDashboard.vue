<template>
  <div class="player-dashboard">
    <!-- 主面板容器 -->
    <div class="dashboard-container">
      <!-- 頂部資訊欄 -->
      <div class="top-section">
        <div class="game-header">
          <div class="logo-area">
            <div class="logo-badge">B</div>
            <h1>BINGO<span>大挑戰</span></h1>
          </div>

          <div class="player-info">
            <div class="avatar">{{ username.charAt(0).toUpperCase() }}</div>
            <div class="info-text">
              <div class="player-name">{{ username }}</div>
              <div class="player-status" :class="{'status-locked': lockedByAdmin, 'status-ready': submitted && !lockedByAdmin}">
                {{ statusText }}
              </div>
            </div>
          </div>
        </div>

        <div class="latest-number-area" v-if="latestDrawn">
          <div class="pulse-container">
            <div class="latest-pulse"></div>
            <div class="latest-number">{{ latestDrawn }}</div>
          </div>
          <div class="latest-label">已開出</div>
        </div>
      </div>

      <!-- 主要遊戲內容 -->
      <div class="game-content">
        <!-- 左側 BINGO 卡片 -->
        <div class="board-section">
          <div class="board-header">
            <h2>我的 BINGO 卡片</h2>
            <div class="board-status">
              <span v-if="!submitted && !lockedByAdmin">編輯模式</span>
              <span v-else-if="lockedByAdmin" class="locked-status">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                已鎖定
              </span>
              <span v-else class="submitted-status">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
                已提交
              </span>
            </div>
          </div>

          <div class="bingo-board" :class="{'board-locked': submitted || lockedByAdmin}">
            <div
                v-for="(cell, index) in board"
                :key="index"
                class="bingo-cell"
                :class="{
                  'marked': isMarked(cell),
                  'empty': cell === null,
                  'filled': cell !== null
                }"
                @click="selectCell(index)"
            >
              <span v-if="cell !== null" class="cell-number">{{ cell }}</span>
              <span v-else class="cell-placeholder">點擊填入</span>
            </div>
          </div>

          <div class="board-actions">
            <button
                v-if="!submitted && !lockedByAdmin"
                @click="submitBoard"
                class="action-button submit-button"
            >
              提交卡片
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 右側遊戲資訊 -->
        <div class="info-section">
          <!-- 數據卡片 -->
          <div class="info-card stats-card">
            <div class="card-header">
              <h3>遊戲數據</h3>
            </div>
            <div class="stats-content">
              <div class="stat-item">
                <div class="stat-value">{{ completeLineCount }}</div>
                <div class="stat-label">已完成線數</div>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: `${(completeLineCount / 14) * 100}%` }"></div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-value">{{ calledNumbers.length }}</div>
                <div class="stat-label">已開獎數量</div>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: `${(calledNumbers.length / 50) * 100}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 已開出號碼 -->
          <div class="info-card called-numbers-card">
            <div class="card-header">
              <h3>已開獎號碼</h3>
              <div class="card-badge">{{ calledNumbers.length }}</div>
            </div>

            <div class="card-content">
              <div v-if="calledNumbers.length === 0" class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>遊戲尚未開始</p>
                <span>請等待管理員開獎</span>
              </div>

              <div v-else class="number-balls">
                <div
                    v-for="(num, index) in calledNumbers"
                    :key="index"
                    class="number-ball"
                    :class="{'latest-ball': num === latestDrawn}"
                >
                  {{ num }}
                </div>
              </div>
            </div>
          </div>

          <!-- 遊戲提示 -->
          <div class="info-card tips-card">
            <div class="tip-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p>完成一條橫線、直線或對角線可得1分。總共可獲得最多14分!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayerDashboard",
  props: {
    username: {
      type: String,
      default: '玩家'
    }
  },
  data() {
    return {
      board: Array(36).fill(null), // 36 格空白
      selectionCount: 0,
      submitted: false,      // 玩家提交後鎖定
      lockedByAdmin: false,  // 管理員開獎後鎖定
      calledNumbers: [],     // 後端廣播的開獎號碼（皆轉為數字）
      latestDrawn: null      // 最新開出的號碼
    }
  },
  computed: {
    completeLineCount() {
      const size = 6;
      let grid = [];
      for (let i = 0; i < size; i++) {
        grid.push(this.board.slice(i * size, i * size + size));
      }
      let count = 0;
      // 檢查每一行
      for (let i = 0; i < size; i++) {
        if (grid[i].every(num => num !== null && this.calledNumbers.includes(num))) {
          count++;
        }
      }
      // 檢查每一列
      for (let j = 0; j < size; j++) {
        let colComplete = true;
        for (let i = 0; i < size; i++) {
          let num = grid[i][j];
          if (num === null || !this.calledNumbers.includes(num)) {
            colComplete = false;
            break;
          }
        }
        if (colComplete) count++;
      }
      // 檢查主對角線
      let diag1Complete = true;
      for (let i = 0; i < size; i++) {
        let num = grid[i][i];
        if (num === null || !this.calledNumbers.includes(num)) {
          diag1Complete = false;
          break;
        }
      }
      if (diag1Complete) count++;
      // 檢查副對角線
      let diag2Complete = true;
      for (let i = 0; i < size; i++) {
        let num = grid[i][size - 1 - i];
        if (num === null || !this.calledNumbers.includes(num)) {
          diag2Complete = false;
          break;
        }
      }
      if (diag2Complete) count++;
      return count;
    },
    statusText() {
      if (this.lockedByAdmin) return "遊戲中";
      if (this.submitted) return "已準備";
      return "請填寫卡片";
    }
  },
  methods: {
    selectCell(index) {
      if (this.submitted || this.lockedByAdmin) return;
      if (this.board[index] !== null) return;
      this.selectionCount++;
      // 使用直接賦值更新陣列（Vue 3 支援直接更新）
      this.board[index] = Number(this.selectionCount);
    },
    isMarked(cell) {
      if (cell === null) return false;
      return this.calledNumbers.includes(cell);
    },
    submitBoard() {
      this.submitted = true;
      const lc = this.completeLineCount;
      console.log("玩家提交卡片，完成線數：", lc);
      this.$socket.emit('updateLineCount', { lineCount: lc });
    },
    showDrawNotification(number) {
      this.latestDrawn = number;

      // 5秒後清除"最新開出"標記
      setTimeout(() => {
        if (this.latestDrawn === number) {
          this.latestDrawn = null;
        }
      }, 5000);
    }
  },
  mounted() {
    // 監聽後端廣播的開獎號碼
    this.$socket.on('numberDrawn', (number) => {
      const n = Number(number);
      if (!this.calledNumbers.includes(n)) {
        this.calledNumbers.push(n);
        this.showDrawNotification(n);

        // 當號碼被標記時添加閃爍效果
        this.$nextTick(() => {
          const cells = document.querySelectorAll('.bingo-cell');
          cells.forEach(cell => {
            const cellNumber = parseInt(cell.textContent);
            if (cellNumber === n) {
              cell.classList.add('flash-animation');
              setTimeout(() => {
                cell.classList.remove('flash-animation');
              }, 1500);
            }
          });
        });
      }
    });
    // 監聽管理員鎖定卡片事件
    this.$socket.on('lockCards', () => {
      this.lockedByAdmin = true;
      if (!this.submitted) {
        this.submitted = true;
        const lc = this.completeLineCount;
        console.log("收到 lockCards 事件，自動提交，完成線數：", lc);
        this.$socket.emit('updateLineCount', { lineCount: lc });
      }
    });
  },
  watch: {
    completeLineCount(newVal) {
      console.log("完成線數更新：", newVal, "Board:", this.board, "CalledNumbers:", this.calledNumbers);
      if (this.submitted) {
        this.$socket.emit('updateLineCount', { lineCount: newVal });
      }
    }
  },
  beforeUnmount() {
    this.$socket.off('numberDrawn');
    this.$socket.off('lockCards');
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
}

/* 主容器樣式 */
.player-dashboard {
  font-family: 'Poppins', 'Noto Sans TC', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #e2e8f0;
  overflow-x: hidden;
}

.dashboard-container {
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 頂部資訊區域 */
.top-section {
  background: rgba(99, 102, 241, 0.2);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo-area {
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

.logo-area h1 {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(45deg, #ffffff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
}

.logo-area h1 span {
  font-size: 1.2rem;
  font-weight: 500;
  opacity: 0.8;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 50px;
  backdrop-filter: blur(5px);
}

.avatar {
  width: 35px;
  height: 35px;
  background: linear-gradient(45deg, #f43f5e, #ec4899);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(244, 63, 94, 0.3);
}

.info-text {
  display: flex;
  flex-direction: column;
}

.player-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.player-status {
  font-size: 0.8rem;
  opacity: 0.8;
}

.status-locked {
  color: var(--warning-color);
}

.status-ready {
  color: var(--success-color);
}

.latest-number-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
}

.pulse-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.latest-pulse {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(244, 63, 94, 0.3);
  animation: pulse 2s infinite;
}

.latest-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #f43f5e, #ec4899);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 5px 15px rgba(244, 63, 94, 0.4);
  z-index: 1;
}

.latest-label {
  font-size: 0.8rem;
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.8);
}

/* 主要內容區域 */
.game-content {
  display: flex;
  padding: 30px;
  gap: 30px;
}

/* 左側 BINGO 卡片區域 */
.board-section {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.board-header h2 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

.board-status {
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 5px;
}

.locked-status {
  color: var(--warning-color);
}

.submitted-status {
  color: var(--success-color);
}

.bingo-board {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 10px;
  aspect-ratio: 1/1;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
}

.bingo-cell {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.bingo-cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent);
  z-index: -1;
}

.bingo-cell.empty:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: scale(1.05) translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
}

.bingo-cell.filled {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.5);
}

.bingo-cell.marked {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
}

.cell-placeholder {
  font-size: 0.7rem;
  opacity: 0.7;
  font-weight: 400;
}

.board-locked .bingo-cell {
  cursor: default;
}

.board-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.action-button {
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.submit-button {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.submit-button:active {
  transform: translateY(0);
}

/* 右側資訊區域 */
.info-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.card-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  background: var(--primary-color);
  color: white;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0 8px;
}

.card-content {
  padding: 20px;
}

.stats-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
}

.progress-bar {
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
  border-radius: 10px;
  transition: width 0.5s;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state svg {
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.3);
}

.empty-state p {
  margin: 0 0 5px 0;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.empty-state span {
  font-size: 0.85rem;
}

.number-balls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.number-ball {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.latest-ball {
  background: linear-gradient(45deg, var(--accent-color), var(--accent-dark));
  box-shadow: 0 3px 10px rgba(244, 63, 94, 0.4);
  transform: scale(1.15);
  z-index: 1;
}

.tips-card {
  border: 1px solid rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.08);
}

.tip-content {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tip-content svg {
  flex-shrink: 0;
  color: var(--info-color);
}

.tip-content p {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

/* 動畫效果 */
.flash-animation {
  animation: flash 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes flash {
  0% { transform: scale(1.05); }
  25% { transform: scale(1.2); box-shadow: 0 0 20px rgba(99, 102, 241, 0.6); }
  50% { transform: scale(1.08); }
  75% { transform: scale(1.15); }
  100% { transform: scale(1.05); }
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 0.3; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .game-content {
    flex-direction: column;
  }

  .board-section, .info-section {
    width: 100%;
  }

  .info-section {
    order: -1;
  }

  .stats-content {
    flex-direction: row;
    justify-content: space-around;
    padding: 15px;
  }

  .stat-item {
    width: 45%;
  }
}

@media (max-width: 768px) {
  .top-section {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .game-header {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .logo-area {
    margin-bottom: 5px;
  }

  .player-info {
    width: 100%;
    justify-content: center;
  }

  .latest-number-area {
    padding-left: 0;
    margin-top: 10px;
  }

  .game-content {
    padding: 20px 15px;
  }

  .bingo-board {
    gap: 6px;
  }

  .bingo-cell {
    font-size: 1.1rem;
  }

  .cell-placeholder {
    font-size: 0.6rem;
  }

  .stats-content {
    flex-direction: column;
    gap: 15px;
  }

  .stat-item {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    border-radius: 15px;
  }

  .logo-badge {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }

  .logo-area h1 {
    font-size: 1.5rem;
  }

  .logo-area h1 span {
    font-size: 1rem;
  }

  .board-header h2 {
    font-size: 1.2rem;
  }

  .bingo-cell {
    font-size: 0.9rem;
  }

  .stat-value {
    font-size: 1.6rem;
  }

  .number-ball {
    width: 35px;
    height: 35px;
    font-size: 0.85rem;
  }
}
</style>