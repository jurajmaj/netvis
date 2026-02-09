import React from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";

const App = () => {
  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <Toolbar />
        <Canvas />
      </ReactFlowProvider>
    </div>
  );
};

export default App;
