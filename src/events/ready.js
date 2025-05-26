const { EmbedBuilder, resolveColor, ActivityType } = require("discord.js");
const config = require("../config");
const moment = require("moment");
require("moment-duration-format");
const colors = require("colors");

const arrayChunker = (array, chunkSize = 5) => {
  let chunks = [];
  for (let i = 0; i < array.length; i += chunkSize)
    chunks.push(array.slice(i, i + chunkSize));
  return chunks;
};

module.exports = async (client) => {
  const prettyBytes = (await import("pretty-bytes")).default;
  const channel = await client.channels.fetch(config.channelId);

  const loadingEmbed = new EmbedBuilder()
    .setColor(resolveColor("#2F3136"))
    .setTitle("Lavalink Status")
    .setDescription("Fetching stats from Lavalink nodes...")
    .setTimestamp();

  await channel.bulkDelete(1);
  const msg = await channel.send({ embeds: [loadingEmbed] });

  function nodeStatsString(node) {
    const stats = node.stats || {};
    const cpu = stats.cpu || {};
    const memory = stats.memory || {};
    const version = node.version || node.stats?.version || "";
    return [
      `Identifier: \`${node.identifier}\` (${node.version ? `v${node.version}` : "?"})`,
      `Status: ${node.connected ? "Connected" : "Disconnected"}`,
      `Players: \`${stats.playingPlayers ?? 0}/${stats.players ?? 0}\``,
      `Uptime: \`${stats.uptime ? moment.duration(stats.uptime).format(" d [days], h [hours], m [minutes]") : "?"}\``,
      `Cores: \`${cpu.cores ?? "?"}\``,
      `Memory: \`${prettyBytes(memory.used ?? 0)}/${prettyBytes(memory.reservable ?? 0)}\``,
      `System Load: \`${(Math.round((cpu.systemLoad ?? 0) * 100) / 100).toFixed(2)}%\``,
      `Lavalink Load: \`${(Math.round((cpu.lavalinkLoad ?? 0) * 100) / 100).toFixed(2)}%\``
    ].join("\n");
  }

  const updateLavalinkStats = async () => {
    let all = [];
    let expressStatus = [];

    client.manager.nodesMap.forEach((node) => {
      const stats = node.stats || {};
      const cpu = stats.cpu || {};
      const memory = stats.memory || {};

      all.push(nodeStatsString(node));

      expressStatus.push({
        node: node.identifier,
        online: !!node.connected,
        status: node.connected ? "Connected" : "Disconnected",
        players: stats.players ?? 0,
        activePlayers: stats.playingPlayers ?? 0,
        uptime: stats.uptime
          ? moment.duration(stats.uptime).format(" d [days], h [hours], m [minutes]")
          : "?",
        cores: cpu.cores ?? 0,
        memoryUsed: prettyBytes(memory.used ?? 0),
        memoryReservable: prettyBytes(memory.reservable ?? 0),
        systemLoad: (Math.round((cpu.systemLoad ?? 0) * 100) / 100).toFixed(2),
        lavalinkLoad: (Math.round((cpu.lavalinkLoad ?? 0) * 100) / 100).toFixed(2),
      });
    });

    if (config.webMonitor === true) {
      fetch(`http://localhost:${config.expressPort}/stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: expressStatus }),
      }).catch((error) => {
        console.log("An error has occurred:", error);
      });
    }

    const chunked = arrayChunker(all, 8);
    const statusembeds = chunked.map((data, i) =>
      new EmbedBuilder()
        .setColor(resolveColor("#2F3136"))
        .setAuthor({
          name: `Lavalink Monitor`,
          iconURL: client.user.displayAvatarURL({ forceStatic: false }),
        })
        .setTitle("Lavalink Status Overview")
        .setDescription(
          `[**Web Status**](http://synthixnodes.ix.tc:6375/)\n\n` +
          data.join("\n\n")
        )
        .setFooter({
          text: `Last Update${chunked.length > 1 ? ` (Page ${i + 1}/${chunked.length})` : ""}`,
        })
        .setTimestamp(Date.now())
    );

    await msg.edit({ embeds: statusembeds });
  };

  await new Promise((resolve) => setTimeout(resolve, 10000));
  await updateLavalinkStats();

  setInterval(updateLavalinkStats, 60000);

  client.user.setPresence({
    status: "dnd",
    activities: [
      {
        name: "Lavalink's",
        type: ActivityType.Watching,
      },
    ],
  });

  console.log(colors.green(`[CLIENT] ${client.user.username} is now Online!`));
};
