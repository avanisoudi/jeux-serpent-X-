/**
 * Renderer Class
 * Handles all game rendering and canvas drawing for SERPENT X
 * Manages sprites, animations, and visual effects
 */

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.tileSize = GAME_CONFIG.CANVAS.TILE_SIZE;
    this.colors = GAME_CONFIG.COLORS;
    this.gridSize = Math.floor(canvas ? canvas.width / this.tileSize : 0);
  }

  /**
   * Clear canvas
   */
  clear() {
    if (!this.ctx) return;
    this.ctx.fillStyle = GAME_CONFIG.CANVAS.BACKGROUND;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw grid
   */
  drawGrid() {
    if (!this.ctx) return;
    
    this.ctx.strokeStyle = GAME_CONFIG.CANVAS.GRID_COLOR;
    this.ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= this.canvas.width; x += this.tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.canvas.height; y += this.tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  /**
   * Draw snake
   * @param {array} snake - Snake segments array
   * @param {object} colorPair - Color object with head and body colors
   * @param {boolean} invisible - Invisible mode flag
   * @param {number} alpha - Alpha transparency
   */
  drawSnake(snake, colorPair, invisible = false, alpha = 1) {
    if (!this.ctx || !snake || snake.length === 0) return;

    this.ctx.globalAlpha = alpha;

    // Draw body
    this.ctx.fillStyle = invisible ? 'rgba(0,0,0,0)' : colorPair.body;
    for (let i = 1; i < snake.length; i++) {
      const segment = snake[i];
      this.drawTile(segment.x, segment.y, colorPair.body, false);
    }

    // Draw head
    this.ctx.fillStyle = colorPair.head;
    const head = snake[0];
    this.drawTile(head.x, head.y, colorPair.head, true);

    // Draw eyes
    this.drawSnakeEyes(head, colorPair);

    this.ctx.globalAlpha = 1;
  }

  /**
   * Draw snake eyes
   * @private
   */
  drawSnakeEyes(head, colorPair) {
    if (!this.ctx) return;

    const x = head.x * this.tileSize + this.tileSize / 2;
    const y = head.y * this.tileSize + this.tileSize / 2;
    const eyeSize = this.tileSize / 6;
    const eyeDistance = this.tileSize / 4;

    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(x - eyeDistance, y - eyeDistance, eyeSize, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x + eyeDistance, y + eyeDistance, eyeSize, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(x - eyeDistance, y - eyeDistance, eyeSize / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x + eyeDistance, y + eyeDistance, eyeSize / 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Draw single tile
   * @private
   */
  drawTile(gridX, gridY, color, isHead = false) {
    if (!this.ctx) return;

    const x = gridX * this.tileSize;
    const y = gridY * this.tileSize;
    const size = this.tileSize - 1;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, size, size);

    if (isHead) {
      this.ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x, y, size, size);
    }
  }

  /**
   * Draw food
   * @param {object} food - Food position
   * @param {string} type - Food type (normal, special, bonus)
   */
  drawFood(food, type = 'normal') {
    if (!this.ctx || !food) return;

    const x = food.x * this.tileSize + this.tileSize / 2;
    const y = food.y * this.tileSize + this.tileSize / 2;

    if (type === 'bonus') {
      this.drawStar(x, y, 5, this.tileSize / 2, this.tileSize / 4, '#ffd60a');
    } else if (type === 'special') {
      this.ctx.fillStyle = '#ff2d55';
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.tileSize / 2.5, 0, Math.PI * 2);
      this.ctx.fill();
      this.drawStar(x, y, 5, this.tileSize / 3, this.tileSize / 5, '#ffffff');
    } else {
      this.ctx.fillStyle = '#00ff88';
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.tileSize / 2.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Draw star shape
   * @private
   */
  drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
    if (!this.ctx) return;

    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      this.ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      this.ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }

    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  /**
   * Draw venom tiles
   * @param {array} venomTiles - Venom tile positions
   */
  drawVenom(venomTiles) {
    if (!this.ctx || !venomTiles) return;

    this.ctx.fillStyle = 'rgba(255, 45, 85, 0.6)';
    venomTiles.forEach(tile => {
      this.drawTile(tile.x, tile.y, 'rgba(255, 45, 85, 0.6)');
    });
  }

  /**
   * Draw fog of war effect
   * @param {object} playerHead - Player head position
   */
  drawFogOfWar(playerHead) {
    if (!this.ctx || !playerHead) return;

    const radius = GAME_CONFIG.FOG.RADIUS_TILES * this.tileSize;
    const centerX = playerHead.x * this.tileSize + this.tileSize / 2;
    const centerY = playerHead.y * this.tileSize + this.tileSize / 2;

    const gradient = this.ctx.createRadialGradient(centerX, centerY, radius * GAME_CONFIG.FOG.GRADIENT_START, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(8, 17, 31, 0)');
    gradient.addColorStop(1, 'rgba(8, 17, 31, ' + GAME_CONFIG.FOG.OPACITY + ')');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw countdown timer
   * @param {number} count - Countdown number
   * @param {boolean} isWarning - Warning state
   */
  drawCountdown(count, isWarning = false) {
    if (!this.ctx) return;

    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;

    this.ctx.fillStyle = isWarning ? '#ff2d55' : '#00ff88';
    this.ctx.font = 'bold 120px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    this.ctx.fillText(count, x, y);

    // Glow effect
    this.ctx.strokeStyle = isWarning ? 'rgba(255, 45, 85, 0.5)' : 'rgba(0, 255, 136, 0.5)';
    this.ctx.lineWidth = 4;
    this.ctx.strokeText(count, x, y);
  }

  /**
   * Draw level up animation
   * @param {number} newLevel - New level number
   * @param {number} progress - Animation progress (0-1)
   */
  drawLevelUp(newLevel, progress) {
    if (!this.ctx) return;

    const x = this.canvas.width / 2;
    const y = this.canvas.height / 3;
    const alpha = Math.max(0, 1 - progress);

    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = '#00ff88';
    this.ctx.font = 'bold 80px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const scale = 1 + progress * 0.5;
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(scale, scale);
    this.ctx.fillText('LEVEL ' + newLevel, 0, 0);
    this.ctx.restore();

    this.ctx.globalAlpha = 1;
  }

  /**
   * Draw text on canvas
   * @param {string} text - Text to draw
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} color - Text color
   * @param {string} fontSize - Font size
   * @param {string} align - Text alignment
   */
  drawText(text, x, y, color = '#ffffff', fontSize = '16px', align = 'center') {
    if (!this.ctx) return;

    this.ctx.fillStyle = color;
    this.ctx.font = fontSize + ' Arial';
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  /**
   * Draw semi-transparent overlay
   * @param {string} color - Overlay color
   * @param {number} alpha - Alpha transparency
   */
  drawOverlay(color = 'rgba(0, 0, 0, 0.5)', alpha = 0.5) {
    if (!this.ctx) return;

    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = alpha;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
  }

  /**
   * Get grid size
   * @returns {number} Grid size (tiles per side)
   */
  getGridSize() {
    return this.gridSize;
  }

  /**
   * Resize canvas
   * @param {number} width - New width
   * @param {number} height - New height
   */
  resize(width, height) {
    if (!this.canvas) return;
    
    this.canvas.width = width;
    this.canvas.height = height;
    this.gridSize = Math.floor(width / this.tileSize);
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Renderer;
}
