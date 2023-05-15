import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { MenuProps } from '../../../constants/constants';
import { getStyles } from '../../../utils/helpers';

const MultipleSelectChip = ({
  id,
  label,
  validity,
  disabled,
  optionData,
  changeHandler,
  vehicleType,
}) => {
  const theme = useTheme();
  const [selectedOptions, setOptions] = useState([]);
  const [touched, setTouched] = React.useState(false);

  const handleChange = (value) => {
    const validity = !!value?.length;
    changeHandler({ payload: { name: id, value, validity } });
    setTouched(true);
    setOptions(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handlerBlur = () => {
    setTouched(true);
  };

  useEffect(() => {
    if (vehicleType && selectedOptions.length) {
      handleChange([]);
    }
  }, [vehicleType]);

  return (
    <div>
      <FormControl
        fullWidth
        variant="filled"
        sx={{ m: 1 }}
        disabled={disabled}
        error={touched && !validity}
      >
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedOptions}
          onChange={(e) => handleChange(e.target?.value)}
          onClose={handlerBlur}
          input={<FilledInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {optionData?.map((option) => (
            <MenuItem
              key={option.id}
              value={option.name}
              style={getStyles(option.name, selectedOptions, theme)}
            >
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleSelectChip;
