# Development

This page is for contributors/maintainers working on Netvis locally. It covers local setup, how the app talks to the external algorithm service, and the request/response formats used by the UI.

For a user-facing overview of the app, see [README.md](README.md).

## Setup

Prereqs: Node.js + npm.

```bash
npm install
npm start
```

Dev server: http://localhost:3000

Useful scripts (from [package.json](package.json)):
- `npm run build`
- `npm test`
- `npm run cypress:open`

## API base URL

Netvis posts the topology to an external algorithm service which is editable in the UI via the Control Bar “Base URL” field.

Endpoints are added to the base URL depending on the selected algorithm, for example if the base URL is `http://localhost:5000` and the user selects Dijkstra, the full POST URL becomes `http://localhost:5000/dijkstra/` (see [src/_api/postFlow.js](src/_api/postFlow.js)):

| Algorithm (UI) | POST endpoint |
|---|---|
| DFS | `/dfs/` |
| BFS | `/bfs/` |
| Dijkstra | `/dijkstra/` |
| Bellman Ford | `/bellmanFord/` |
| ANT | `/ant/` |
| A* Search | `/astar/` |
| Floyd Warshall | `/floydWarshall/` |
| Yen | `/yen/` |

## Payload (what Netvis POSTs)

The request body is built in [src/components/ControlBar/Controller/postFlowJSON.js](src/components/ControlBar/Controller/postFlowJSON.js).

Shape:
- `routes`: currently a single entry `{ id: 1, source, destination, numPaths }`
	- `source`/`destination` are *node labels* selected in the controller UI
- `nodes`: simplified nodes
- `edges`: simplified edges

### Nodes

Each node becomes:
- `id`
- `label`
- `type`
- `address`

For wireless router, three extra fields are sent:
- `ssid`
- `wanIpAddress`
- `wanSubnetMask`

### Edges

Each edge becomes:
- `id`, `source`, `target`
- `bandwidth`, `availableBandwidth`, `enabled`
- `sourceInterface`, `targetInterface`, `sourceAddress`, `targetAddress`

And for wireless links, one extra field:
- `wifiBand` (2.4GHz or 5GHz which is sent as a string "2.4" or "5" and defaults to "5" when not set)

## Examples

### Example request

```json
{
    "routes": [
        { "id": 1, "source": "pc1", "destination": "pc2", "numPaths": 1 }
    ],
    "nodes": [
        {
            "id": "6",
            "label": "WR1",
            "type": "wirelessRouterNode",
            "address": "192.168.1.1",
            "ssid": "MyWifi",
            "wanIpAddress": "203.0.113.10",
            "wanSubnetMask": "255.255.255.0"
        },
        { "id": "7", "label": "R1", "type": "routerNode", "address": "10.0.0.1" },
        { "id": "8", "label": "pc1", "type": "pcNode", "address": "192.168.1.10" },
        { "id": "9", "label": "pc2", "type": "pcNode", "address": "10.0.0.10" }
    ],
    "edges": [
        {
            "id": "7",
            "source": "8",
            "target": "6",
            "bandwidth": "100",
            "availableBandwidth": "100",
            "enabled": true,
            "sourceInterface": "Fa0",
            "targetInterface": "WiFi",
            "sourceAddress": "192.168.1.10",
            "targetAddress": "192.168.1.1",
            "wifiBand": "2.4"
        },
        {
            "id": "8",
            "source": "9",
            "target": "7",
            "bandwidth": "100",
            "availableBandwidth": "100",
            "enabled": true,
            "sourceInterface": "Fa0",
            "targetInterface": "Fa0/0",
            "sourceAddress": "10.0.0.10",
            "targetAddress": "10.0.0.1"
        },
        {
            "id": "9",
            "source": "6",
            "target": "7",
            "bandwidth": "100",
            "availableBandwidth": "100",
            "enabled": true,
            "sourceInterface": "Fa0/1",
            "targetInterface": "Fa0/1",
            "sourceAddress": "172.16.0.2",
            "targetAddress": "172.16.0.1"
        }
    ]
}
```

Debugging: when a request is sent, the outgoing JSON payload is logged in the browser console.

### Example success response

The UI checks `returnCode`. On success it reads `paths` and `stats`.

```json
{
	"returnCode": 0,
	"paths": [
		{ "result": ["e1", "e7", "e9"] }
	],
	"stats": {
		"timeUs": 1234,
		"visitedStates": 42,
		"maxMemoryAllocated": 128
	}
}
```

### Example error response

```json
{
	"returnCode": 1,
	"msg": "Human-readable error message"
}
```

## Feedback / Issues

If you spot a bug or have an idea for an improvement, feel free to open an issue. Helpful reports include:
- steps to reproduce (or a clear use-case description)
- expected vs actual behavior
- screenshots and/or the browser console output

Debug tip: whenever an algorithm request is sent, the exact JSON payload being POSTed is printed in the browser DevTools console (and the response is logged too) for easy troubleshooting.
