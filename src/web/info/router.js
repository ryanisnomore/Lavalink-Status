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

function formatInfo(node) {
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

  return {
    node: node.identifier,
    host: node.host,
    port: node.port,
    password: node.password,
    secure: !!node.secure,
    region: info.region || null,
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
    }
  };
}

router.get('/', async (req, res) => {
  try {
    const nodes = Array.from(global.lavalinkNodesMap.values());
    const infos = nodes.map(formatInfo);
    res.json(infos);
  } catch {
    res.status(500).json({ error: 'Failed to get node info' });
  }
});

module.exports = router;
