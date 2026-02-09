import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FormHelperText from '@mui/material/FormHelperText';
import useUrlStore from "../../../stores/useUrlStore";
import styles from "./UrlSetter.module.css";

function UrlChecker() {
  const url = useUrlStore((state) => state.url);
  const setUrl = useUrlStore((state) => state.setUrl);
  const [status, setStatus] = useState({ text: '', color: 'black' });

  const checkUrl = () => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          setStatus({ text: 'Connected!', color: 'green' });
        } else {
          setStatus({ text: 'Connection error!', color: 'red' });
        }
      })
      .catch(() => {
        setStatus({ text: 'Connection error!', color: 'red' });
      });
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <FormHelperText style={{ color: status.color, position: 'absolute', top: '-5px' }}>{status.text}</FormHelperText>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <label>Base URL:</label>
        <TextField
          label="URL"
          variant="outlined"
          size="small"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className={styles.urlSetter}
        />
        <IconButton style={{ color: 'black' }} onClick={checkUrl}>
          <PlayCircleOutlineIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default UrlChecker;
