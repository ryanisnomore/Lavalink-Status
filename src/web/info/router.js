const express = require('express');
const router = express.Router();
const Node = require('../../wrapper/Node');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const nodesConfig = require('../../config').nodes || [];
if (!global.lavalinkNodesMap) {
  global.lavalinkNodesMap = new Map();
  nodesConfig.forEach(nodeOptions => {
    const node = new Node(nodeOptions);
    node.storeNode(global.lavalinkNodesMap);
    node.connect();
  });
}

async function fetchNodeInfo(node) {
  if (!node.host || !node.port || !node.password) return null;

  const baseUrl = `http${node.secure ? 's' : ''}://${node.host}:${node.port}`;
  const endpoints = node.version === 3 ? ['/v3/info', '/info'] : ['/v4/info', '/info', '/version'];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        headers: { Authorization: node.password },
        timeout: 2000
      });
      if (res.ok) return await res.json();
    } catch {
      continue;
    }
  }
  return null;
}

function formatInfo(node, info) {
  return {
    node: node.identifier,
    version: info?.version || null,
    lavaplayer: info?.lavaplayer || null,
    plugins: Array.isArray(info?.plugins) ? info.plugins : [],
    sourceManagers: Array.isArray(info?.sourceManagers) ? info.sourceManagers : [],
    filters: Array.isArray(info?.filters) ? info.filters : []
  };
}

router.get('/', async (req, res) => {
  try {
    const nodes = Array.from(global.lavalinkNodesMap.values());
    const infos = await Promise.all(nodes.map(async node => {
      const info = await fetchNodeInfo(node);
      return formatInfo(node, info);
    }));
    res.json(infos);
  } catch {
    res.status(500).json({ error: 'Failed to get node info' });
  }
});

module.exports = router;
