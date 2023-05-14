import React, { useState } from 'react';
import Button from '@mui/material/Button';

import SelectVariants from '../../components/form/SelectVariants';
import MultipleSelectChip from '../../components/form/MultipleSelectChip';
import Checkbox from '../../components/form/Checkbox';
import TextFields from '../../components/form/TextField';
import './CarSearchForm.scss';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

// TODO:
const CarSearchForm = ({ vehicleType, vehicleMake, isFetching }) => {
  const [age, setAge] = useState();

  return (
    <div className="CarSearchForm">
      
      <form aria-disabled={isFetching}>
        <SelectVariants
          label="Vehicle Type"
          optionData={vehicleType?.Results}
        />
        <MultipleSelectChip />
        <div className="CarSearchForm__filterYear">
          <Checkbox />
          <TextFields label="Year" placeholder="2023" type="number" />{' '}
          {/* onChangeHandler */}
        </div>
        <div className="CarSearchForm__formAction">
          <Button variant="contained">Search</Button>
        </div>
      </form>
    </div>
  );
};

export default CarSearchForm;
