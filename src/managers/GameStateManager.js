/**
 * GameStateManager Class
 * Central state management for SERPENT X
 * Handles all game state variables and their updates
 */

class GameStateManager {
  constructor() {
    this.resetGameState();
    this.resetCombatState();
  }

  /**
   * Reset solo game state to defaults
   */
  resetGameState() {
    this.snake = [];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.food = null;
    this.specialFood = null;
    this.bonusFood = null;
    
    this.score = 0;
    this.level = 1;
    this.best = 0;
    this.totalEaten = 0;
    this.combo = 0;
    
    this.isRunning = false;
    this.isPaused = false;
    this.isGodMode = false;
    this.isCombatMode = false;
    
    this.speed = GAME_CONFIG.BASE_SPEED;
    this.survivalTimer = 0;
    this.hunter = null;
    
    this.modes = {
      wall: false,
      slow: false,
      fast: false,
      double: false,
      invis: false,
      magnet: false,
      ghost: false,
      lucky: false,
      survival: false,
      infinity: false,
      hunter: false,
      fog: false,
      growth: false
    };

    this.frameCount = 0;
    this.lastTime = 0;
    this.fpsTime = 0;
  }

  /**
   * Reset combat mode state to defaults
   */
  resetCombatState() {
    // Player 1 (self)
    this.myHP = GAME_CONFIG.COMBAT.INITIAL_HP;
    this.myATK = GAME_CONFIG.COMBAT.INITIAL_ATK;
    this.myDEF = GAME_CONFIG.COMBAT.INITIAL_DEF;
    this.myKills = 0;

    // Player 2 (opponent)
    this.opponentSnake = [];
    this.opponentDirection = { x: 1, y: 0 };
    this.opponentScore = 0;
    this.opponentName = 'ADVERSAIRE';
    this.opponentColorIdx = 1;
    this.opponentHP = GAME_CONFIG.COMBAT.INITIAL_HP;
    this.opponentATK = GAME_CONFIG.COMBAT.INITIAL_ATK;
    this.opponentDEF = GAME_CONFIG.COMBAT.INITIAL_DEF;
    this.opponentKills = 0;

    this.venomTiles = [];
  }

  /**
   * Get current game state snapshot
   * @returns {object} Game state object
   */
  getState() {
    return {
      snake: [...this.snake],
      direction: { ...this.direction },
      nextDirection: { ...this.nextDirection },
      food: this.food ? { ...this.food } : null,
      score: this.score,
      level: this.level,
      best: this.best,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      isGodMode: this.isGodMode,
      speed: this.speed,
      modes: { ...this.modes }
    };
  }

  /**
   * Get combat state snapshot
   * @returns {object} Combat state object
   */
  getCombatState() {
    return {
      myHP: this.myHP,
      myATK: this.myATK,
      myDEF: this.myDEF,
      myKills: this.myKills,
      opponentHP: this.opponentHP,
      opponentATK: this.opponentATK,
      opponentDEF: this.opponentDEF,
      opponentKills: this.opponentKills
    };
  }

  /**
   * Update snake position
   * @param {object} newHead - New head position
   */
  updateSnakeHead(newHead) {
    this.snake.unshift(newHead);
  }

  /**
   * Remove snake tail
   */
  removeSnakeTail() {
    if (this.snake.length > 0) {
      this.snake.pop();
    }
  }

  /**
   * Check if snake has collided with itself
   * @returns {boolean} Collision status
   */
  checkSelfCollision() {
    if (this.snake.length <= 1) return false;
    
    const head = this.snake[0];
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if position contains food
   * @param {object} position - Position to check
   * @returns {boolean} Food collision status
   */
  checkFoodCollision(position) {
    return this.food && position.x === this.food.x && position.y === this.food.y;
  }

  /**
   * Check if position contains special food
   * @param {object} position - Position to check
   * @returns {boolean} Special food collision status
   */
  checkSpecialFoodCollision(position) {
    return this.specialFood && position.x === this.specialFood.x && position.y === this.specialFood.y;
  }

  /**
   * Check if position contains bonus food
   * @param {object} position - Position to check
   * @returns {boolean} Bonus food collision status
   */
  checkBonusFoodCollision(position) {
    return this.bonusFood && position.x === this.bonusFood.x && position.y === this.bonusFood.y;
  }

  /**
   * Toggle mode on/off
   * @param {string} modeName - Mode name
   */
  toggleMode(modeName) {
    if (modeName in this.modes) {
      this.modes[modeName] = !this.modes[modeName];
    }
  }

  /**
   * Check if mode is active
   * @param {string} modeName - Mode name
   * @returns {boolean} Mode status
   */
  isModeActive(modeName) {
    return this.modes[modeName] === true;
  }

  /**
   * Get all active modes
   * @returns {array} Array of active mode names
   */
  getActiveModes() {
    return Object.keys(this.modes).filter(mode => this.modes[mode]);
  }

  /**
   * Disable conflicting modes
   * Used to prevent incompatible modes running together
   */
  resolveConflictingModes() {
    // Slow and Fast modes conflict
    if (this.modes.slow && this.modes.fast) {
      this.modes.fast = false;
    }
  }

  /**
   * Take damage in combat
   * @param {number} damage - Damage amount
   */
  takeDamage(damage) {
    const actualDamage = Math.max(GAME_CONFIG.COMBAT.VENOM_MIN_DAMAGE, damage - this.myDEF);
    this.myHP = Math.max(0, this.myHP - actualDamage);
  }

  /**
   * Regenerate health in combat
   */
  regenHealth() {
    if (this.myHP < GAME_CONFIG.COMBAT.INITIAL_HP && 
        Math.random() < GAME_CONFIG.COMBAT.HP_REGEN_CHANCE) {
      this.myHP = Math.min(GAME_CONFIG.COMBAT.INITIAL_HP, this.myHP + 1);
    }
  }

  /**
   * Increase attack stat
   */
  increaseAttack() {
    this.myATK = Math.min(
      GAME_CONFIG.COMBAT.MAX_ATK,
      this.myATK + GAME_CONFIG.COMBAT.ATK_GROWTH_PER_FOOD
    );
  }

  /**
   * Check if player is dead
   * @returns {boolean} Death status
   */
  isDead() {
    return this.myHP <= 0;
  }

  /**
   * Check if opponent is dead
   * @returns {boolean} Opponent death status
   */
  isOpponentDead() {
    return this.opponentHP <= 0;
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameStateManager;
}
