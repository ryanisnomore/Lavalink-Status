const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require(path.join(__dirname, "..", "config"));

const statsRouter = require("./stats/router");
const infoRouter = require("./info/router");

let badgePlayersRouter, badgeStatusRouter, badgeUptimeRouter;
try {
  badgePlayersRouter = require("./api/v1/badge/players/router");
  badgeStatusRouter = require("./api/v1/badge/status/router");
  badgeUptimeRouter = require("./api/v1/badge/uptime/router");
} catch {}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/stats", statsRouter);
app.use("/info", infoRouter);

if (badgePlayersRouter) app.use("/api/v1/badge/players", badgePlayersRouter);
if (badgeStatusRouter) app.use("/api/v1/badge/status", badgeStatusRouter);
if (badgeUptimeRouter) app.use("/api/v1/badge/uptime", badgeUptimeRouter);

app.get("/api/ping", (req, res) => {
  res.json({ pong: true, uptime: process.uptime() });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const port = config.expressPort || 6375;
app.listen(port, "0.0.0.0", () => {
  console.log(`[WEB] Lavalink Status web server listening on port ${port}`);
});

module.exports = app;
