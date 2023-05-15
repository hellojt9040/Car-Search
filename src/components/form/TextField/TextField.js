import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

export default function TextFields({
  id,
  label,
  placeholder,
  type,
  validity,
  isDisabled,
  triggerValidation,
  changeHandler,
}) {
  const [value, setValue] = useState(new Date().getFullYear());
  const [touched, setTouched] = React.useState(false);

  const onChangeHandler = (value) => {
    const validity = value.toString().length === 4;
    setTouched(true);
    changeHandler({
      payload: {
        name: id,
        value,
        validity: triggerValidation === true ? validity : true,
      },
    });
    setValue(value);
  };

  const handlerBlur = () => {
    setTouched(true);
  };

  useEffect(() => {
    onChangeHandler(value);
  }, [triggerValidation]);

  return (
    <TextField
      id="standard-basic"
      label={label}
      variant="standard"
      placeholder={placeholder}
      type={type}
      error={touched && !validity}
      value={value}
      disabled={isDisabled}
      onChange={(event) => onChangeHandler(event.target.value)}
      onBlur={handlerBlur}
    />
  );
}
