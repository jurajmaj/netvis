import React, { useEffect, useState } from "react";
import { Button, Menu, MenuItem, TextField, FormControl, Select, InputLabel, InputAdornment, FormControlLabel, Switch } from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import styles from "./EdgeMenu.module.css";
import { FAOptions, GIOptions, SeOptions } from "../interfaces";
import useControllersStore from "../../../stores/useControllersStore";
 
const EdgeMenu = (props) => {
  const [availableBandwidth, setAvailableBandwidth] = useState(props.bandwidth);
  const controllers = useControllersStore(state => state.controllers);

  const areValuesSetCorrectly = () => {
    return isIPAddressValid(props.address) && isBandwidthValid(props.bandwidth) && isSubnetMaskValid(props.subnetMask);
  };

  const isIPAddressValid = (ipAddress) => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    return ipRegex.test(ipAddress);
  };

  const isBandwidthValid = (bandwidth) => {
    const bandwidthRegex = /^\d+$/;
    return bandwidthRegex.test(bandwidth);
  };

  const isSubnetMaskValid = (subnetMask) => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    if (!ipRegex.test(subnetMask)) {
      return false;
    }

    const binarySubnetMask = subnetMask.split('.').map(octet => Number(octet).toString(2).padStart(8, '0')).join('');
    const firstZeroIndex = binarySubnetMask.indexOf('0');
    const lastOneIndex = binarySubnetMask.lastIndexOf('1');
    return firstZeroIndex > lastOneIndex;
  };

  useEffect(() => {
    let totalBandwidth = props.bandwidth || 0;

    controllers.forEach(controller => {
      if (controller.paths) {
        controller.paths.forEach(path => {
          if (path === props.id) {
            totalBandwidth -= Number(controller.bandwidth);
          }
        });
      }
    });
    setAvailableBandwidth(props.bandwidth ? totalBandwidth : '');
  }, [controllers, controllers.paths, props.bandwidth, props.id]);


  useEffect(() => {
    props.data.availableBandwidth = availableBandwidth;
  }, [availableBandwidth, props.data]);

  return (
    <div style={{ transform: props.transform }} className={`${styles.menu}`}>
      <PopupState variant="popover" popupId="popup-menu">
        {(popupState) => (
          <React.Fragment>
            <Button
              disableRipple
              className="nodrag nopan"
              variant="contained"
              color={areValuesSetCorrectly() ? "success" : "error"}
              sx={{
                padding: "2px",
                maxHeight: "20px",
                fontFamily: "Monospace",
                fontSize: "10px",
                textTransform: "none",
              }}
              {...bindTrigger(popupState)}
            >
              {props.isWifiLink ? "WiFi" : props.interface}
            </Button>

            <Menu {...bindMenu(popupState)}>
              {props.isWifiLink ? [
                
                  <MenuItem key="wifi-interface" disableRipple sx={{ width: "190px" }}>
                    <TextField label="Interface" size="small" value="WiFi" disabled fullWidth />
                  </MenuItem>,

                  <MenuItem key="wifi-band" disableRipple sx={{ width: "190px" }}>
                    <FormControl size="small" fullWidth>
                      <InputLabel htmlFor="wifi-band-select">Band</InputLabel>
                      <Select
                        native
                        id="wifi-band-select"
                        label="Band"
                        value={props.wifiBand ?? "5"}
                        onChange={props.handleWifiBandChange}
                        className={`${styles.selectBox} nodrag nopan`}
                      >
                        <option value="2.4">2.4 GHz</option>
                        <option value="5">5 GHz</option>
                      </Select>
                    </FormControl>
                  </MenuItem>,
              ] : (
              <MenuItem disableRipple>
                <FormControl size="small" sx={{ m: 1, minWidth: 120, marginLeft: '20px' }}>
                  <InputLabel htmlFor="grouped-native-select">
                    Interface
                  </InputLabel>
                  <Select
                    native
                    id="grouped-native-select"
                    label="Grouping"
                    className={`${styles.selectBox} nodrag nopan`}
                    autoWidth
                    value={props.interface}
                    onChange={(e) =>
                      props.handleInterfaceChange(e, props.position)
                    }
                  >
                    <option aria-label="None" value="" />
                    <optgroup label="Fast Ethernet">
                      {FAOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Gigabit Ethernet">
                      {GIOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </optgroup>
                    {props.bothRouters ?
                      <optgroup label="Serial">
                        {SeOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </optgroup>
                      :
                        ''
                    }
                  </Select>
                </FormControl>
              </MenuItem>
              )}

              <MenuItem disableRipple>
                <FormControlLabel
                  value="start"
                  label="Enabled:"
                  labelPlacement="start"
                  control={
                    <Switch
                    checked={props.enabled}
                    color="primary"
                    onChange={(e) => props.setEnabled(e.target.checked)}
                    sx={{marginLeft: '25px'}} />
                  }
                />
              </MenuItem>

              <MenuItem disableRipple sx={{ width: "190px" }} >
                <TextField
                  id="outlined-size-small"
                  label="Address"
                  size="small"
                  type="text"
                  value={props.address}
                  onChange={(e) => props.handleAddressChange(e, props.position)}
                  className={styles.inputBox}
                  fullWidth
                />
              </MenuItem>

              <MenuItem disableRipple sx={{ width: "190px" }} >
                <TextField
                  id="outlined-size-small"
                  label="Subnet Mask"
                  size="small"
                  type="text"
                  value={props.subnetMask}
                  onChange={(e) => props.handleSubnetMaskChange(e, props.position)}
                  className={styles.inputBox}
                  fullWidth
                />
              </MenuItem>

              <MenuItem disableRipple sx={{ width: "200px" }} >
                <TextField
                  id="outlined-size-small"
                  disabled={true}
                  label="Available BW"
                  size="small"
                  value={availableBandwidth}
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Mbps</InputAdornment>,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MenuItem>

              <MenuItem disableRipple sx={{ width: "200px" }} >
                <TextField
                  id="outlined-size-small"
                  label="Configured BW"
                  size="small"
                  type="number"
                  inputProps={{ min: "0" }}
                  value={props.bandwidth}
                  onChange={(e) => props.handleBandwidthChange(e, props.position)}
                  className={styles.inputBox}
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Mbps</InputAdornment>,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    </div>
  );
};

export default EdgeMenu;
