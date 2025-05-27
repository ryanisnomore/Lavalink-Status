const express = require('express');
const router = express.Router();
const Node = require('../../wrapper/Node');

const nodesConfig = require('../../config').nodes || [];
if (!global.lavalinkNodesMap) {
  global.lavalinkNodesMap = new Map();
  nodesConfig.forEach(nodeOptions => {
    const node = new Node(nodeOptions);
    node.storeNode(global.lavalinkNodesMap);
    node.connect();
  });
}

function formatStats(node) {
  const stats = node.stats || {};
  const memory = stats.memory || {};
  const cpu = stats.cpu || {};
  const info = node.info || {};

  let jvm = info.jvm || info.java || null;
  let buildTime = info.buildTime || info.build_time || null;
  let git = info.git || {};
  let lavalinkVersion = info.version || (info.build && info.build.version) || null;
  let lavaplayer = info.lavaplayer || null;
  let plugins = Array.isArray(info.plugins) ? info.plugins : [];
  let sourceManagers = Array.isArray(info.sourceManagers) ? info.sourceManagers : [];
  let filters = Array.isArray(info.filters) ? info.filters : [];
  let buildNumber = info.buildNumber || (info.build && info.build.number) || null;

  let commit = git.commit || (info.commit && info.commit.sha) || null;
  let branch = git.branch || (info.commit && info.commit.branch) || null;

  let uptime = stats.uptime || 0;

  return {
    node: node.identifier,
    online: node.connected,
    status: node.connected ? 'Connected' : 'Disconnected',
    players: stats.players || 0,
    activePlayers: stats.playingPlayers || 0,
    uptime,
    cores: cpu.cores || 0,
    memoryUsed: memory.used || 0,
    memoryReservable: memory.reservable || 0,
    memoryAllocated: memory.allocated || 0,
    memoryFree: memory.free || 0,
    systemLoad: cpu.systemLoad != null ? Number(cpu.systemLoad).toFixed(2) : "0.00",
    lavalinkLoad: cpu.lavalinkLoad != null ? Number(cpu.lavalinkLoad).toFixed(2) : "0.00",
    host: node.host,
    port: node.port,
    password: node.password,
    secure: !!node.secure,
    region: info.region || null,
    ping: stats.ping || 0,
    version: lavalinkVersion,
    lavaplayer,
    plugins,
    sourceManagers,
    filters,
    jvm,
    buildTime,
    buildNumber,
    git: {
      commit,
      branch
    },
    frameStats: stats.frameStats || {}
  };
}

router.get('/', (req, res) => {
  try {
    const stats = Array.from(global.lavalinkNodesMap.values()).map(formatStats);
    res.json(stats.length ? stats : []);
  } catch {
    res.status(500).json({ error: 'Failed to get Lavalink stats' });
  }
});

module.exports = router;
