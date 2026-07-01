/**
 * UIManager Class
 * Handles all UI updates and DOM interactions for SERPENT X
 * Manages menus, HUD, modals, and notifications
 */

class UIManager {
  constructor() {
    this.elements = this.cacheElements();
    this.toastTimeout = null;
  }

  /**
   * Cache DOM elements for performance
   * @private
   * @returns {object} Cached element references
   */
  cacheElements() {
    return {
      // Core elements
      canvas: document.getElementById('game'),
      fps: document.getElementById('fps'),
      deviceBadge: document.getElementById('deviceBadge'),
      
      // HUD
      hud: document.getElementById('hud'),
      score: document.getElementById('score'),
      level: document.getElementById('level'),
      best: document.getElementById('best'),
      
      // Combat HUD
      combatHud: document.getElementById('combatHud'),
      p1name: document.getElementById('p1name'),
      p2name: document.getElementById('p2name'),
      p1hp: document.getElementById('p1hp'),
      p2hp: document.getElementById('p2hp'),
      p1score: document.getElementById('p1score'),
      p2score: document.getElementById('p2score'),
      
      // Menus
      menu: document.getElementById('menu'),
      multiMenu: document.getElementById('multiMenu'),
      pauseScreen: document.getElementById('pauseScreen'),
      gameover: document.getElementById('gameover'),
      combatOver: document.getElementById('combatOver'),
      statsScreen: document.getElementById('statsScreen'),
      
      // Input elements
      playerNameInput: document.getElementById('playerNameInput'),
      taskInput: document.getElementById('taskInput'),
      
      // Modal
      taskModal: document.getElementById('taskModal'),
      toast: document.getElementById('toast'),
      
      // Stats
      totalTasks: document.getElementById('totalTasks'),
      completedTasks: document.getElementById('completedTasks'),
      pendingTasks: document.getElementById('pendingTasks'),
      completionRate: document.getElementById('completionRate'),
      
      // Admin panel
      admin: document.getElementById('admin')
    };
  }

  /**
   * Update HUD display with current game stats
   * @param {number} score - Current score
   * @param {number} level - Current level
   * @param {number} best - Best score
   */
  updateHUD(score, level, best) {
    if (this.elements.score) this.elements.score.textContent = score;
    if (this.elements.level) this.elements.level.textContent = level;
    if (this.elements.best) this.elements.best.textContent = best;
  }

  /**
   * Update combat HUD for multiplayer
   * @param {object} playerStats - Player 1 stats
   * @param {object} opponentStats - Player 2 stats
   */
  updateCombatHUD(playerStats, opponentStats) {
    if (this.elements.p1score) this.elements.p1score.textContent = playerStats.score;
    if (this.elements.p2score) this.elements.p2score.textContent = opponentStats.score;
    
    if (this.elements.p1hp) {
      this.elements.p1hp.style.width = Math.max(0, playerStats.hp) + '%';
    }
    if (this.elements.p2hp) {
      this.elements.p2hp.style.width = Math.max(0, opponentStats.hp) + '%';
    }
  }

  /**
   * Update FPS counter
   * @param {number} fps - Current FPS
   */
  updateFPS(fps) {
    if (this.elements.fps) {
      this.elements.fps.textContent = 'FPS: ' + fps;
    }
  }

  /**
   * Update device badge
   * @param {string} deviceType - Device type (MOBILE, TABLET, PC)
   */
  updateDeviceBadge(deviceType) {
    if (this.elements.deviceBadge) {
      this.elements.deviceBadge.textContent = '[ ' + deviceType + ' ]';
    }
  }

  /**
   * Show menu screen
   */
  showMenu() {
    this.hideElement(this.elements.gameover);
    this.hideElement(this.elements.combatOver);
    this.showElement(this.elements.menu);
  }

  /**
   * Hide menu screen
   */
  hideMenu() {
    this.hideElement(this.elements.menu);
  }

  /**
   * Show pause screen
   */
  showPauseScreen() {
    this.showElement(this.elements.pauseScreen);
  }

  /**
   * Hide pause screen
   */
  hidePauseScreen() {
    this.hideElement(this.elements.pauseScreen);
  }

  /**
   * Show game over screen
   * @param {string} playerName - Player name
   * @param {number} finalScore - Final score
   * @param {string} pbLine - Personal best line text
   */
  showGameOver(playerName, finalScore, pbLine) {
    if (document.getElementById('finalScore')) {
      document.getElementById('finalScore').textContent = finalScore;
    }
    if (document.getElementById('goPlayerName')) {
      document.getElementById('goPlayerName').textContent = playerName ? playerName.toUpperCase() : '';
    }
    if (document.getElementById('goPbLine')) {
      document.getElementById('goPbLine').textContent = pbLine;
    }
    this.showElement(this.elements.gameover);
  }

  /**
   * Show combat over screen
   * @param {boolean} won - Win status
   * @param {string} winnerName - Winner name
   * @param {string} stats - Stats HTML
   */
  showCombatOver(won, winnerName, stats) {
    const title = document.getElementById('coTitle');
    const winner = document.getElementById('coWinner');
    const statsDiv = document.getElementById('coStats');

    if (title) {
      title.textContent = won ? '🏆 VICTOIRE !' : '💀 DÉFAITE';
      title.style.color = won ? 'var(--yellow)' : 'var(--red)';
    }
    if (winner) winner.textContent = winnerName;
    if (statsDiv) statsDiv.innerHTML = stats;

    this.showElement(this.elements.combatOver);
  }

