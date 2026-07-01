/**
 * NetworkManager Class
 * Handles WebRTC multiplayer functionality using PeerJS
 * Manages connections, data synchronization, and combat interactions
 */

class NetworkManager {
  constructor() {
    this.peer = null;
    this.connection = null;
    this.isHost = false;
    this.isReady = false;
    this.peerId = null;
    this.gameCode = null;
    
    this.onDataReceived = null;
    this.onConnectionOpen = null;
    this.onConnectionClosed = null;
    this.onError = null;
  }

  /**
   * Generate a game code
   * @returns {string} Game code in format VIPER-XXXX
   */
  generateGameCode() {
    const config = GAME_CONFIG.PEER;
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return config.CODE_FORMAT + randomNumber;
  }

  /**
   * Generate PeerJS ID from game code
   * @param {string} gameCode - Game code
   * @returns {string} PeerJS ID
   */
  generatePeerId(gameCode) {
    const config = GAME_CONFIG.PEER;
    return config.ID_PREFIX + gameCode.replace('-', '').toLowerCase();
  }

  /**
   * Host a multiplayer game
   * @param {function} onReady - Callback when host is ready
   * @param {function} onPlayerJoined - Callback when player joins
   * @returns {object} Game code info
   */
  hostGame(onReady, onPlayerJoined) {
    try {
      this.gameCode = this.generateGameCode();
      this.peerId = this.generatePeerId(this.gameCode);
      this.isHost = true;

      const config = GAME_CONFIG.PEER;
      this.peer = new Peer(this.peerId, { debug: config.DEBUG_LEVEL });

      this.peer.on('open', () => {
        this.isReady = true;
        if (onReady) onReady(this.gameCode);
      });

      this.peer.on('connection', (conn) => {
        this.connection = conn;
        this.setupConnectionHandlers();
        if (onPlayerJoined) onPlayerJoined();
      });

      this.peer.on('error', (error) => {
        this.handleError(error);
      });

      return {
        code: this.gameCode,
        peerId: this.peerId,
        isHost: true
      };

    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   * Join a multiplayer game
   * @param {string} gameCode - Game code to join
   * @param {function} onConnected - Callback when connected
   * @returns {boolean} Success status
   */
  joinGame(gameCode, onConnected) {
    try {
      const normalizedCode = gameCode.toUpperCase();
      const fullCode = normalizedCode.includes('-') ? normalizedCode : 'VIPER-' + normalizedCode;
      const peerId = this.generatePeerId(fullCode);

      this.gameCode = fullCode;
      this.isHost = false;

      const config = GAME_CONFIG.PEER;
      this.peer = new Peer(undefined, { debug: config.DEBUG_LEVEL });

      this.peer.on('open', () => {
        this.connection = this.peer.connect(peerId, { reliable: true });
        this.setupConnectionHandlers();

        this.connection.on('open', () => {
          this.isReady = true;
          if (onConnected) onConnected();
        });

        this.connection.on('error', (error) => {
          this.handleError(error);
        });
      });

      this.peer.on('error', (error) => {
        this.handleError(error);
      });

      return true;

    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   * Setup connection event handlers
   * @private
   */
  setupConnectionHandlers() {
    if (!this.connection) return;

    this.connection.on('data', (data) => {
      if (this.onDataReceived) {
        this.onDataReceived(data);
      }
    });

    this.connection.on('open', () => {
      if (this.onConnectionOpen) {
        this.onConnectionOpen();
      }
    });

    this.connection.on('close', () => {
      this.isReady = false;
      if (this.onConnectionClosed) {
        this.onConnectionClosed();
      }
    });

    this.connection.on('error', (error) => {
      this.handleError(error);
    });
  }

  /**
   * Send data to connected player
   * @param {object} data - Data to send
   * @returns {boolean} Send success status
   */
  sendData(data) {
    if (!this.connection || !this.connection.open) {
      return false;
    }

    try {
      this.connection.send(data);
      return true;
    } catch (error) {
      console.error('NetworkManager: Send failed -', error);
      return false;
    }
  }

  /**
   * Send player identity to opponent
   * @param {string} playerName - Player name
   * @param {number} colorIdx - Color index
   */
  sendIdentity(playerName, colorIdx) {
    this.sendData({
      type: 'hello',
      name: playerName || 'JOUEUR',
      colorIdx: colorIdx || 0
    });
  }

  /**
   * Send game state update
   * @param {object} gameState - Game state data
   */
  sendStateUpdate(gameState) {
    this.sendData({
      type: 'state',
      snake: gameState.snake,
      dir: gameState.direction,
      score: gameState.score,
      hp: gameState.hp,
      atk: gameState.atk,
      def: gameState.def,
      kills: gameState.kills
    });
  }

  /**
   * Send food position (host only)
   * @param {object} food - Food position
   */
  sendFoodUpdate(food) {
    this.sendData({
      type: 'food',
      x: food.x,
      y: food.y
    });
  }

  /**
   * Send venom damage notification
   * @param {number} damage - Damage amount
   * @param {array} venomTiles - Venom tile positions
   */
  sendVenomHit(damage, venomTiles) {
    this.sendData({
      type: 'venom',
      dmg: damage,
      tiles: venomTiles
    });
  }

  /**
   * Notify opponent of player death
   */
  sendDeathNotification() {
    this.sendData({
      type: 'dead'
    });
  }

  /**
   * Send rematch request
   */
  sendRematch() {
    this.sendData({
      type: 'rematch'
    });
  }

  /**
   * Disconnect from opponent
   */
  disconnect() {
    try {
      if (this.connection) {
        this.connection.close();
      }
      if (this.peer) {
        this.peer.destroy();
      }
      
      this.connection = null;
      this.peer = null;
      this.isReady = false;
      this.gameCode = null;
      
      console.log('NetworkManager: Disconnected');
    } catch (error) {
      console.error('NetworkManager: Disconnect error -', error);
    }
  }

  /**
   * Check connection status
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.connection && this.connection.open && this.isReady;
  }

  /**
   * Handle errors
   * @private
   */
  handleError(error) {
    console.error('NetworkManager: Error -', error);
    if (this.onError) {
      this.onError(error);
    }
  }

  /**
   * Get network info
   * @returns {object} Network information
   */
  getInfo() {
    return {
      isConnected: this.isConnected(),
      isHost: this.isHost,
      gameCode: this.gameCode,
      peerId: this.peerId,
      connectionOpen: this.connection ? this.connection.open : false,
      peerOpen: this.peer ? this.peer.open : false
    };
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NetworkManager;
}
