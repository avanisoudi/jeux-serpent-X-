/**
 * Configuration Constants for SERPENT X Game
 * Central repository for all game settings and constants
 */

const GAME_CONFIG = {
  // Game Metadata
  APP_NAME: 'SERPENT X',
  APP_VERSION: '1.4.0',
  ADMIN_CONTACT: 'AVANI SOUDI EDITION',
  
  // Canvas Settings
  CANVAS: {
    SIZE_BREAKPOINTS: {
      LARGE: 900,      // Desktop
      MEDIUM: 600,     // Tablet
      SMALL: 420       // Mobile
    },
    TILE_SIZE: 25,
    GRID_COLOR: 'rgba(255,255,255,0.03)',
    BACKGROUND: '#08111f'
  },

  // Game Speed
  BASE_SPEED: 260,
  MIN_SPEED: 80,
  SPEED_INCREMENT: 5,
  
  // Game Physics
  TILES_SPAWN_RETRY_MAX: 100,
  
  // Modes & Features
  MODES: {
    wall: 'Wrap around walls',
    slow: 'Ultra slow movement',
    fast: 'Ultra fast movement',
    double: 'Double score multiplier',
    invis: 'Invisible snake body',
    magnet: 'Auto-attracts to food',
    ghost: 'Pass through snake body',
    lucky: 'Triple score',
    survival: 'Survival mode with timer',
    infinity: 'Infinite map',
    hunter: 'AI hunter opponent',
    fog: 'Limited visibility',
    growth: 'Triple growth on food'
  },

  // Survival Mode
  SURVIVAL_DURATION: 1800,  // Frames (about 7 seconds at base speed)
  SURVIVAL_TIMER_REGEN: 200,
  
  // Combat Mode
  COMBAT: {
    INITIAL_HP: 100,
    INITIAL_ATK: 10,
    INITIAL_DEF: 5,
    MAX_ATK: 50,
    ATK_GROWTH_PER_FOOD: 1,
    DEF_GROWTH_PER_LEVEL: 1,
    VENOM_DAMAGE: 15,
    VENOM_MIN_DAMAGE: 1,
    HP_REGEN_CHANCE: 0.01,
    OPPONENT_SYNC_INTERVAL: 50  // ms
  },

  // Scoring
  SCORING: {
    BASE_FOOD: 10,
    MEGA_FOOD: 100,
    BONUS_FOOD: 200,
    LEVEL_UP_THRESHOLD_SOLO: 100,
    LEVEL_UP_THRESHOLD_COMBAT: 300,
    HUNTER_PENALTY: 50,
    COMBO_SPAWN_THRESHOLD: 5
  },

  // Growth
  GROWTH: {
    NORMAL: 1,
    DOUBLE: 2,
    TRIPLE: 3
  },

  // Colors Theme
  COLORS: {
    CYBER: { head: '#00ff88', body: '#00e5ff', name: 'CYBER' },
    ROUGE: { head: '#ff2d55', body: '#ff6b81', name: 'ROUGE' },
    VIOLET: { head: '#a855f7', body: '#c084fc', name: 'VIOLET' },
    OR: { head: '#ffd60a', body: '#ffaa00', name: 'OR' },
    BLEU: { head: '#00e5ff', body: '#0ea5e9', name: 'BLEU' },
    ORANGE: { head: '#ff9500', body: '#fb923c', name: 'ORANGE' },
    ROSE: { head: '#ec4899', body: '#f472b6', name: 'ROSE' },
    BLANC: { head: '#ffffff', body: '#94a3b8', name: 'BLANC' }
  },

  // UI Animations
  ANIMATIONS: {
    COMBO_DURATION: 1000,
    ACHIEVEMENT_DURATION: 3000,
    COUNTDOWN_DURATION: 1000,
    BONUS_NOTIF_DURATION: 3000,
    VENOM_FLASH_DURATION: 400,
    MODAL_ANIMATION_DURATION: 200
  },

  // Audio
  AUDIO: {
    CONTEXT_STATE_SUSPENDED: 'suspended',
    CONTEXT_STATE_RUNNING: 'running',
    SOUND_EFFECTS: {
      EAT: { freq: 700, duration: 70, type: 'sine' },
      COMBO: { freq: 800, duration: 60, type: 'triangle' },
      LEVEL_UP: { freq: 1200, duration: 150, type: 'triangle' },
      VENOM: { freq: 600, duration: 150, type: 'square' },
      DEATH: { freq: 120, duration: 500, type: 'sawtooth' },
      HURT: { freq: 200, duration: 300, type: 'sawtooth' },
      COUNTDOWN: { freq: 600, duration: 100, type: 'triangle' },
      COUNTDOWN_FINAL: { freq: 900, duration: 100, type: 'triangle' },
      ADMIN_LOGIN: { freq: 1200, duration: 150, type: 'triangle' },
      MODE_TOGGLE: { freq: 800, duration: 60, type: 'triangle' }
    }
  },

  // Storage Keys
  STORAGE: {
    LAST_PLAYER_NAME: 'sx_last_name',
    BEST_SCORE_PREFIX: 'sx_best_',
    ADMIN_HASH: 'sx_admin_hash',
    GAMES_PLAYED: 'sx_games',
    MAX_LEVEL: 'sx_max_level',
    TOTAL_EATEN: 'sx_eaten',
    WINS: 'sx_wins',
    KILLS: 'sx_kills',
    GLOBAL_BEST: 'sx_global_best'
  },

  // Multiplayer (PeerJS)
  PEER: {
    DEBUG_LEVEL: 0,
    CODE_FORMAT: 'VIPER-',
    CODE_LENGTH: 4,
    ID_PREFIX: 'sx'
  },

  // Mobile Detection
  MOBILE: {
    USER_AGENT_PATTERNS: /Android|iPhone|iPad|iPod|Touch/i,
    TOUCH_POINTS_THRESHOLD: 1,
    TABLET_MIN_WIDTH: 600,
    D_PAD_SIZE: 56,
    D_PAD_SPACING: 5
  },

  // Hunter AI
  HUNTER: {
    TICK_INTERVAL: 4,
    MOVEMENT_LOGIC: 'chase_food'
  },

  // Fog of War
  FOG: {
    RADIUS_TILES: 4,
    OPACITY: 0.97,
    GRADIENT_START: 0.6,
    GRADIENT_END: 1.0
  }
};

// Export for both ES6 modules and vanilla JS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_CONFIG;
}
