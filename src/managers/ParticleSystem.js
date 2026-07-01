/**
 * Particle System Class
 * Manages particle effects for visual feedback
 */

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.emitters = [];
    this.particlePool = [];
    this.poolSize = GAME_CONFIG.PERFORMANCE.PARTICLE_POOL_SIZE;
    this.initializePool();
  }

  /**
   * Initialize particle pool
   * @private
   */
  initializePool() {
    for (let i = 0; i < this.poolSize; i++) {
      this.particlePool.push(this.createParticle());
    }
  }

  /**
   * Create particle
   * @private
   */
  createParticle() {
    return {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      lifetime: 0,
      maxLifetime: 1,
      size: 1,
      color: '#ffffff',
      opacity: 1,
      rotation: 0,
      angularVelocity: 0,
      active: false,
      friction: 1
    };
  }

  /**
   * Get particle from pool
   * @private
   */
  getParticle() {
    if (this.particlePool.length > 0) {
      return this.particlePool.pop();
    }
    return this.createParticle();
  }

  /**
   * Return particle to pool
   * @private
   */
  returnParticle(particle) {
    particle.active = false;
    if (this.particlePool.length < this.poolSize) {
      this.particlePool.push(particle);
    }
  }

  /**
   * Emit particles
   * @param {object} config - Emitter configuration
   */
  emit(config) {
    const {
      position,
      velocity,
      count = 10,
      spread = 360,
      speed = 1,
      color = '#00ff88',
      lifetime = 1000,
      size = 2
    } = config;

    for (let i = 0; i < count; i++) {
      const particle = this.getParticle();
      const angle = (Math.random() * spread - spread / 2) * Math.PI / 180;
      
      particle.position = { ...position };
      particle.velocity = {
        x: (velocity?.x || Math.cos(angle)) * speed,
        y: (velocity?.y || Math.sin(angle)) * speed
      };
      particle.lifetime = 0;
      particle.maxLifetime = lifetime / 1000;
      particle.size = size;
      particle.color = color;
      particle.opacity = 1;
      particle.rotation = Math.random() * Math.PI * 2;
      particle.angularVelocity = Math.random() * 5 - 2.5;
      particle.active = true;

      this.particles.push(particle);
    }
  }

  /**
   * Update particles
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      if (!particle.active) {
        this.particles.splice(i, 1);
        this.returnParticle(particle);
        continue;
      }

      // Update lifetime
      particle.lifetime += deltaTime;
      if (particle.lifetime >= particle.maxLifetime) {
        particle.active = false;
        this.particles.splice(i, 1);
        this.returnParticle(particle);
        continue;
      }

      // Update position
      particle.velocity.x *= particle.friction;
      particle.velocity.y *= particle.friction;
      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;

      // Update rotation
      particle.rotation += particle.angularVelocity * deltaTime;

      // Update opacity
      const progress = particle.lifetime / particle.maxLifetime;
      particle.opacity = Math.max(0, 1 - progress);
    }
  }

  /**
   * Render particles
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  render(ctx) {
    if (!ctx) return;

    this.particles.forEach(particle => {
      if (!particle.active) return;

      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.translate(particle.position.x, particle.position.y);
      ctx.rotate(particle.rotation);

      // Draw particle
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);

      ctx.restore();
    });
  }

  /**
   * Create explosion effect
   * @param {object} position - Explosion position
   * @param {object} options - Effect options
   */
  createExplosion(position, options = {}) {
    this.emit({
      position,
      count: options.count || 20,
      spread: 360,
      speed: options.speed || 2,
      color: options.color || '#ff2d55',
      lifetime: options.lifetime || 800,
      size: options.size || 3,
      ...options
    });
  }

  /**
   * Create trail effect
   * @param {object} position - Trail position
   * @param {object} color - Trail color
   */
  createTrail(position, color = '#00ff88') {
    this.emit({
      position,
      count: 1,
      spread: 10,
      speed: 0,
      color,
      lifetime: 300,
      size: 1
    });
  }

  /**
   * Create pickup effect
   * @param {object} position - Pickup position
   */
  createPickup(position) {
    this.emit({
      position,
      count: 15,
      spread: 360,
      speed: 1.5,
      color: '#ffd60a',
      lifetime: 600,
      size: 2
    });
  }

  /**
   * Get particle count
   * @returns {number} Active particle count
   */
  getCount() {
    return this.particles.length;
  }

  /**
   * Clear all particles
   */
  clear() {
    this.particles.forEach(particle => {
      this.returnParticle(particle);
    });
    this.particles = [];
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParticleSystem;
}
