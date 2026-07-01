/**
 * Collision Manager Class
 * Handles collision detection and response
 */

class CollisionManager {
  constructor() {
    this.collisions = [];
    this.collisionCallbacks = {};
  }

  /**
   * Register collision callback
   * @param {string} eventType - Collision event type
   * @param {function} callback - Callback function
   */
  on(eventType, callback) {
    if (!this.collisionCallbacks[eventType]) {
      this.collisionCallbacks[eventType] = [];
    }
    this.collisionCallbacks[eventType].push(callback);
  }

  /**
   * Check collision between two rectangles (AABB)
   * @param {object} rect1 - First rectangle
   * @param {object} rect2 - Second rectangle
   * @returns {boolean} Collision detected
   */
  checkAABB(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  /**
   * Check grid-based collision
   * @param {object} pos1 - First position
   * @param {object} pos2 - Second position
   * @returns {boolean} Same grid cell
   */
  checkGrid(pos1, pos2) {
    const tileSize = GAME_CONFIG.CANVAS.TILE_SIZE;
    return Math.floor(pos1.x / tileSize) === Math.floor(pos2.x / tileSize) &&
           Math.floor(pos1.y / tileSize) === Math.floor(pos2.y / tileSize);
  }

  /**
   * Check if position is out of bounds
   * @param {object} position - Position
   * @param {number} size - Entity size
   * @returns {boolean} Out of bounds
   */
  isOutOfBounds(position, size = 1) {
    const tileSize = GAME_CONFIG.CANVAS.TILE_SIZE;
    const gridWidth = GAME_CONFIG.CANVAS.WIDTH / tileSize;
    const gridHeight = GAME_CONFIG.CANVAS.HEIGHT / tileSize;

    return position.x < 0 || position.x >= gridWidth ||
           position.y < 0 || position.y >= gridHeight;
  }

  /**
   * Wrap position around screen
   * @param {object} position - Position
   * @returns {object} Wrapped position
   */
  wrapPosition(position) {
    const tileSize = GAME_CONFIG.CANVAS.TILE_SIZE;
    const gridWidth = GAME_CONFIG.CANVAS.WIDTH / tileSize;
    const gridHeight = GAME_CONFIG.CANVAS.HEIGHT / tileSize;

    return {
      x: position.x < 0 ? gridWidth - 1 : position.x >= gridWidth ? 0 : position.x,
      y: position.y < 0 ? gridHeight - 1 : position.y >= gridHeight ? 0 : position.y
    };
  }

  /**
   * Check snake-food collision
   * @param {object} snakeHead - Snake head position
   * @param {object} foodPosition - Food position
   * @returns {boolean} Collision detected
   */
  checkSnakeFoodCollision(snakeHead, foodPosition) {
    return this.checkGrid(snakeHead, foodPosition);
  }

  /**
   * Check snake-snake collision
   * @param {array} snakeSegments - Snake body segments
   * @param {number} skipIndex - Index to skip (for head)
   * @returns {boolean} Collision detected
   */
  checkSelfCollision(snakeSegments, skipIndex = 0) {
    if (snakeSegments.length < 4) return false;

    const head = snakeSegments[0];
    for (let i = skipIndex + 3; i < snakeSegments.length; i++) {
      if (this.checkGrid(head, snakeSegments[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Clear collision data
   */
  clear() {
    this.collisions = [];
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CollisionManager;
}
