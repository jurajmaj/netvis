import React, { useEffect } from "react";
import styles from "../Controller.module.css";
import SelectBox from "../SelectBox";
import { ALGORITHMS, NUMPATHS } from "../algorithms";

const PrimaryControls = (props) => {
  const {nodes, source, setSource, destination, setDestination, algorithm, setAlgorithm, color,
    setColor, numPaths, setNumPaths, paths, yenCheckbox, handleCheckboxClick, yenPath,handleYenPathClick} = props;

  const pathsOptions = paths[0] && paths[0].result
    ? [...Array(paths[0].result.length).keys()].map(i => ({ id: i, data: { label: i + 1 } }))
    : [];

  useEffect(() => {
    const firstNamedNode = nodes.find((node) => node.data.label);
    const firstNodeLabel = firstNamedNode ? firstNamedNode.data.label : "";
    if (firstNamedNode && source === '') {
      setSource(firstNodeLabel);
    }
    if (firstNamedNode && destination === '') {
      setDestination(firstNodeLabel);
    }
  }, [source, destination, setSource, setDestination, nodes]);

  return (
    <div className={algorithm === 'Yen' ? styles.primaryControlsYen : styles.primaryControls}>
      <div className={styles.col0}>
        <div className={styles.row}>
          <label className={styles.sourceLabel}>Source:</label>
          <SelectBox label="Source" options={nodes} value={source}
                     onChange={(event) => setSource(event.target.value)} />
        </div>
        <div className={styles.row}>
          <label>Destination:</label>
          <SelectBox label="Destination" options={nodes} value={destination}
                     onChange={(event) => setDestination(event.target.value)} />
        </div>
      </div>

      <div className={styles.col1}>
        <div className={styles.row}>
          <label>Algorithm:</label>
          <SelectBox label="Algorithm" options={ALGORITHMS} value={algorithm}
                     onChange={(event) => setAlgorithm(event.target.value)}
                     className={algorithm === 'Yen' || algorithm === 'DFS' || algorithm === 'BFS' || algorithm === 'ANT' ? styles.smallSelectBox : styles.selectBox}  />
        {algorithm === 'Yen' && (
          <div className={styles.row}>
            <label>Paths:</label>
            <SelectBox label="Paths" options={NUMPATHS} value={numPaths}
                       onChange={(event) => setNumPaths(event.target.value)} className={styles.numPathsSelectedBox} />
          </div>
        )}
        </div>

        <div className={styles.row}>
          {algorithm === 'Yen' ?
            <>
              <label className={styles.labelYen}>Color:</label>
              <input type="color" value={color} className={styles.colorPicker}
                     onChange={(event) => setColor(event.target.value)} />
              {pathsOptions.length > 0 ?
                <>
                  <label className={styles.labelYen}>Path:</label>
                  <SelectBox label="Paths" options={pathsOptions} value={yenPath}
                             onChange={handleYenPathClick} className={styles.numPathsSelectedBox} />
                  {pathsOptions.length > 1 ?
                    <>
                      <label className={styles.labelYen}>All:</label>
                      <input type="checkbox" id="allCheckbox" checked={yenCheckbox} onChange={handleCheckboxClick} />
                    </>
                    :
                    ''
                  }
                </>
              :
                ''
              }
            </>
            :
            <>
              <label className={styles.colorLabel}>Color:</label>
              <input type="color" value={color} className={styles.colorPicker}
                                              onChange={(event) => setColor(event.target.value)} />
            </>
        }
        </div>
      </div>

  </div>
  );
}

export default PrimaryControls
