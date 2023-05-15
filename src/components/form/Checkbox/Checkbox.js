import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

export default function Checkbox({ id, isChecked, changeHandler }) {
  const [checked, setChecked] = React.useState(isChecked || false);

  const handleChange = (event) => {
    const value = event.target.checked;
    changeHandler({ payload: { name: id, value } });
    setChecked(value);
  };

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
}
