import React, { useCallback, useReducer, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import SelectVariants from '../../components/form/SelectVariants';
import MultipleSelectChip from '../../components/form/MultipleSelectChip';
import Checkbox from '../../components/form/Checkbox';
import TextFields from '../../components/form/TextField';
import {
  INITIAL_STATE,
  formDataReducer,
  FORM_FIELD_CHANGE,
  FORM_SUBMIT,
  createVehicleMakePromises,
} from './utils';
import './CarSearchForm.scss';

const CarSearchForm = ({
  vehicleType,
  vehicleMake,
  fetchVehicleMake,
  isFetching,
  setIsFetching,
  setVehicleSearchData,
  setError,
}) => {
  const [formData, dispatch] = useReducer(formDataReducer, INITIAL_STATE);
  const [triggerYearValidation, setTriggerYearValidation] = useState();

  const onChangeHandler = useCallback(
    ({ payload }) => {
      dispatch({ type: FORM_FIELD_CHANGE, payload });
    },
    [dispatch]
  );

  const vehicleTypeSelected = formData.inputs?.vehicleType?.value?.trim();
  useEffect(() => {
    if (vehicleTypeSelected) {
      fetchVehicleMake(vehicleTypeSelected);
    }
  }, [vehicleTypeSelected]);

  const submitHandler = () => {
    dispatch({ type: FORM_SUBMIT });
    const { vehicleType, vehicleMake, withYearFilter, year } =
      formData?.inputs || {};
    const apiPromises = createVehicleMakePromises({
      vehicleType: vehicleType.value,
      vehicleMake: vehicleMake.value,
      withYearFilter: withYearFilter.value,
      year: withYearFilter.value ? year.value : 0,
    });
    setIsFetching(true);
    Promise.allSettled(apiPromises)
      .then((result) => {
        const vehicleSearchData = result
          ?.flatMap((el) =>
            el.status === 'fulfilled' && el.value?.Results
              ? el.value?.Results
              : []
          )
          .map((vehicle) => ({ ...vehicle, id: vehicle.Model_ID }));
        setIsFetching(false);
        setVehicleSearchData(vehicleSearchData);
      })
      .catch((e) => {
        setIsFetching(false);
        setError(e);
      });
  };

  const isWithYearFilterChecked = formData.inputs?.withYearFilter?.value;
  useEffect(() => {
    setTriggerYearValidation(isWithYearFilterChecked);
  }, [isWithYearFilterChecked]);

  const anyFormFieldChanged =
    formData.lastSearch !== JSON.stringify(formData.inputs);

  return (
    <div className="CarSearchForm">
      <form aria-disabled={isFetching}>
        <SelectVariants
          id="vehicleType"
          label="Vehicle Type"
          validity={formData.inputs?.vehicleType?.validity}
          optionData={vehicleType?.Results}
          changeHandler={onChangeHandler}
        />
        <MultipleSelectChip
          id="vehicleMake"
          label="Vehicle Make"
          validity={formData.inputs?.vehicleMake?.validity}
          disabled={!vehicleTypeSelected}
          vehicleType={vehicleTypeSelected}
          optionData={vehicleMake?.Results}
          changeHandler={onChangeHandler}
        />
        <div className="CarSearchForm__filterYear">
          <Checkbox
            id="withYearFilter"
            isChecked={isWithYearFilterChecked}
            changeHandler={onChangeHandler}
          />
          <TextFields
            id="year"
            label="Year"
            placeholder="2023"
            type="number"
            validity={formData.inputs?.year?.validity}
            triggerValidation={triggerYearValidation}
            isDisabled={!isWithYearFilterChecked}
            changeHandler={onChangeHandler}
          />
        </div>
        <div className="CarSearchForm__formAction">
          <Button
            variant="contained"
            fullWidth
            disabled={
              !formData.isFormValid || isFetching || !anyFormFieldChanged
            }
            onClick={submitHandler}
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CarSearchForm;
