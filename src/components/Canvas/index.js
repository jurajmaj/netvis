import React, { useRef, useCallback, useEffect } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import { ReactFlow, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import { EDGE_ATTRIBUTES } from "../../constants";
import useThemeStore from "../../stores/useThemeStore";
import { applyThemePreference } from "../../utils/themeUtils";

import Node from "../Node";
import Edge from "../Edge";
import ConnectionLine from "../Edge/ConnectionLine";
import ControlBar from "../ControlBar";
import Menu from "../Menu";
import useIdsStore from "../../stores/useIdsStore";

const nodeTypes = {
  routerNode: Node,
  pcNode: Node,
  serverNode: Node,
  wirelessRouterNode: Node,
};

const edgeTypes = {
  interfaceEdge: Edge,
};

const flowKey = 'netvisFlow';

const Canvas = () => {
  const reactFlowWrapper = useRef(null);
  const { getNodeId, getEdgeId, setNodeId, setEdgeId } = useIdsStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    applyThemePreference(theme);
  }, [theme]);

  const onConnect = useCallback(
    (connection) => {
      const { source, target } = connection;
  
      const duplicateEdgesCount = edges.filter(
        (edge) => (edge.source === source && edge.target === target) || (edge.source === target && edge.target === source)
      ).length;

      const isDuplicateEdge = duplicateEdgesCount > 0;

      if(duplicateEdgesCount > 2)
        return;

      const edge = {
        ...connection,
        id: getEdgeId(),
        type: "interfaceEdge",
        style: {stroke: EDGE_ATTRIBUTES.DEFAULT_COLOR},
        animated: false,
        data: {
          isDuplicateEdge, duplicateEdgesCount,
          sourceAddress: "",
          targetAddress: "",
          sourceSubnetMask: "",
          targetSubnetMask: "",
          bandwidth: "",
          enabled: true
        }
      };
  
      setEdges((prevEdges) => [...prevEdges, edge]);
    },
    [edges, getEdgeId, setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - 40,
        y: event.clientY - 40,
      });

      const newNode = {
        id: getNodeId(),
        type, position,
        data: {deviceType: type, label: "", address: "", mask: ""} };
      setNodes((currentNodes) => [...currentNodes, newNode]);
    },
    [getNodeId, reactFlowInstance, setNodes]
  );

  useEffect(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      sessionStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance, nodes, edges]);

  const onInit = useCallback (
    (reactFlowInstance) => {
      setReactFlowInstance(reactFlowInstance);

      const flow = JSON.parse(sessionStorage.getItem(flowKey));

      if (flow) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        if(flow.nodes.length > 0)
          setNodeId(Math.max(...flow.nodes.map(node => node.id)) + 1);
        if(flow.edges.length > 0)
          setEdgeId(Math.max(...flow.edges.map(edge => edge.id)) + 1);

        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.3, duration: 1000, minZoom: 0.1 });
        }, 100);
      }
    },
    [setEdgeId, setEdges, setNodeId, setNodes]
  );

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        connectionLineComponent={ConnectionLine}
        connectionRadius={30}
        connectionMode="loose"
        proOptions={{hideAttribution: true}}
      >
        <Background />
        <Controls />
        <ControlBar
          nodes={nodes}
          reactFlowInstance={reactFlowInstance}
        />
        <Menu
          reactFlowInstance={reactFlowInstance}
        />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
