const express = require("express");
const router = express.Router();
const config = require("../../config");

let lavalinkInfo = [];

router.use(express.json());

router.get("/info", async (req, res) => {
  try {
    lavalinkInfo = await Promise.all(
      config.nodes.map(async (node) => {
        try {
          const http = node.secure ? "https" : "http";
          const apiVersion = node.version === 3 ? "v3" : "v4";
          const response = await fetch(
            `${http}://${node.host}:${node.port}/${apiVersion}/info`,
            {
              headers: { Authorization: node.password }
            }
          );
          if (!response.ok) throw new Error(`Error fetching info from ${node.host}:${node.port}`);
          let data = await response.json();
          data = normalizeInfo(data, node.version);
          return { node: node.identifier, version: node.version, ...data };
        } catch {
          return {
            node: node.identifier,
            message: "Failed to fetch info"
          };
        }
      })
    );
    res.json(lavalinkInfo);
  } catch (error) {
    console.error("Error fetching node info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

function normalizeInfo(data, version) {
  if (version === 3) {
    return {
      version: data.version || {},
      plugins: data.plugins || [],
      lavaplayer: data.lavaplayer || "",
      sourceManagers: data.sourceManagers || [],
    };
  }
  return data;
}

module.exports = router;
