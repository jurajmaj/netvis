import {
  postFlowDfs,
  postFlowBfs,
  postFlowDijkstra,
  postFlowBellmanFord,
  postFlowAnt,
  postFlowAStar,
  postFlowFloydWarshall,
  postFlowYen
} from "../../../_api/postFlow";

/**
 * An array of objects representing different algorithms.
 * Each object has an `id`, `data`, and `postFlow` properties.
 * The `id` is a string that uniquely identifies the algorithm.
 * The `data` is an object that contains a `label` property, which is a string that describes the algorithm.
 * The `postFlow` is a function that posts a flow for the algorithm.
 * Structure 'data: label' is because of SelectBox component that is used also for nodes.
 *
 * @type {Array<{id: string, data: {label: string}, postFlow: function}>}
 *
 * @example
 * // returns [{id: 'dfs', data: {label: 'DFS'}, postFlow: postFlowDfs}, ...]
 */

export const ALGORITHMS = [
  {id: 'dfs', data: {label: 'DFS'}, postFlow: postFlowDfs},
  {id: 'bfs', data: {label: 'BFS'}, postFlow: postFlowBfs},
  {id: 'dijkstra', data: {label: 'Dijkstra'}, postFlow: postFlowDijkstra},
  {id: 'bellmanFord', data: {label: 'Bellman Ford'}, postFlow: postFlowBellmanFord},
  {id: 'ant', data: {label: 'ANT'}, postFlow: postFlowAnt},
  {id: 'aStar', data: {label: 'A* Search'}, postFlow: postFlowAStar},
  {id: 'floydWarshall', data: {label: 'Floyd Warshall'}, postFlow: postFlowFloydWarshall},
  {id: 'yen', data: {label: 'Yen'}, postFlow: postFlowYen}
]

export const NUMPATHS = [1,2,3,4,5,6,7,8,9].map((num) => ({
  id: num.toString(),
  data: { label: num.toString() }
}));