import React, { useState } from 'react';
import SelectVariants from '../../components/form/SelectVariants';
import MultipleSelectChip from '../../components/form/MultipleSelectChip';
import Checkbox from '../../components/form/Checkbox';
import TextFields from '../../components/form/TextField';
import './CarSearchForm.scss'
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

// TODO:
const CarSearchForm = () => {
  const [age, setAge] = useState();

  return (
    <div className="CarSearchForm">
      <form>
        <SelectVariants />
        <MultipleSelectChip />
        <div className="CarSearchForm__filterYear">
          <Checkbox />
          <TextFields />
        </div>
      </form>
    </div>
  );
};

export default CarSearchForm;
