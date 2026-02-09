function importFlow(file, setNodes, setEdges, setViewport) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const data = JSON.parse(event.target.result);
    const nodes = data.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      data: { label: node.label, address: node.address },
      position: { x: node.xPos, y: node.yPos },
    }));
    const edges = data.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      data: {
        bandwidth: edge.bandwidth,
        sourceInterface: edge.sourceInterface,
        targetInterface: edge.targetInterface,
        sourceAddress: edge.sourceAddress,
        targetAddress: edge.targetAddress,
      },
    }));
    const viewport = data.viewport;

    setNodes(nodes);
    setEdges(edges);
    setViewport(viewport);

  };
  reader.readAsText(file);
}

export default importFlow;