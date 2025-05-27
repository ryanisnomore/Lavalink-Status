const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require(path.join(__dirname, "..", "config"));

const statsRouter = require("./stats/router");
const infoRouter = require("./info/router");

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

app.get("/api/ping", (req, res) => {
  res.json({ pong: true, uptime: process.uptime() });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const port = config.expressPort;
app.listen(port, "0.0.0.0", () => {
  console.log(`[WEB] Web Server Listening on ${port}`);
});

module.exports = app;
