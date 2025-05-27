# Lavalink-Status

Lavalink-Status is a comprehensive monitoring and dashboard tool for Lavalink music nodes, providing real-time status, metrics, and visualizations for your Lavalink infrastructure. It is designed to help bot owners and server admins easily track Lavalink node health, performance, and uptime.

## Features

- **Real-time Lavalink Node Monitoring:** Connects to multiple Lavalink nodes and gathers stats such as uptime, CPU and memory usage, player counts, and connection status.
- **RESTful Web API:** Exposes endpoints for stats and info ([see API docs below](#api-endpoints)).
- **Web Dashboard:** Modern web interface with auto-refreshing stats, system load, memory, player info, and error handling for disconnected nodes.
- **Discord Integration:** Posts node status embeds to a Discord channel, updating periodically with node health and stats.
- **Extensible & Flexible:** Supports any number of nodes; compatible with both Lavalink v3 and v4 servers.
- **Dark AMOLED Theme:** Attractive web dashboard for optimal readability.

## Requirements

- **Node.js v18+** (Node.js 18 or higher is required)
- **npm** (Node Package Manager)

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

- **GET `/stats`**  
  Returns an array of Lavalink node statistics, including system health, player counts, memory and CPU usage, uptime, and connection status.

  **Example response:**
  ```json
  [
    {
      "node": "Node1",
      "online": true,
      "status": "Connected",
      "players": 2,
      "activePlayers": 1,
      "uptime": 1234567,
      "cores": 4,
      "memoryUsed": 104857600,
      "memoryReservable": 209715200,
      "memoryAllocated": 157286400,
      "memoryFree": 52428800,
      "systemLoad": "0.12",
      "lavalinkLoad": "0.05",
      "host": "localhost",
      "port": 2333,
      "password": "youshallnotpass",
      "secure": false,
      "region": null,
      "ping": 15,
      "version": "4.0.0",
      "lavaplayer": null,
      "plugins": [],
      "sourceManagers": [],
      "filters": [],
      "jvm": null,
      "buildTime": null,
      "buildNumber": null,
      "git": {
        "commit": null,
        "branch": null
      },
      "frameStats": {}
    }
  ]
  ```

- **GET `/info`**  
  Returns an array of Lavalink node info objects, including version, plugins, build info, and connection details.

  **Example response:**
  ```json
  [
    {
      "node": "Node1",
      "host": "localhost",
      "port": 2333,
      "password": "youshallnotpass",
      "secure": false,
      "region": null,
      "version": "4.0.0",
      "lavaplayer": null,
      "plugins": [],
      "sourceManagers": [],
      "filters": [],
      "jvm": null,
      "buildTime": null,
      "buildNumber": null,
      "git": {
        "commit": null,
        "branch": null
      }
    }
  ]
  ```

## Dashboard Preview

![Live Demo]([https://lava.funkybot.dpdns.org](https://lava.funkybot.dpdns.org/))

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
