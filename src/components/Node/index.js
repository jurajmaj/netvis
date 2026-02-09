import React, { useCallback, useState, useEffect } from "react";
import { Handle, NodeToolbar, Position, useReactFlow } from "reactflow";
import { FormHelperText } from "@mui/material";

import { ReactComponent as RouterIcon } from "../../assets/Router.svg";
import { ReactComponent as ServerIcon } from "../../assets/Server.svg";
import { ReactComponent as PCIcon } from "../../assets/PC.svg";
import { ReactComponent as WirelessRouterIcon } from "../../assets/WirelessRouter.svg";
import styles from "./Node.module.css";
import NodeMenu from "./NodeMenu";
import useThemeStore from "../../stores/useThemeStore";

function getDeviceIcon(deviceType) {
  let DeviceIcon;
  switch (deviceType) {
    case "routerNode":
      DeviceIcon = RouterIcon;
      break;
    case "pcNode":
      DeviceIcon = PCIcon;
      break;
    case "serverNode":
      DeviceIcon = ServerIcon;
      break;
    case "wirelessRouterNode":
      DeviceIcon = WirelessRouterIcon;
      break;
    default:
      DeviceIcon = RouterIcon;
  }
  return DeviceIcon;
}

function Node({ data, isConnectable }) {
  const { deviceType } = data;
  const { getNodes } = useReactFlow();
  const [label, setLabel] = useState(data.label);
  const [address, setAddress] = useState(data.address);
  const [mask, setMask] = useState(data.mask);
  const [ssid, setSsid] = useState(data.ssid ?? "");
  const [wanIp, setWanIp] = useState(data.wanIp ?? "");
  const [wanSubnetMask, setWanSubnetMask] = useState(data.wanSubnetMask ?? "");
  const [labelError, setLabelError] = useState('');
  const theme = useThemeStore(state => state.theme);

  const handleLabelChange = useCallback((event) => {
    setLabel(event.target.value);

    const newLabel = event.target.value;
    const nodes = getNodes();
    const labels = nodes.map(node => node.data.label);

    if (labels.includes(newLabel)) {
      setLabelError('Please pick unique label!');
    } else {
      setLabelError('');
    }
  }, [getNodes]);

  const handleAddressChange = useCallback((event) => {
    setAddress(event.target.value);
  }, []);

  const handleMaskChange = useCallback((event) => {
    setMask(event.target.value);
  }, []);

  const handleSsidChange = useCallback((event) => {
    setSsid(event.target.value);
  }, []);

  const handleWanIpChange = useCallback((event) => {
    setWanIp(event.target.value);
  }, []);

  const handleWanSubnetMaskChange = useCallback((event) => {
    setWanSubnetMask(event.target.value);
  }, []);

  useEffect(() => {
    data.label = label;
    data.address = address;
    data.mask = mask;
    data.ssid = ssid;
    data.wanIp = wanIp;
    data.wanSubnetMask = wanSubnetMask;
  }, [label, address, mask, ssid, wanIp, wanSubnetMask, data]);

  const DeviceIcon = getDeviceIcon(deviceType);

  const isDark = theme === "dark";

  function getHandleClassName(deviceType, isDark) {
    switch (deviceType) {
      case "routerNode":
        return styles.routerHandle;
      case "wirelessRouterNode":
        return styles.wirelessRouterHandle;
      case "pcNode":
        return styles.pcHandle;
      case "serverNode":
      default:
        return styles.serverHandle;
    }
  }
  
  function getIconClassName(deviceType, isDark) {
    switch (deviceType) {
      case "pcNode":
        return isDark ? styles.pcIconDark : styles.pcIconLight;
      default:
        return styles.deviceIcon;
    }
  }

  const handleClassName = getHandleClassName(deviceType, isDark);
  const iconClassName = getIconClassName(deviceType, isDark);

  return (
    <>
      <Handle type="source" isConnectable={isConnectable} position={Position.Top} className={handleClassName} />
      <DeviceIcon className={iconClassName} />
      <label style={{color: theme === 'dark' ? 'white' : 'black'}} className={styles.label}>{label}</label>

      <NodeToolbar position="right">
        {labelError && <FormHelperText error style={{ marginLeft: '15px' }}>{labelError}</FormHelperText>}
        <NodeMenu
          label={label}
          address={address}
          mask={mask}
          ssid={ssid}
          wanIp={wanIp}
          wanSubnetMask={wanSubnetMask}
          handleLabelChange={handleLabelChange}
          handleAddressChange={handleAddressChange}
          handleMaskChange={handleMaskChange}
          handleSsidChange={handleSsidChange}
          handleWanIpChange={handleWanIpChange}
          deviceType={deviceType}
          handleWanSubnetMaskChange={handleWanSubnetMaskChange}
        />
      </NodeToolbar>
    </>
  );
}

export default Node;