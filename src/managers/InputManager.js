/**
 * InputManager Class
 * Handles keyboard and touch input for SERPENT X
 * Manages direction changes, game controls, and UI interactions
 */

class InputManager {
  constructor() {
    this.keys = {};
    this.touches = {};
    this.lastDirection = { x: 0, y: 0 };
    this.currentDirection = { x: 0, y: 0 };
    this.isGamepadConnected = false;
    this.gamepad = null;
    
    this.onDirectionChange = null;
    this.onGameAction = null;
    this.onMenuAction = null;
    this.onTouchMove = null;
    
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchThreshold = GAME_CONFIG.INPUT.TOUCH_THRESHOLD;
    
    this.setupEventListeners();
  }

  /**
   * Setup all event listeners
   * @private
   */
  setupEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    
    // Touch events
    document.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
    document.addEventListener('touchmove', (e) => this.handleTouchMove(e), false);
    document.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
    
    // Gamepad events
    window.addEventListener('gamepadconnected', (e) => this.handleGamepadConnected(e));
    window.addEventListener('gamepaddisconnected', (e) => this.handleGamepadDisconnected(e));
  }

  /**
   * Handle keyboard down
   * @private
   */
  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    this.keys[key] = true;

    // Prevent default for game keys
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      event.preventDefault();
    }

    this.processKeyboardInput();
  }

  /**
   * Handle keyboard up
   * @private
   */
  handleKeyUp(event) {
    const key = event.key.toLowerCase();
    this.keys[key] = false;
  }

  /**
   * Process keyboard input for direction changes
   * @private
   */
  processKeyboardInput() {
    const config = GAME_CONFIG.INPUT;
    let newDir = { x: 0, y: 0 };

    // Arrow keys
    if (this.keys['arrowup'] || this.keys['w']) newDir.y = -1;
    if (this.keys['arrowdown'] || this.keys['s']) newDir.y = 1;
    if (this.keys['arrowleft'] || this.keys['a']) newDir.x = -1;
    if (this.keys['arrowright'] || this.keys['d']) newDir.x = 1;

    // Update direction if changed
    if (newDir.x !== this.currentDirection.x || newDir.y !== this.currentDirection.y) {
      this.currentDirection = newDir;
      
      if (this.onDirectionChange) {
        this.onDirectionChange(this.currentDirection);
      }
    }

    // Game actions
    if (this.keys[' ']) {
      if (this.onGameAction) this.onGameAction('pause');
    }
    if (this.keys['enter']) {
      if (this.onMenuAction) this.onMenuAction('confirm');
    }
    if (this.keys['escape']) {
      if (this.onMenuAction) this.onMenuAction('back');
    }
    if (this.keys['p']) {
      if (this.onGameAction) this.onGameAction('toggle-stats');
    }
  }

  /**
   * Handle touch start
   * @private
   */
  handleTouchStart(event) {
    if (event.touches.length > 0) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  /**
   * Handle touch move
   * @private
   */
  handleTouchMove(event) {
    if (event.touches.length === 0) return;

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    const deltaX = touchX - this.touchStartX;
    const deltaY = touchY - this.touchStartY;

    // Only process if movement exceeds threshold
    if (Math.abs(deltaX) < this.touchThreshold && Math.abs(deltaY) < this.touchThreshold) {
      return;
    }

    let newDir = { x: 0, y: 0 };

    // Determine direction based on larger movement
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      newDir.x = deltaX > 0 ? 1 : -1;
    } else {
      newDir.y = deltaY > 0 ? 1 : -1;
    }

    // Update direction if changed
    if (newDir.x !== this.currentDirection.x || newDir.y !== this.currentDirection.y) {
      this.currentDirection = newDir;
      
      if (this.onDirectionChange) {
        this.onDirectionChange(this.currentDirection);
      }
    }

    if (this.onTouchMove) {
      this.onTouchMove({ x: deltaX, y: deltaY });
    }

    event.preventDefault();
  }

  /**
   * Handle touch end
   * @private
   */
  handleTouchEnd(event) {
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  /**
   * Handle gamepad connected
   * @private
   */
  handleGamepadConnected(event) {
    console.log('InputManager: Gamepad connected', event.gamepad);
    this.isGamepadConnected = true;
    this.gamepad = event.gamepad;
    this.updateGamepadInput();
  }

  /**
   * Handle gamepad disconnected
   * @private
   */
  handleGamepadDisconnected(event) {
    console.log('InputManager: Gamepad disconnected');
    this.isGamepadConnected = false;
    this.gamepad = null;
  }

  /**
   * Update gamepad input
   */
  updateGamepadInput() {
    if (!this.isGamepadConnected) return;

    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (!gamepads || gamepads.length === 0) return;

    const gamepad = gamepads[0];
    if (!gamepad) return;

    const config = GAME_CONFIG.INPUT;
    let newDir = { x: 0, y: 0 };

    // D-Pad
    if (gamepad.buttons[12] && gamepad.buttons[12].pressed) newDir.y = -1; // Up
    if (gamepad.buttons[13] && gamepad.buttons[13].pressed) newDir.y = 1;  // Down
    if (gamepad.buttons[14] && gamepad.buttons[14].pressed) newDir.x = -1; // Left
    if (gamepad.buttons[15] && gamepad.buttons[15].pressed) newDir.x = 1;  // Right

    // Left Stick
    if (gamepad.axes[0] < -config.GAMEPAD_DEADZONE) newDir.x = -1;
    if (gamepad.axes[0] > config.GAMEPAD_DEADZONE) newDir.x = 1;
    if (gamepad.axes[1] < -config.GAMEPAD_DEADZONE) newDir.y = -1;
    if (gamepad.axes[1] > config.GAMEPAD_DEADZONE) newDir.y = 1;

    // Update direction if changed
    if (newDir.x !== this.currentDirection.x || newDir.y !== this.currentDirection.y) {
      this.currentDirection = newDir;
      
      if (this.onDirectionChange) {
        this.onDirectionChange(this.currentDirection);
      }
    }

    // Action buttons
    if (gamepad.buttons[0] && gamepad.buttons[0].pressed) { // A button
      if (this.onGameAction) this.onGameAction('action');
    }
    if (gamepad.buttons[1] && gamepad.buttons[1].pressed) { // B button
      if (this.onMenuAction) this.onMenuAction('back');
    }
    if (gamepad.buttons[9] && gamepad.buttons[9].pressed) { // Start button
      if (this.onGameAction) this.onGameAction('pause');
    }
  }

  /**
   * Get current direction
   * @returns {object} Current direction {x, y}
   */
  getDirection() {
    return { ...this.currentDirection };
  }

  /**
   * Check if key is pressed
   * @param {string} key - Key to check
   * @returns {boolean} Key pressed status
   */
  isKeyPressed(key) {
    return this.keys[key.toLowerCase()] || false;
  }

  /**
   * Check if any arrow key is pressed
   * @returns {boolean} Arrow key pressed status
   */
  isMoving() {
    return this.currentDirection.x !== 0 || this.currentDirection.y !== 0;
  }

  /**
   * Check if gamepad is available
   * @returns {boolean} Gamepad availability
   */
  hasGamepad() {
    return this.isGamepadConnected;
  }

  /**
   * Reset input state
   */
  reset() {
    this.keys = {};
    this.currentDirection = { x: 0, y: 0 };
    this.lastDirection = { x: 0, y: 0 };
  }

  /**
   * Get input device type
   * @returns {string} Device type (keyboard, touch, gamepad)
   */
  getInputDevice() {
    if (this.isGamepadConnected) return 'gamepad';
    if (this.isMoving() && this.touchStartX !== 0) return 'touch';
    return 'keyboard';
  }

  /**
   * Enable/disable input
   * @param {boolean} enabled - Enable state
   */
  setEnabled(enabled) {
    if (!enabled) {
      this.reset();
    }
  }

  /**
   * Get input info
   * @returns {object} Input information
   */
  getInfo() {
    return {
      device: this.getInputDevice(),
      direction: this.currentDirection,
      isMoving: this.isMoving(),
      hasGamepad: this.hasGamepad(),
      keysPressed: Object.keys(this.keys).filter(k => this.keys[k])
    };
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputManager;
}
