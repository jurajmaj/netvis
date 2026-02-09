function uploadFlow(props, setNodeId, setEdgeId) {
  const { reactFlowInstance } = props;

  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const flow = JSON.parse(event.target.result);

        Promise.all([
          reactFlowInstance.setNodes(flow.nodes),
          reactFlowInstance.setEdges(flow.edges)
        ]).then(() => {
          if(flow.nodes.length > 0)
            setNodeId(Math.max(...flow.nodes.map(node => node.id)) + 1);
          if(flow.edges.length > 0)
            setEdgeId(Math.max(...flow.edges.map(edge => edge.id)) + 1);

          setTimeout(() => {
            reactFlowInstance.fitView({ padding: 0.3, duration: 1000, minZoom: 0.1 });
          }, 100);

        }).catch((error) => {
          console.error('Error setting nodes and edges:', error);
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsText(file);
  };

  input.click();
}

export default uploadFlow;