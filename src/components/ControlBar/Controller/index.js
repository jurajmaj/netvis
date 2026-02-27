import React, { useState, useEffect } from "react"
import styles from "./Controller.module.css";
import postFlowJSON from "./postFlowJSON";
import PrimaryControls from "./PrimaryControls";
import SecondaryControls from "./SecondaryControls";
import { EDGE_ATTRIBUTES } from "../../../constants";
import useControllersStore from "../../../stores/useControllersStore";
import useThemeStore from "../../../stores/useThemeStore";

const {DEFAULT_COLOR, STROKE_WIDTH, ENABLED_COLOR_LIGHT, ENABLED_COLOR_DARK} = EDGE_ATTRIBUTES;

const Controller = (props) => {
  const { id, removeController, nodes, reactFlowInstance, isSelected, onDivClick} = props;
  const setControllerData = useControllersStore(state => state.setControllerData);

  const controllerId = id;
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [color, setColor] = useState("#ff0000");
  const [bandwidth, setBandwidth] = useState('');
  const [delay, setDelay] = useState('');
  const [jitter, setJitter] = useState('');
  const [algorithm, setAlgorithm] = useState("DFS");

  const [paths, setPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [stats, setStats] = useState(null);
  const [numPaths, setNumPaths] = useState(1);
  const theme = useThemeStore(state => state.theme);

  const [yenCheckbox, setYenCheckbox] = useState(false);
  const [yenPath, setYenPath] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleBandwidthChange = (event) => {
    if (event.target.value < 0)
      return;

    setBandwidth(event.target.value);
  };

  const postFlow = () => {
    setIsLoading(true);
    setPaths([]);
    postFlowJSON(reactFlowInstance, source, destination, algorithm, setPaths, setIsLoading, setStats, numPaths, setErrorMessage);
  };

  useEffect(() => {
    if(errorMessage)
      setIsLoading(false);
  }, [errorMessage]);

  const handleDivClick = () => {
    onDivClick(id);
    if (reactFlowInstance) {
      const resetEdges = reactFlowInstance.getEdges().map((edge) =>
        edge.data.enabled
          ? {...edge, style: { stroke: theme === 'light' ? ENABLED_COLOR_LIGHT : ENABLED_COLOR_DARK }, animated: false}
          : {...edge, style: { stroke: DEFAULT_COLOR }, animated: false}
      );
      reactFlowInstance.setEdges(resetEdges);

      if (paths && paths.length > 0) {
        let idsToColor;
        if(algorithm === 'Yen' && yenCheckbox)
          idsToColor = [...new Set(paths[0].result.flat())];
        else if (algorithm === 'Yen' && !yenCheckbox)
          idsToColor = paths[0].result[yenPath-1];
        else
          idsToColor = paths[0].result;

        const updatedEdges = resetEdges.map((edge) =>
          idsToColor.includes(edge.id)
            ? {...edge, style: {stroke: color, strokeWidth: STROKE_WIDTH}, animated: true}
            : edge
        );
        reactFlowInstance.setEdges(updatedEdges);
      }
    }
  }

  const handleCheckboxClick = () => {
    setYenCheckbox(!yenCheckbox);
  }

  const handleYenPathClick = (event) => {
    setYenPath(event.target.value);
    setYenCheckbox(false);
  }

  useEffect(() => {
    if (reactFlowInstance && paths && paths.length > 0) {
      let idsToColor;
      if (algorithm === 'Yen' && yenCheckbox)
        idsToColor = [...new Set(paths[0].result.flat())];
      else if (algorithm === 'Yen' && !yenCheckbox)
        idsToColor = paths[0].result[yenPath-1];
      else
        idsToColor = paths[0].result;

      const resetEdges = reactFlowInstance.getEdges().map((edge) =>
        edge.data.enabled
          ? {...edge, style: { stroke: theme === 'light' ? ENABLED_COLOR_LIGHT : ENABLED_COLOR_DARK }, animated: false}
          : {...edge, style: { stroke: DEFAULT_COLOR }, animated: false}
      );

      const updatedEdges = resetEdges.map((edge) =>
        idsToColor.includes(edge.id)
          ? {...edge, style: {stroke: color, strokeWidth: STROKE_WIDTH}, animated: true}
          : edge
      );
      reactFlowInstance.setEdges(updatedEdges);
    }
  }, [paths, color, reactFlowInstance, algorithm, yenCheckbox, yenPath, theme]);

  useEffect(() => {
    if(paths.length > 0) {
      const resetEdges = reactFlowInstance.getEdges().map((edge) =>
        edge.data.enabled
          ? {...edge, style: {stroke: theme === 'light' ? ENABLED_COLOR_LIGHT : ENABLED_COLOR_DARK}, animated: false}
          : {...edge, style: {stroke: DEFAULT_COLOR}, animated: false}
      );
      reactFlowInstance.setEdges(resetEdges);
    }
    setStats(null);
    setErrorMessage(null);
    setPaths([]);
    setControllerData(controllerId, { paths: [] });

    setYenPath(1);
    setYenCheckbox(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, destination, algorithm, numPaths, bandwidth, delay, jitter]);

  useEffect(() => {
    setControllerData(controllerId, { source });
    setControllerData(controllerId, { destination });
    setControllerData(controllerId, { bandwidth });

    const result = paths?.[0]?.result;
    if (!result) return;

    let edgeIds = [];

    if (algorithm === 'Yen') {
      if (Array.isArray(result) && Array.isArray(result[0])) {
        if (yenCheckbox) {
          edgeIds = [...new Set(result.flat())];
        } else {
          const idx = Math.max(0, Number(yenPath) - 1);
          edgeIds = result[idx] ?? [];
        }
      } else if (Array.isArray(result)) {
        edgeIds = result;
      }
    } else {
      edgeIds = Array.isArray(result) ? result : [];
    }

    setControllerData(controllerId, { paths: edgeIds });
  }, [source, destination, setControllerData, controllerId, bandwidth, paths, algorithm, yenCheckbox, yenPath]);

  return (
    <div className={styles.controller} onClick={handleDivClick} style={isSelected ? {border: '3px solid black'} : {}}>
      <PrimaryControls
        nodes={nodes}
        source={source}
        setSource={setSource}
        destination={destination}
        setDestination={setDestination}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        color={color}
        setColor={setColor}
        numPaths={numPaths}
        setNumPaths={setNumPaths}
        paths={paths}
        yenCheckbox={yenCheckbox}
        handleCheckboxClick={handleCheckboxClick}
        yenPath={yenPath}
        handleYenPathClick={handleYenPathClick}
      />

      <div className={styles.removeButtonContainer}>
        <button className={styles.removeButton} onClick={() => removeController(controllerId)}>
          -
        </button>
      </div>

      <SecondaryControls
        bandwidth={bandwidth}
        handleBandwidthChange={handleBandwidthChange}
        delay={delay}
        setDelay={setDelay}
        jitter={jitter}
        setJitter={setJitter}
        isLoading={isLoading}
        stats={stats}
        postFlow={postFlow}
        errorMessage={errorMessage}
      />
    </div>
  );
}

export default Controller
