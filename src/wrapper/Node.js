const WebSocket = require("ws");
const colors = require("colors");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

class Node {
  constructor(options) {
    this.host = options.host;
    this.port = options.port;
    this.password = options.password;
    this.identifier = options.identifier;
    this.secure = options.secure;
    this.reconnectTimeout = options.reconnectTimeout;
    this.reconnectTries = options.reconnectTries;
    this.version = options.version || 4;
    this.reconnectAttempted = 0;
    this.connected = false;
    this.stats = {};
    this.info = {};
    this.ws = null;
  }

  storeNode(map) {
    map.set(this.identifier, this);
  }

  connect() {
    const headers = {
      Authorization: this.password,
      "User-Id": Math.floor(Math.random() * 10000),
      "Client-Name": "RY4N-LAVALINK"
    };

    const wsVersion = this.version === 3 ? "v3" : "v4";
    this.ws = new WebSocket(
      `ws${this.secure ? "s" : ""}://${this.host}:${this.port}/${wsVersion}/websocket`,
      { headers }
    );

    this.ws.on("open", () => {
      console.log(colors.green(`[NODE] ${this.identifier} | Lavalink node is connected.`));
      this.reconnectAttempted = 0;
      this.connected = true;
      this.fetchInfo();
    });

    this.ws.on("message", (message) => {
      if (Array.isArray(message)) message = Buffer.concat(message);
      else if (message instanceof ArrayBuffer) message = Buffer.from(message);

      const payload = JSON.parse(message.toString());
      if (!payload.op) return;

      if (payload.op === "stats") {
        this.stats = this.normalizeStats(payload);
      }
    });

    this.ws.on("error", (error) => {
      console.log(colors.red(`[NODE] ${this.identifier} | WebSocket error: ${error}`));
      this.connected = false;
      this.stats = this.getDefaultStats();
    });

    this.ws.on("close", (code, reason) => {
      console.log(colors.red(`[NODE] ${this.identifier} | Disconnected (code ${code}).`));
      this.connected = false;
      this.scheduleReconnect();
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
      this.stats = {};
      this.info = {};
      console.log(colors.red(`[NODE] ${this.identifier} | Disconnected.`));
    }
  }

  scheduleReconnect() {
    setTimeout(() => {
      if (this.reconnectAttempted < this.reconnectTries || this.reconnectTries === 0) {
        console.log(colors.yellow(`[NODE] ${this.identifier} | Reconnecting.`));
        this.connect();
        this.reconnectAttempted++;
      } else {
        console.log(colors.red(`[NODE] ${this.identifier} | Reconnect limit reached.`));
        this.disconnect();
      }
    }, this.reconnectTimeout);
  }

  normalizeStats(payload) {
    if (this.version === 3) {
      return {
        players: payload.players,
        playingPlayers: payload.playingPlayers,
        uptime: payload.uptime,
        memory: payload.memory || {
          free: payload.memory_free,
          used: payload.memory_used,
          allocated: payload.memory_allocated,
          reservable: payload.memory_reservable
        },
        cpu: payload.cpu || {
          cores: payload.cpu_cores,
          systemLoad: payload.cpu_systemLoad,
          lavalinkLoad: payload.cpu_lavalinkLoad
        },
        frameStats: payload.frameStats || {}
      };
    } else {
      return payload;
    }
  }

  getDefaultStats() {
    return {
      players: 0,
      playingPlayers: 0,
      uptime: 0,
      memory: { free: 0, used: 0, allocated: 0, reservable: 0 },
      cpu: { cores: 0, systemLoad: 0, lavalinkLoad: 0 },
      frameStats: { sent: 0, nulled: 0, deficit: 0 }
    };
  }

  async fetchInfo() {
    const baseUrl = `http${this.secure ? 's' : ''}://${this.host}:${this.port}`;
    const endpoints = this.version === 3
      ? ['/v3/info', '/info']
      : ['/v4/info', '/info', '/version'];
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`${baseUrl}${endpoint}`, {
          headers: { Authorization: this.password },
          timeout: 2000
        });
        if (res.ok) {
          this.info = await res.json();
          return;
        }
      } catch {
        continue;
      }
    }
    this.info = {};
  }

  getConnectionDetails() {
    return {
      host: this.host,
      port: this.port,
      password: this.password,
      secure: !!this.secure
    };
  }
}

module.exports = Node;