import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SelectVariants = ({ id, label, validity, optionData, changeHandler }) => {
  const [value, setValue] = React.useState('');
  const [touched, setTouched] = React.useState(false);

  const handleChange = (event) => {
    const value = event.target.value;
    const validity = !!event.target.value;
    changeHandler({ payload: { name: id, value, validity } });
    setTouched(true);
    setValue(value);
  };

  const handlerBlur = () => {
    setTouched(true);
  };

  return (
    <div>
      <FormControl
        fullWidth
        variant="filled"
        sx={{ m: 1, minWidth: 120 }}
        error={touched && !validity}
      >
        <InputLabel id="demo-simple-select-filled-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={value}
          onChange={handleChange}
          onClose={handlerBlur}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          {optionData?.map(({ id, name }) => (
            <MenuItem key={id} value={name}>
              {name}
            </MenuItem>
          ))}
          {/* <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectVariants;
