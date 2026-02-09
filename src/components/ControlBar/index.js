import React, { useState, useRef, useEffect } from "react";
import { Panel } from "reactflow";
import styles from "./ControlBar.module.css";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import Controller from "./Controller";
import useControllersStore from "../../stores/useControllersStore";
import UrlSetter from "./UrlSetter";
import useThemeStore from "../../stores/useThemeStore";

const ControlBar = (props) => {
  const { nodes, reactFlowInstance } = props;
  const controllers = useControllersStore(state => state.controllers);
  const addController = useControllersStore(state => state.addController);
  const removeController = useControllersStore(state => state.removeController);
  const backgroundTheme = useThemeStore(state => state.theme);

  const [selectedControllerId, setSelectedControllerId] = useState(null);
  const controllersRef = useRef();

  const handleControllerClick = (id) => {
    setSelectedControllerId(id);
  };

  useEffect(() => {
    if(controllersRef.current){
      controllersRef.current.scrollTop = controllersRef.current.scrollHeight;
    }
  }, [controllers]);

  return (
    <Panel position="top-right" className={styles.panel}>
      <ThemeProvider theme={theme}>
        <div ref={controllersRef} className={styles.controllers}>
          <UrlSetter />
          {controllers.map((controller) => (
            <div key={controller.id}>
              <Controller
                id={controller.id}
                nodes={nodes}
                reactFlowInstance={reactFlowInstance}
                removeController={removeController}
                isSelected={controller.id === selectedControllerId}
                onDivClick={handleControllerClick}
              />
            </div>
          ))}
        </div>

        {controllers.length < 4
          ?
          <button className={backgroundTheme === 'dark' ? styles.addButtonDark : styles.addButton} onClick={addController}>
            +
          </button>
          :
          ''
        }


      </ThemeProvider>
    </Panel>
  );
};

export default ControlBar;
