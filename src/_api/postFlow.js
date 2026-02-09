import getApi from "./index.js";

// export const postFlowMock = (flow) => getApi().post("/", flow);

export const postFlowDfs = (flow) => getApi().post("/dfs/", flow);

export const postFlowBfs = (flow) => getApi().post("/bfs/", flow);

export const postFlowDijkstra = (flow) => getApi().post("/dijkstra/", flow);

export const postFlowBellmanFord = (flow) => getApi().post("/bellmanFord/", flow);

export const postFlowAnt = (flow) => getApi().post("/ant/", flow);

export const postFlowAStar = (flow) => getApi().post("/astar/", flow);

export const postFlowFloydWarshall = (flow) => getApi().post("/floydWarshall/", flow);

export const postFlowYen = (flow) => getApi().post("/yen/", flow);
