/**
 * StorageManager Class
 * Handles all local storage operations for SERPENT X
 * Manages player profiles, game stats, and admin settings
 */

class StorageManager {
  constructor() {
    this.config = GAME_CONFIG.STORAGE;
  }

  /**
   * Load player's best score
   * @param {string} playerName - Player name
   * @returns {number} Best score for player
   */
  loadPlayerBest(playerName) {
    if (!playerName || !playerName.trim()) return 0;
    const key = this.config.BEST_SCORE_PREFIX + playerName.trim().toLowerCase();
    return parseInt(localStorage.getItem(key)) || 0;
  }

  /**
   * Save player's best score
   * @param {string} playerName - Player name
   * @param {number} score - Best score
   */
  savePlayerBest(playerName, score) {
    if (!playerName || !playerName.trim()) return;
    const key = this.config.BEST_SCORE_PREFIX + playerName.trim().toLowerCase();
    localStorage.setItem(key, score);
  }

  /**
   * Load last player name
   * @returns {string} Last player name used
   */
  loadLastPlayerName() {
    return localStorage.getItem(this.config.LAST_PLAYER_NAME) || '';
  }

  /**
   * Save last player name
   * @param {string} playerName - Player name
   */
  saveLastPlayerName(playerName) {
    if (playerName && playerName.trim()) {
      localStorage.setItem(this.config.LAST_PLAYER_NAME, playerName);
    }
  }

  /**
   * Increment game statistic
   * @param {string} key - Stat key
   * @param {number} amount - Amount to increment (default 1)
   */
  incrementStat(key, amount = 1) {
    const current = parseInt(localStorage.getItem(key)) || 0;
    localStorage.setItem(key, current + amount);
  }

  /**
   * Get game statistic
   * @param {string} key - Stat key
   * @returns {number} Statistic value
   */
  getStat(key) {
    return parseInt(localStorage.getItem(key)) || 0;
  }

  /**
   * Set game statistic
   * @param {string} key - Stat key
   * @param {number} value - Stat value
   */
  setStat(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * Get all player statistics
   * @param {string} playerName - Player name
   * @returns {object} All stats for player
   */
  getAllStats(playerName) {
    return {
      games: this.getStat(this.config.GAMES_PLAYED),
      best: this.loadPlayerBest(playerName) || this.getStat(this.config.GLOBAL_BEST),
      maxLevel: this.getStat(this.config.MAX_LEVEL),
      totalEaten: this.getStat(this.config.TOTAL_EATEN),
      wins: this.getStat(this.config.WINS),
      kills: this.getStat(this.config.KILLS),
      globalBest: this.getStat(this.config.GLOBAL_BEST)
    };
  }

  /**
   * Save admin password hash
   * @param {string} hash - SHA256 hash of password
   */
  saveAdminHash(hash) {
    localStorage.setItem(this.config.ADMIN_HASH, hash);
  }

  /**
   * Load admin password hash
   * @returns {string|null} Saved admin hash
   */
  loadAdminHash() {
    return localStorage.getItem(this.config.ADMIN_HASH);
  }

  /**
   * Reset all game data
   * @param {boolean} confirm - Confirmation flag
   */
  resetAllData(confirm = false) {
    if (!confirm) {
      console.warn('StorageManager: Reset requires confirmation');
      return false;
    }
    
    const keysToDelete = Object.values(this.config);
    keysToDelete.forEach(key => {
      // Delete all matching keys (including player-specific best scores)
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith(this.config.BEST_SCORE_PREFIX) || 
            keysToDelete.includes(k)) {
          localStorage.removeItem(k);
        }
      });
    });
    
    console.log('StorageManager: All data reset');
    return true;
  }

  /**
   * Export all game data as JSON
   * @returns {string} JSON string of all data
   */
  exportData() {
    const exportData = {
      version: GAME_CONFIG.APP_VERSION,
      exportDate: new Date().toISOString(),
      stats: {},
      playerScores: {}
    };

    // Export global stats
    Object.values(this.config).forEach(key => {
      if (typeof key === 'string' && key.startsWith('sx_')) {
        exportData.stats[key] = this.getStat(key);
      }
    });

    // Export player best scores
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.config.BEST_SCORE_PREFIX)) {
        const playerName = key.replace(this.config.BEST_SCORE_PREFIX, '');
        exportData.playerScores[playerName] = localStorage.getItem(key);
      }
    });

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import game data from JSON
   * @param {string} jsonData - JSON string to import
   * @returns {boolean} Success status
   */
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);

      if (!data.version) {
        console.error('StorageManager: Invalid export format');
        return false;
      }

      // Import stats
      if (data.stats) {
        Object.entries(data.stats).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
      }

      // Import player scores
      if (data.playerScores) {
        Object.entries(data.playerScores).forEach(([playerName, score]) => {
          const key = this.config.BEST_SCORE_PREFIX + playerName;
          localStorage.setItem(key, score);
        });
      }

      console.log('StorageManager: Data imported successfully');
      return true;
    } catch (error) {
      console.error('StorageManager: Import failed -', error);
      return false;
    }
  }

  /**
   * Clear all player-specific best scores
   */
  clearPlayerScores() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.config.BEST_SCORE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Get storage usage summary
   * @returns {object} Storage usage info
   */
  getStorageInfo() {
    const allKeys = Object.keys(localStorage);
    const gameDataKeys = allKeys.filter(k => k.startsWith('sx_'));
    
    return {
      totalItems: allKeys.length,
      gameDataItems: gameDataKeys.length,
      estimatedSize: JSON.stringify(localStorage).length,
      keys: gameDataKeys
    };
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
