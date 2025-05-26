# Lavalink-Status

Lavalink-Status is a comprehensive monitoring and dashboard tool for Lavalink music nodes, providing real-time status, metrics, and visualizations for your Lavalink infrastructure. It is designed to help Discord bot developers and server administrators monitor the health and performance of multiple Lavalink nodes with ease.

## Features

- **Real-time Lavalink Node Monitoring:** Automatically connects to multiple Lavalink nodes and gathers stats such as uptime, CPU and memory usage, player counts, and connection status.
- **Web Dashboard:** Modern web interface built with Tailwind CSS, featuring live updating stats, system load, memory, player information, and error handling for disconnected nodes.
- **Discord Integration:** Posts node status embeds to a Discord channel, updating periodically with node health and stats.
- **Status & Uptime Badges:** REST API endpoints to generate SVG badges for node status, uptime, and player activity, suitable for embedding in dashboards or README files.
- **Extensible & Flexible:** Easily configurable to support any number of nodes; supports both v3 and v4 Lavalink servers.
- **Dark AMOLED Theme:** The web dashboard uses an attractive dark color scheme for optimal readability and aesthetics.

## How It Works

- **Node Wrapper:** The backend manages Lavalink nodes through a wrapper, establishing and maintaining WebSocket connections, and collecting metrics.
- **Web API:** Exposes RESTful APIs for status, uptime, and player badges. These endpoints can be used for external monitoring or integration.
- **Front-end Dashboard:** Uses API data to display an interactive, auto-refreshing dashboard with detailed system and version info.
- **Discord Bot:** On startup, posts a rich embed to a configured Discord channel and keeps it updated with node stats, presence, and alerts when issues occur.

## Example Use Cases

- **Bot owners** who want to monitor the health of their Lavalink infrastructure.
- **Server admins** who need a public or private dashboard for live node status.
- **Developers** who want to embed status badges in GitHub README files or web pages.

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/ryanisnomore/Lavalink-Status.git
   cd Lavalink-Status
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure Lavalink nodes:**
   - Edit the `src/config.js` file to add your Lavalink nodes and Discord bot settings.

4. **Run the status server:**
   ```sh
   npm start
   ```

5. **Access the dashboard:**
   - Open your browser to `http://localhost:PORT` (default port can be set in the config).

## API Endpoints

- `GET /stats` — Returns JSON array with stats for all configured nodes.
- `GET /api/v1/badge/status/:nodeIndex` — SVG badge for node online/offline status.
- `GET /api/v1/badge/uptime/:nodeIndex` — SVG badge for node uptime.
- `GET /api/v1/badge/players/:nodeIndex` — SVG badge for player counts.

## Dashboard Preview

![Dashboard Screenshot](https://raw.githubusercontent.com/ryanisnomore/Lavalink-Status/main/docs/dashboard-preview.png)

## Technologies Used

- Node.js
- Express.js
- Discord.js
- Tailwind CSS
- FontAwesome
- WebSockets

## Credits

- Inspired by the [Lavalink](https://github.com/freyacodes/Lavalink) project.
- Developed by [ryanisnomore](https://github.com/ryanisnomore) ([@ghryanx7](https://github.com/ghryanx7)).

## Contributing

Pull requests and suggestions are welcome! Please open an issue or PR for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
