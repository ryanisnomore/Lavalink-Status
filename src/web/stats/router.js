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

  return {
    node: node.identifier,
    online: node.connected,
    status: node.connected ? 'Connected' : 'Disconnected',
    players: stats.players || 0,
    activePlayers: stats.playingPlayers || 0,
    uptime: stats.uptime || 0,
    cores: cpu.cores || 0,
    memoryUsed: memory.used || 0,
    memoryReservable: memory.reservable || 0,
    systemLoad: (cpu.systemLoad || 0).toFixed(2),
    lavalinkLoad: (cpu.lavalinkLoad || 0).toFixed(2)
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