  /**
   * Show statistics screen
   * @param {object} stats - Statistics object
   * @param {string} playerName - Player name
   */
  showStats(stats, playerName) {
    if (document.getElementById('stGames')) {
      document.getElementById('stGames').textContent = stats.games;
    }
    if (document.getElementById('stBest')) {
      document.getElementById('stBest').textContent = stats.best;
    }
    if (document.getElementById('stLevel')) {
      document.getElementById('stLevel').textContent = stats.maxLevel;
    }
    if (document.getElementById('stEaten')) {
      document.getElementById('stEaten').textContent = stats.totalEaten;
    }
    if (document.getElementById('stWins')) {
      document.getElementById('stWins').textContent = stats.wins;
    }
    if (document.getElementById('stKills')) {
      document.getElementById('stKills').textContent = stats.kills;
    }
    if (document.getElementById('stPlayer')) {
      document.getElementById('stPlayer').textContent = playerName || 'ANONYME';
    }

    this.showElement(this.elements.statsScreen);
  }

  /**
   * Toggle stats screen visibility
   */
  toggleStats() {
    this.toggleElement(this.elements.statsScreen);
  }

  /**
   * Show combat HUD
   */
  showCombatHUD() {
    this.elements.combatHud.classList.add('active');
    this.hideElement(this.elements.hud);
  }

  /**
   * Hide combat HUD
   */
  hideCombatHUD() {
    this.elements.combatHud.classList.remove('active');
    this.showElement(this.elements.hud);
  }

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Toast type (success, error, info, warning)
   * @param {number} duration - Duration in ms (default 3000)
   */
  showToast(message, type = 'info', duration = 3000) {
    if (!this.elements.toast) return;

    this.elements.toast.textContent = message;
    this.elements.toast.className = 'toast ' + type;
    this.elements.toast.classList.remove('hidden');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  /**
   * Hide toast notification
   */
  hideToast() {
    if (this.elements.toast) {
      this.elements.toast.classList.add('hidden');
    }
  }

  /**
   * Show achievement notification
   * @param {string} text - Achievement text
   */
  showAchievement(text) {
    const div = document.createElement('div');
    div.className = 'achievement';
    div.innerHTML = '🏆 ' + text;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), GAME_CONFIG.ANIMATIONS.ACHIEVEMENT_DURATION);
  }

  /**
   * Show combo notification
   * @param {number} comboCount - Combo count
   */
  showCombo(comboCount) {
    const div = document.createElement('div');
    div.className = 'combo';
    div.textContent = 'x' + comboCount;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), GAME_CONFIG.ANIMATIONS.COMBO_DURATION);
  }

  /**
   * Update mode tags display
   * @param {array} activeModes - Array of active mode names
   * @param {boolean} godMode - God mode status
   */
  updateModeTags(activeModes, godMode = false) {
    const container = document.getElementById('modeTags');
    if (!container) return;

    container.innerHTML = '';

    const labels = {
      wall: '🌀',
      slow: '🐢',
      fast: '⚡',
      double: '✦x2',
      invis: '👻',
      magnet: '🧲',
      ghost: '💨',
      lucky: '🍀x3',
      survival: '☢',
      infinity: '♾',
      hunter: '🤖',
      fog: '🌫',
      growth: '🌱x3'
    };

    activeModes.forEach(mode => {
      if (labels[mode]) {
        const tag = document.createElement('div');
        tag.className = 'mode-tag';
        tag.textContent = labels[mode];
        container.appendChild(tag);
      }
    });

    if (godMode) {
      const tag = document.createElement('div');
      tag.className = 'mode-tag';
      tag.style.color = '#ffd60a';
      tag.style.borderColor = '#ffd60a';
      tag.textContent = '😈GOD';
      container.appendChild(tag);
    }
  }

  /**
   * Helper: Show element
   * @private
   */
  showElement(element) {
    if (element) element.classList.remove('hidden');
  }

  /**
   * Helper: Hide element
   * @private
   */
  hideElement(element) {
    if (element) element.classList.add('hidden');
  }

  /**
   * Helper: Toggle element visibility
   * @private
   */
  toggleElement(element) {
    if (element) element.classList.toggle('hidden');
  }

  /**
   * Get canvas context
   * @returns {CanvasRenderingContext2D} Canvas 2D context
   */
  getCanvasContext() {
    return this.elements.canvas ? this.elements.canvas.getContext('2d') : null;
  }

  /**
   * Get canvas dimensions
   * @returns {object} Canvas width and height
   */
  getCanvasDimensions() {
    if (!this.elements.canvas) return { width: 0, height: 0 };
    return {
      width: this.elements.canvas.width,
      height: this.elements.canvas.height
    };
  }

  /**
   * Set canvas size
   * @param {number} size - Canvas size in pixels
   */
  setCanvasSize(size) {
    if (!this.elements.canvas) return;
    this.elements.canvas.width = size;
    this.elements.canvas.height = size;
    this.elements.canvas.style.width = size + 'px';
    this.elements.canvas.style.height = size + 'px';
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIManager;
}
