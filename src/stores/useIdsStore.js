import { create } from 'zustand'

let nodeId = 1;
let edgeId = 1;

const useIdsStore = create(set => ({
  getNodeId: () => `${nodeId++}`,
  getEdgeId: () => `${edgeId++}`,
  setNodeId: (newNodeId) => { nodeId = newNodeId },
  setEdgeId: (newEdgeId) => { edgeId = newEdgeId },
}));

export default useIdsStore;
