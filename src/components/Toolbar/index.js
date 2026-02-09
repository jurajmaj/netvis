import React from "react";
import { Panel } from "reactflow";
import Tooltip from "@mui/material/Tooltip";

import { ReactComponent as RouterIcon } from "../../assets/Router.svg";
import { ReactComponent as PCIcon } from "../../assets/PC.svg";
import { ReactComponent as ServerIcon } from "../../assets/Server.svg";
import { ReactComponent as WirelessRouter } from "../../assets/WirelessRouter.svg";
import styles from "./Toolbar.module.css";
import {tooltipStyles} from "./tooltipStyles";

const Toolbar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
    let svgElement;
    switch (nodeType) {
      case "routerNode":
        svgElement = document.getElementById("router");
        break;
      case "serverNode":
        svgElement = document.getElementById("server");
        break;
      case "pcNode":
        svgElement = document.getElementById("pc");
        break;
      case "wirelessRouterNode":
        svgElement = document.getElementById("wirelessRouter");
        break;
      default:
        break;
    }

    if (svgElement) {
      const svgRect = svgElement.getBoundingClientRect();
      const offset = {
        x: Math.abs(event.clientX - svgRect.left),
        y: Math.abs(event.clientY - svgRect.top),
      };

      event.dataTransfer.setDragImage(svgElement, offset.x, offset.y);
    }
  };

  return (
    <Panel className={styles.panel}>
      <div className={styles.routerContainer} onDragStart={(event) => onDragStart(event, "routerNode")} draggable>
        <Tooltip title="Router" arrow slotProps={tooltipStyles}>
          <RouterIcon />
        </Tooltip>
      </div>

      <div className={styles.serverContainer} onDragStart={(event) => onDragStart(event, "serverNode")} draggable>
        <Tooltip title="Server" arrow slotProps={tooltipStyles}>
          <ServerIcon />
        </Tooltip>
      </div>

      <div className={styles.PCContainer} onDragStart={(event) => onDragStart(event, "pcNode")} draggable>
        <Tooltip title="PC" arrow slotProps={tooltipStyles}>
          <PCIcon />
        </Tooltip>
      </div>

      <div className={styles.wirelessRouterContainer} onDragStart={(event) => onDragStart(event, "wirelessRouterNode")} draggable>
        <Tooltip title="Wireless Router" arrow slotProps={tooltipStyles}>
          <WirelessRouter />
        </Tooltip>
      </div>
    </Panel>
  );
};

export default Toolbar;
