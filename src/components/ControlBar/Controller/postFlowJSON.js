import { ALGORITHMS } from "./algorithms";

function createDataFlowObj(source, destination, numPaths, flow) {
  return {
    routes: [
      {
        id: 1,
        source: source,
        destination: destination,
        numPaths: numPaths,
      }
    ],

    nodes: flow.nodes.map((node) => {
      const baseNode = {
        id: node.id,
        label: node.data.label,
        type: node.type,
        address: node.data.address,
      };

      if (node.type === "wirelessRouterNode") {
        return {
          ...baseNode,
          ssid: node.data.ssid ?? "",
          wanIpAddress: node.data.wanIp ?? "",
          wanSubnetMask: node.data.wanSubnetMask ?? "",
        };
      }

      return baseNode;
    }),

    edges: flow.edges.map((edge) => {
      const sourceNode = flow.nodes.find((node) => node.id === edge.source);
      const targetNode = flow.nodes.find((node) => node.id === edge.target);

      const isWifiLink =
        (sourceNode.type === "wirelessRouterNode" && targetNode.type === "pcNode") ||
        (sourceNode.type === "pcNode" && targetNode.type === "wirelessRouterNode");

      const isSourceRouterOrServer = ["pcNode", "serverNode"].includes(sourceNode.type);
      const isTargetRouterOrServer = ["pcNode", "serverNode"].includes(targetNode.type);

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        bandwidth: edge.data.bandwidth,
        availableBandwidth: edge.data.availableBandwidth,
        enabled: edge.data.enabled,
        sourceInterface: isSourceRouterOrServer ? 'Fa0' : edge.data.sourceInterface,
        targetInterface: isTargetRouterOrServer ? 'Fa0' : edge.data.targetInterface,
        sourceAddress: isSourceRouterOrServer ? sourceNode.data.address : edge.data.sourceAddress,
        targetAddress: isTargetRouterOrServer ? targetNode.data.address : edge.data.targetAddress,
        ...(isWifiLink ? { wifiBand: edge.data.wifiBand ?? "5" } : {})
      };
    }),
  };
}

async function postFlowJSON(reactFlowInstance, source, destination, algorithm, setPaths, setIsLoading, setStats, numPaths, setErrorMessage) {
  try {
    const flow = reactFlowInstance.toObject();
    const dataFlow = createDataFlowObj(source, destination, numPaths, flow);
    console.log(dataFlow);

    const algorithmObj = ALGORITHMS.find(algo => algo.data.label === algorithm);
    const postFlow = algorithmObj ? algorithmObj.postFlow : null;

    if (!postFlow) {
      throw new Error(`No postFlow function found for algorithm "${algorithm}"`);
    }

    if(source === destination) {
      const error = {
        returnCode: 1,
        msg: 'Source == Destination',
      }
      setErrorMessage(error);
      setIsLoading(false);
      // throw new Error(error.msg);
      return;
    }

    const response = await postFlow(dataFlow);

    console.log(response);

    if(response.data.returnCode === 1) {
      setErrorMessage(response.data)
      setPaths([]);
      setStats([]);
      setIsLoading(false);
      // throw new Error(response.data.msg)
    } else {
      setErrorMessage(null);
      setPaths(response.data.paths);
      setStats(response.data.stats);
      setIsLoading(false);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default postFlowJSON;
