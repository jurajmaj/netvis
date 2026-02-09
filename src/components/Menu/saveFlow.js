function saveFlow(props) {
  const flow = props.reactFlowInstance.toObject();

  const data = JSON.stringify(flow, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "flow.json";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default saveFlow;
