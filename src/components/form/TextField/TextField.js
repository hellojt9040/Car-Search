import React from 'react';
import TextField from '@mui/material/TextField';

export default function TextFields({ label, placeholder, type, onChangeHandler }) {
  return (
    <TextField
      id="standard-basic"
      label={label}
      variant="standard"
      placeholder={placeholder}
      type={type}
      onChange={event => onChangeHandler(event.target.value)}
    />
  );
}
