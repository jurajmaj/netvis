import React, { useState, useEffect, useCallback } from "react";
import { BaseEdge, EdgeLabelRenderer, getStraightPath, useReactFlow } from "reactflow";
import calculateMenuPosition from "./calculateMenuPosition";
import EdgeMenu from "./EdgeMenu";
import { FAOptions } from "./interfaces";
import {EDGE_ATTRIBUTES} from "../../constants";
import useThemeStore from "../../stores/useThemeStore";

export default function Edge({ data, id, style, source, target, sourceX, sourceY, targetX, targetY }) {
  const offset = data.isDuplicateEdge ? (22 * data.duplicateEdgesCount) : 0;
  const sourceYWithOffset = sourceY !== undefined ? sourceY + offset : 0;
  const targetYWithOffset = targetY !== undefined ? targetY + offset : 0;
  const [edgePath] = getStraightPath({ sourceX, sourceY: sourceYWithOffset, targetX, targetY: targetYWithOffset });
  const reactFlow = useReactFlow();
  const nodes =  reactFlow.getNodes();
  const edges = reactFlow.getEdges();

  const countEdgesForNode = (nodeId) => {
    return edges.filter((edge) => edge.source === nodeId || edge.target === nodeId).length;
  };

  const [sourceInterface, setSourceInterface] = useState(data.sourceInterface || FAOptions[countEdgesForNode(source) - 1]);
  const [targetInterface, setTargetInterface] = useState(data.targetInterface || FAOptions[countEdgesForNode(target) - 1]);
  const [sourceAddress, setSourceAddress] = useState(data.sourceAddress);
  const [targetAddress, setTargetAddress] = useState(data.targetAddress);
  const [sourceSubnetMask, setSourceSubnetMask] = useState(data.sourceSubnetMask);
  const [targetSubnetMask, setTargetSubnetMask] = useState(data.targetSubnetMask);
  const [bandwidth, setBandwidth] = useState(data.bandwidth);
  const [wifiBand, setWifiBand] = useState(data.wifiBand ?? "5");

  const [enabled, setEnabled] = useState(data.enabled);
  const theme = useThemeStore((state) => state.theme);
  const bothRouters = nodes.find(n => n.id === source)?.type === 'routerNode'
                                && nodes.find(n => n.id === target)?.type === 'routerNode';

  const handleInterfaceChange = useCallback((e, position) => {
    if (position === 'source') {
      setSourceInterface(e.target.value);
    } else {
      setTargetInterface(e.target.value);
    }
    reactFlow.setEdges(edges);
  }, [edges, reactFlow]);
  
  const handleAddressChange = useCallback((e, position) => {
    if (position === 'source') {
      setSourceAddress(e.target.value);
    } else {
      setTargetAddress(e.target.value);
    }
    reactFlow.setEdges(edges);
  }, [edges, reactFlow]);

  const handleSubnetMaskChange = useCallback((e, position) => {
    if (position === 'source') {
      setSourceSubnetMask(e.target.value);
    } else {
      setTargetSubnetMask(e.target.value);
    }
    reactFlow.setEdges(edges);
  }, [edges, reactFlow]);
  
  const handleBandwidthChange = useCallback((e) => {
    if (e.target.value < 0)
      return;

    setBandwidth(e.target.value);
    reactFlow.setEdges(edges);
  }, [edges, reactFlow]);

  const handleWifiBandChange = useCallback((e) => {
    setWifiBand(e.target.value);
    reactFlow.setEdges(edges);
  }, [edges, reactFlow]);

  useEffect(() => {
    data.sourceInterface = sourceInterface;
    data.targetInterface = targetInterface;
    data.sourceAddress = sourceAddress;
    data.targetAddress = targetAddress;
    data.bandwidth = bandwidth;
    data.sourceSubnetMask = sourceSubnetMask;
    data.targetSubnetMask = targetSubnetMask;
    data.enabled = enabled;
    data.wifiBand = wifiBand;
  }, [sourceInterface, targetInterface, sourceAddress, targetAddress, bandwidth, sourceSubnetMask, targetSubnetMask, enabled, wifiBand, data]);

  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceYWithOffset + targetYWithOffset) / 2;

  const sourceType = nodes.find(n => n.id === source)?.type;
  const targetType = nodes.find(n => n.id === target)?.type;

  const isWirelessRouterPc =
    (sourceType === "wirelessRouterNode" && targetType === "pcNode") ||
    (sourceType === "pcNode" && targetType === "wirelessRouterNode");

  const renderedStyle = {
    ...(style ?? {}),
    ...(isWirelessRouterPc ? { strokeDasharray: "2 6", strokeLinecap: "round" } : {}),
  };

  useEffect(() => {
    if(reactFlow) {
      const updatedEdges = reactFlow.getEdges().map((edge) => {
        const color = theme === 'light' ? EDGE_ATTRIBUTES.ENABLED_COLOR_LIGHT : EDGE_ATTRIBUTES.ENABLED_COLOR_DARK;
        return edge.data.enabled
          ? {...edge, style: { stroke: color }, animated: false}
          : {...edge, style: { stroke: EDGE_ATTRIBUTES.DEFAULT_COLOR }, animated: false};
      });
      reactFlow.setEdges(updatedEdges);
    }
  }, [enabled, theme, reactFlow]);

  useEffect(() => {
    if (!isWirelessRouterPc) return;
    
    if (sourceType === "wirelessRouterNode" && sourceInterface !== "WiFi") setSourceInterface("WiFi");
    if (targetType === "wirelessRouterNode" && targetInterface !== "WiFi") setTargetInterface("WiFi");
  }, [isWirelessRouterPc, sourceType, targetType, sourceInterface, targetInterface]);

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={renderedStyle}/>
      <EdgeLabelRenderer>
        {["source", "target"].map((position) => {
          const nodeId = position === "source" ? source : target;
          const node = nodes.find((n) => n.id === nodeId);
          const isRoutableNode = node.type === "routerNode" || node.type === "wirelessRouterNode";

          const otherNodeId = position === "source" ? target : source;
          const otherType = nodes.find(n => n.id === otherNodeId)?.type;

          const isWifiLink =
            (node.type === "wirelessRouterNode" && otherType === "pcNode") ||
            (node.type === "pcNode" && otherType === "wirelessRouterNode");

          return isRoutableNode ? (
            <EdgeMenu
              key={position}
              position={position}
              isWifiLink={isWifiLink}
              handleInterfaceChange={handleInterfaceChange}
              handleAddressChange={handleAddressChange}
              handleSubnetMaskChange={handleSubnetMaskChange}
              handleBandwidthChange={handleBandwidthChange}
              handleWifiBandChange={handleWifiBandChange}
              interface={position === 'source' ? sourceInterface : targetInterface}
              address={position === 'source' ? sourceAddress : targetAddress}
              subnetMask={position === 'source' ? sourceSubnetMask : targetSubnetMask}
              bandwidth={bandwidth}
              wifiBand={wifiBand}
              enabled={enabled}
              setEnabled={setEnabled}
              bothRouters={bothRouters}
              data={data}
              id={id}
              transform={calculateMenuPosition(position, sourceX, sourceYWithOffset, targetX, targetYWithOffset, 50)}
            />
          ) : null;
        })}

        {bandwidth && (
          <div style={{
            position: 'absolute' ,
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            color: theme === 'light' ? '#2E2E2E' : '#ffffff',
            fontFamily: 'Monospace',
            fontSize: '12px',
          }}>
            {bandwidth} Mbps
          </div>
        )}

      </EdgeLabelRenderer>
    </>
  );
}
