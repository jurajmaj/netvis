import styles from "../Controller.module.css";
import { IconButton, InputAdornment, TextField, Typography, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import InfoIcon from '@mui/icons-material/Info';

const SecondaryControls = (props) => {
  const {bandwidth, handleBandwidthChange, delay, setDelay, jitter, setJitter, isLoading, postFlow, stats, errorMessage} = props;
  const [bandwidthError, setBandwidthError] = React.useState(false);
  const [delayError, setDelayError] = React.useState(false);
  const [jitterError, setJitterError] = React.useState(false);

  useEffect(() => {
    setBandwidthError(bandwidth < 0);
  }, [bandwidth]);

  useEffect(() => {
    setDelayError(delay < 0);
  }, [delay]);

  useEffect(() => {
    setJitterError(jitter < 0);
  }, [jitter]);

  return (
    <div className={styles.secondaryControls}>
      <label className={styles.qosLabel}>Qos:</label>
      <TextField
        id="outlined-size-small"
        label="BW"
        size="small"
        type="number"
        inputProps={{ min: "0" }}
        error={bandwidthError}
        value={bandwidth}
        onChange={handleBandwidthChange}
        sx={{width: "110px", backgroundColor: "white"}}
        InputProps={{
          endAdornment:
            <InputAdornment position="end" sx={{fontFamily: 'Monospace', fontSize: '11px'}}>
              <Typography sx={{fontFamily: 'Monospace', fontSize: '11px', color: 'black', userSelect: 'none'}}>
                Mbps
              </Typography>
            </InputAdornment>,
        }}
      />

      <TextField
        id="outlined-size-small"
        label="Delay"
        size="small"
        type="number"
        inputProps={{ min: "0" }}
        error={delayError}
        value={delay}
        onChange={(event) => setDelay(event.target.value)}
        sx={{width: "100px", backgroundColor: "white"}}
        InputProps={{
          endAdornment:
            <InputAdornment position="end" sx={{fontFamily: 'Monospace', fontSize: '11px'}}>
              <Typography sx={{fontFamily: 'Monospace', fontSize: '11px', color: 'black', userSelect: 'none'}}>
                ms
              </Typography>
            </InputAdornment>,
        }}
      />

      <TextField
        id="outlined-size-small"
        label="Jitter"
        size="small"
        type="number"
        inputProps={{ min: "0" }}
        error={jitterError}
        value={jitter}
        onChange={(event) => setJitter(event.target.value)}
        sx={{width: "105px", backgroundColor: "white"}}
        InputProps={{
          endAdornment:
            <InputAdornment position="end" sx={{fontFamily: 'Monospace', fontSize: '11px'}}>
              <Typography sx={{fontFamily: 'Monospace', fontSize: '11px', color: 'black', userSelect: 'none'}}>
                ms
              </Typography>
            </InputAdornment>,
        }}
      />

      {isLoading ? (
        <IconButton disableRipple style={{ color: 'black' }}>
          <CircularProgress size={24} thickness={5} style={{ color: 'black' }} />
        </IconButton>
      )
        : (
        <IconButton style={{ color: 'black', position: 'relative' }} onClick={postFlow}>
          <PlayCircleIcon />
          {stats && (
            <Tooltip
              arrow
              title={
                <React.Fragment>
                  <Typography color="inherit" style={{ marginLeft: '45px' }}>Stats</Typography>
                  <div>Time: {stats.timeUs} µs</div>
                  <div>Visited States: {stats.visitedStates}</div>
                  <div>Memory Allocated: {stats.maxMemoryAllocated} kB</div>
                </React.Fragment>
              }
            >
              <InfoIcon fontSize="small" style={{ color: '#00A300', position: 'absolute', top: 0, right: -3 }}/>
            </Tooltip>
          )}
          {errorMessage && (
            <Tooltip
              arrow
              title={
                <React.Fragment>
                  <Typography color="inherit" style={{marginLeft: '35px', color: '#ff0000' }}>Error</Typography>
                  <div>{errorMessage.msg}</div>
                </React.Fragment>
              }
            >
            <InfoIcon fontSize="small" style={{ color: '#ff0000', position: 'absolute', top: 0, right: -3 }}/>
            </Tooltip>
          )}
        </IconButton>
      )}
    </div>
  );
}

export default SecondaryControls
