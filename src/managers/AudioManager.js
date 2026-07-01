/**
 * AudioManager Class
 * Handles all audio operations for SERPENT X
 * Web Audio API wrapper for sound effects and music
 */

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.isInitialized = false;
    this.isMuted = false;
    this.masterVolume = 0.03;
  }

  /**
   * Initialize audio context
   * Must be called after user interaction due to browser restrictions
   */
  initialize() {
    try {
      if (this.audioContext) return;
      
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.isInitialized = true;
      
      console.log('AudioManager: Initialized with', this.audioContext.sampleRate, 'Hz');
    } catch (error) {
      console.error('AudioManager: Failed to initialize -', error);
    }
  }

  /**
   * Resume audio context if suspended
   * Required for iOS and some browsers
   */
  resume() {
    if (!this.audioContext) {
      this.initialize();
      return;
    }

    if (this.audioContext.state === GAME_CONFIG.AUDIO.CONTEXT_STATE_SUSPENDED) {
      this.audioContext.resume().then(() => {
        console.log('AudioManager: Context resumed');
      });
    }
  }

  /**
   * Play sound effect
   * @param {string} effectName - Name of sound effect
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in ms
   * @param {string} waveType - Wave type: 'sine', 'square', 'sawtooth', 'triangle'
   */
  playSound(effectName, frequency = 700, duration = 100, waveType = 'sine') {
    if (!this.audioContext || this.isMuted) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = waveType;
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);

    } catch (error) {
      console.error('AudioManager: Error playing sound -', error);
    }
  }

  /**
   * Play predefined sound effect from config
   * @param {string} effectKey - Effect key from GAME_CONFIG.AUDIO.SOUND_EFFECTS
   */
  playSoundEffect(effectKey) {
    const effects = GAME_CONFIG.AUDIO.SOUND_EFFECTS;
    const effect = effects[effectKey];

    if (!effect) {
      console.warn('AudioManager: Unknown effect -', effectKey);
      return;
    }

    this.playSound(effectKey, effect.freq, effect.duration, effect.type);
  }

  /**
   * Play eat sound
   */
  playEatSound() {
    this.playSoundEffect('EAT');
  }

  /**
   * Play combo sound
   */
  playComboSound() {
    this.playSoundEffect('COMBO');
  }

  /**
   * Play level up sound
   */
  playLevelUpSound() {
    this.playSoundEffect('LEVEL_UP');
  }

  /**
   * Play venom hit sound
   */
  playVenomSound() {
    this.playSoundEffect('VENOM');
  }

  /**
   * Play death sound
   */
  playDeathSound() {
    this.playSoundEffect('DEATH');
  }

  /**
   * Play hurt sound
   */
  playHurtSound() {
    this.playSoundEffect('HURT');
  }

  /**
   * Play countdown sound
   * @param {number} countdownNumber - Number in countdown (1, 2, or 3)
   */
  playCountdownSound(countdownNumber) {
    const effectKey = countdownNumber === 1 ? 'COUNTDOWN_FINAL' : 'COUNTDOWN';
    this.playSoundEffect(effectKey);
  }

  /**
   * Play admin login sound
   */
  playAdminSound() {
    this.playSoundEffect('ADMIN_LOGIN');
  }

  /**
   * Play mode toggle sound
   */
  playModeToggleSound() {
    this.playSoundEffect('MODE_TOGGLE');
  }

  /**
   * Toggle mute state
   * @returns {boolean} Current mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    console.log('AudioManager: Mute -', this.isMuted);
    return this.isMuted;
  }

  /**
   * Set master volume
   * @param {number} volume - Volume 0.0 to 1.0
   */
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    console.log('AudioManager: Volume set to', this.masterVolume);
  }

  /**
   * Get master volume
   * @returns {number} Current volume
   */
  getVolume() {
    return this.masterVolume;
  }

  /**
   * Get audio context state
   * @returns {string} Context state
   */
  getState() {
    return this.audioContext ? this.audioContext.state : 'not-initialized';
  }

  /**
   * Get audio context info
   * @returns {object} Audio context information
   */
  getInfo() {
    return {
      initialized: this.isInitialized,
      state: this.getState(),
      muted: this.isMuted,
      volume: this.masterVolume,
      sampleRate: this.audioContext ? this.audioContext.sampleRate : null
    };
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioManager;
}
