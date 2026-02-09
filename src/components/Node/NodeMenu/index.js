import React from "react";
import { TextField } from "@mui/material";
import styles from "./NodeMenu.module.css";

function NodeMenu({
  label,
  address,
  mask,
  ssid,
  wanIp,
  wanSubnetMask,
  handleLabelChange,
  handleAddressChange,
  handleMaskChange,
  handleSsidChange,
  handleWanIpChange,
  deviceType,
  handleWanSubnetMaskChange,
}) {
  const isWirelessRouter = deviceType === "wirelessRouterNode";
  const addressLabel = isWirelessRouter ? "WiFi Address" : "Address";

  return (
    <div className={styles.NodeMenu}>
      <TextField
        id="outlined-size-small"
        label="Label"
        size="small"
        type="text"
        value={label}
        onChange={handleLabelChange}
        className={styles.labelBox}
      />

      {isWirelessRouter && (
        <>
          <TextField
            id="outlined-size-small"
            label="SSID"
            size="small"
            type="text"
            value={ssid}
            onChange={handleSsidChange}
            className={styles.ssidBox}
          />
        </>
      )}

      <TextField
        id="outlined-size-small"
        label={addressLabel}
        size="small"
        type="text"
        value={address}
        onChange={handleAddressChange}
        className={styles.addressBox}
      />

      <TextField
        id="outlined-size-small"
        label="Subnet Mask"
        size="small"
        type="text"
        value={mask}
        onChange={handleMaskChange}
        className={styles.maskBox}
      />

      {isWirelessRouter && (
        <>
          <TextField
            id="outlined-size-small"
            label="WAN Address"
            size="small"
            type="text"
            value={wanIp}
            onChange={handleWanIpChange}
            className={styles.wanIpBox}
          />
          <TextField
            id="outlined-size-small"
            label="WAN Subnet Mask"
            size="small"
            type="text"
            value={wanSubnetMask}
            onChange={handleWanSubnetMaskChange}
            className={styles.wanSubnetMaskBox}
          />
        </>
      )}
    </div>
  );
}

export default NodeMenu;
