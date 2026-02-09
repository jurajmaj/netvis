import React, { useEffect, useCallback } from "react";
import { Panel } from "reactflow";
import { Menu, MenuItem, ListItemIcon, ThemeProvider, Typography, ListItemText } from "@mui/material";
import { Download as DownloadIcon, Upload as UploadIcon, DarkMode as DarkModeIcon } from "@mui/icons-material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import { ReactComponent as HamburgerIcon } from "../../assets/HamburgerMenu.svg";
import styles from "./Menu.module.css";
import { theme } from "./theme";
import saveFlow from "./saveFlow";
import uploadFlow from "./uploadFlow";

import useThemeStore from "../../stores/useThemeStore";
import useIdsStore from "../../stores/useIdsStore";


const HamburgerMenu = (props) => {
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { setNodeId, setEdgeId } = useIdsStore();

  const menuItems = [
    { Icon: DarkModeIcon,
      text: "Change theme",
      typography: navigator.userAgent.includes('Mac') ? "⌘K" : <><span
        style={{backgroundColor: 'lightgray', borderRadius: '3px', padding: '2px'}}>Ctrl</span> + <span
        style={{backgroundColor: 'lightgray', borderRadius: '3px', padding: '2px'}}>K</span></>,
      onClick: (popupState) => {
        toggleTheme();
        popupState.close();
      }
    },
    { Icon: UploadIcon,
      text: "Upload flow",
      typography: navigator.userAgent.includes('Mac') ? "⌘U" : <><span
        style={{backgroundColor: 'lightgray', borderRadius: '3px', padding: '2px'}}>Ctrl</span> + <span
        style={{backgroundColor: 'lightgray', borderRadius: '3px', padding: '2px'}}>U</span></>,
      onClick: (popupState, props) => {
        uploadFlow(props, setNodeId, setEdgeId);
        popupState.close()
      }
    },
    { Icon: DownloadIcon,
      text: "Save flow",
      typography: navigator.userAgent.includes('Mac') ? "⌘S" : <><span
        style={{backgroundColor: 'lightgray', borderRadius: '3px', padding: '2px'}}>Ctrl</span> + <span
        style={{backgroundColor: 'lightgray', borderRadius: '3px', padding: '2px'}}>S</span></>,
      onClick: (popupState, props) => {
        saveFlow(props);
        popupState.close();
      }
    },
  ];

  const handleKeyDown = useCallback((event) => {
    if ((event.ctrlKey || event.metaKey) && (event.key === 's' || event.key === 'S')) {
      event.preventDefault();
      saveFlow(props);
    }
    if ((event.ctrlKey || event.metaKey) && (event.key === 'k' || event.key === 'K')) {
      event.preventDefault();
      toggleTheme();
    }
    if ((event.ctrlKey || event.metaKey) && (event.key === 'u' || event.key === 'U')) {
      event.preventDefault();
      uploadFlow(props, setNodeId, setEdgeId);
    }
  }, [props, toggleTheme, setNodeId, setEdgeId]);


  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <ThemeProvider theme={theme}>
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <Panel position="top-left" className={styles.panel} {...bindTrigger(popupState)} >
              <HamburgerIcon />
            </Panel>

            <Menu {...bindMenu(popupState)}>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => item.onClick(popupState, props)}
                  sx={{fontFamily: "Monospace", fontSize: "12px"}}
                >
                  <ListItemIcon style={{marginRight: "-8px"}}>
                    <item.Icon style={{fontSize: "14px"}} />
                  </ListItemIcon>
              <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: {fontFamily: "Monospace", fontSize: "12px"}
                    }}
                  />
                  {item.typography ? (
                    <Typography variant="body2" color="text.secondary" sx={{fontSize: "12px"}}>
                      {item.typography}
                    </Typography>
                  ) : null}
                </MenuItem>
              ))}
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    </ThemeProvider>
  );
};

export default HamburgerMenu;
