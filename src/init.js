/**
 * Game.js - Updated with Game class implementation
 */

// Game initialization example
function initializeGame() {
  // Get canvas element
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return null;
  }

  // Validate configuration
  validateGameConfig();

  // Create game instance
  const game = new Game(canvas);

  // Setup event listeners for UI
  setupUIEventListeners(game);

  // Start the game
  game.start();

  return game;
}

/**
 * Setup UI event listeners
 */
function setupUIEventListeners(game) {
  // Start button
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      game.start();
    });
  }

  // Pause button
  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      game.togglePause();
    });
  }

  // Difficulty selector
  const difficultySelect = document.getElementById('difficulty');
  if (difficultySelect) {
    difficultySelect.addEventListener('change', (e) => {
      game.storageManager.updateSettings({ difficulty: e.target.value });
      game.difficulty = e.target.value;
    });
  }

  // Volume control
  const volumeControl = document.getElementById('volume');
  if (volumeControl) {
    volumeControl.addEventListener('change', (e) => {
      game.audioManager.setVolume(e.target.value);
      game.storageManager.updateSettings({ volume: e.target.value });
    });
  }

  // Settings button
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      game.gameStateManager.setState(GAME_CONFIG.GAME_STATES.SETTINGS);
    });
  }
}

/**
 * Initialize game when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Initializing SERPENT X v2.0...');
  
  const game = initializeGame();
  
  if (game) {
    console.log('✅ Game initialized successfully');
    console.log('📊 Game info:', game.getInfo());
  } else {
    console.error('❌ Failed to initialize game');
  }
});

/**
 * Handle window unload - save game state
 */
window.addEventListener('beforeunload', () => {
  console.log('💾 Saving game state...');
});

/**
 * Handle visibility change - pause on blur
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Pausing game - window hidden');
  } else {
    console.log('Resuming game - window visible');
  }
});
