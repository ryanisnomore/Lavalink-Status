module.exports = {
  token: process.env.token || "",
  channelId: process.env.channelId || "1359044851135549573",

  webMonitor: true,
  expressPort: process.env.expressPort || 6375,

  nodes: [
    {
      host: "us2.sanode.xyz",
      password: "discord.gg/W2GheK3F9m",
      port: 5022,
      identifier: "Main ARINO",
      secure: false,
      reconnectTimeout: 300000,
      reconnectTries: 100,
      version: 3
    },
    {
      host: "ryan-lavalink-v4.elixirno.de",
      password: "discord.gg/W2GheK3F9m",
      port: 25682,
      identifier: "RY4N V4",
      secure: false,
      reconnectTimeout: 300000,
      reconnectTries: 100,
      version: 4
    },
    {
      host: "79.110.236.32",
      password: "discord.gg/W2GheK3F9m",
      port: 9033,
      identifier: "Free V4",
      secure: false,
      reconnectTimeout: 300000,
      reconnectTries: 100,
      version: 4
    }
  ]
};
