<!-- ![](docs/images/NetvisExample.png) -->

# Netvis — Network Topology Visualisation Tool

Netvis is a React Flow–based editor for designing and analysing network topologies in the browser.
It provides a drag-and-drop canvas for building graphs (nodes + links), a per-link configuration menu, and a controller panel for sending the topology to an external algorithm service. Live demo can be found [here](https://netvis2.netlify.app/).

## Features

### Topology editor
- Drag devices from the toolbar onto the canvas.
- Connect devices by drawing links.
- Duplicate links are supported (up to 3 parallel edges between the same nodes).
- Edges have an interactive menu (router + wireless router links):
    - wired links: interface selection (FastEthernet/Gigabit/Serial)
    - WiFi links (wireless router ↔ PC): fixed “WiFi” interface + band (2.4/5 GHz), rendered as a dashed link
    - per-interface IP address + subnet mask
    - bandwidth and link enable/disable

### Controllers + algorithms
- A Control Bar lets you add up to 4 controllers.
- Each controller selects source + destination nodes and an algorithm, then posts the current graph to the algorithm service.
- Supported algorithms (HTTP endpoints): DFS, BFS, Dijkstra, Bellman Ford, ANT, A* Search, Floyd Warshall, Yen.
- Controller results:
    - highlight returned paths on the canvas
    - show basic stats (time, visited states, memory)

### Additional features
- Theme toggle (light/dark) via menu or shortcut.
- Save the current flow via menu or shortcut.
- Upload a saved flow.
- Select multiple nodes/edges by pressing `Shift` and dragging a selection box.
- Upon selecting a node/edge/selection, press `Delete` to remove it.

Keyboard shortcuts:
- Save flow: macOS `⌘S` / other `Ctrl+S`
- Upload flow: macOS `⌘U` / other `Ctrl+U`
- Toggle theme: macOS `⌘K` / other `Ctrl+K`

## Quickstart (development)

```bash
npm install
```
```bash
npm start
```

Then open http://localhost:3000

## Build & run with Docker

### Build locally
```bash
docker build -t netvis .
docker run --rm -p 8080:80 netvis
```

Then open http://localhost:8080

### docker-compose
`docker-compose.yml` runs a prebuilt image and exposes it on port 80:

```bash
docker compose up
```

Then open http://localhost:8080

## Documentation

- Developer docs (setup, API base URL, payload, examples): see [DEVELOPMENT.md](DEVELOPMENT.md)

## License
This project is licensed under the Apache License 2.0 – see the [LICENSE](LICENSE) file for details.
