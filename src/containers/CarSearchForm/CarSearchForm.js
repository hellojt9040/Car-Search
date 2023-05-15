import React, { useCallback, useReducer, useState, useEffect } from 'react';
import Button from '@mui/material/Button';

import SelectVariants from '../../components/form/SelectVariants';
import MultipleSelectChip from '../../components/form/MultipleSelectChip';
import Checkbox from '../../components/form/Checkbox';
import TextFields from '../../components/form/TextField';
import './CarSearchForm.scss';

const initialState = {
  inputs: {
    vehicleType: {
      value: '',
      validity: false,
    },
    vehicleMake: {
      value: [],
      validity: false,
    },
    withYearFilter: {
      value: false,
      validity: true,
    },
    year: {
      value: new Date().getFullYear(),
      validity: false,
    },
  },
  isFormValid: false,
  isSubmitted: false,
  lastSearch: '',
};

const checkFormValidity = (inputs, name, validity) =>
  Object.keys(inputs).every((input) =>
    input !== name ? inputs[input]?.validity : validity
  );

const formDataReducer = (state, action = {}) => {
  const { type, payload } = action;
  const { name, value, validity } = payload || {};
  const isFormValid = checkFormValidity(state.inputs, name, validity);

  switch (type) {
    case 'FORM_FIELD_CHANGE':
      const updatedState = {
        ...state,
        inputs: {
          ...state.inputs,
          [name]: {
            ...state.inputs?.[name],
            value: value,
            validity: validity ?? state.inputs?.[name]?.validity,
          },
        },
        isFormValid: isFormValid && validity,
      };
      return updatedState;
    case 'FORM_FIELD_SET_VALIDITY':
      const updatedValidityState = {
        ...state,
        inputs: {
          ...state.inputs,
          [name]: {
            ...state.inputs?.[name],
            validity: validity ?? state.inputs?.[name]?.validity,
          },
        },
        isFormValid: isFormValid && isValid,
      };
      return updatedValidityState;
    case 'FORM_SUBMIT':
      const submittedState = {
        ...state,
        isSubmitted: true,
        lastSearch: JSON.stringify(state.inputs),
      };
      return submittedState;
    case 'RESET_FORM_SUBMIT':
      return {
        ...state,
        isSubmitted: false,
      };
    default:
      return state;
  }
};

const CarSearchForm = ({
  vehicleType,
  vehicleMake,
  fetchVehicleMake,
  isFetching,
  setIsFetching,
  setVehicleSearchData,
  setError,
}) => {
  const [formData, dispatch] = useReducer(formDataReducer, initialState);
  const [triggerYearValidation, setTriggerYearValidation] = useState();

  const onChangeHandler = useCallback(
    ({ payload }) => {
      dispatch({ type: 'FORM_FIELD_CHANGE', payload });
    },
    [dispatch]
  );

  const vehicleTypeSelected = formData.inputs?.vehicleType?.value?.trim();
  useEffect(() => {
    debugger;
    if (vehicleTypeSelected) {
      // dispatch({
      //   type: 'FORM_FIELD_CHANGE',
      //   payload: { name: 'vehicleMake', value: '', validity: false },
      // });
      fetchVehicleMake(vehicleTypeSelected);
    }
  }, [vehicleTypeSelected]);

  const makePromises = (data = {}) => {
    const {
      vehicleType: vehicleTypeData,
      year: yearData,
      withYearFilter,
      vehicleMake,
    } = data;
    const year = withYearFilter && yearData ? `/modelyear/${yearData}` : '';
    const vehicleType = vehicleTypeData?.trim()
      ? `/vehicleType/${vehicleTypeData.trim()}`
      : '';

    const promises = vehicleMake?.map((make) => {
      return new Promise((resolve, reject) => {
        fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${make}${year}${vehicleType}?format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            console.log('fetched data for' + make, data);
            resolve(data);
          })
          .catch((e) => {
            console.error('fetched error for' + make, e);
            reject(e);
          });
      });
    });

    return promises;
  };

  const submitHandler = () => {
    dispatch({ type: 'FORM_SUBMIT' });
    const { vehicleType, vehicleMake, withYearFilter, year } =
      formData?.inputs || {};
    const apiPromises = makePromises({
      vehicleType: vehicleType.value,
      vehicleMake: vehicleMake.value,
      withYearFilter: withYearFilter.value,
      year: withYearFilter.value ? year.value : 0,
    });
    console.log(apiPromises);
    setIsFetching(true);
    Promise.allSettled(apiPromises)
      .then((result) => {
        debugger;
        const vehicleSearchData = result
          ?.flatMap((el) =>
            el.status === 'fulfilled' && el.value?.Results
              ? el.value?.Results
              : []
          )
          .map((vehicle) => ({ ...vehicle, id: vehicle.Model_ID }));
        setIsFetching(false);
        console.log(vehicleSearchData);
        setVehicleSearchData(vehicleSearchData);
      })
      .catch((e) => {
        debugger;
        console.log(e);
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

  debugger;
  console.log('changed...', anyFormFieldChanged);

  // console.table(formData.inputs);
  console.table(formData);
  return (
    <div className="CarSearchForm">
      {/* {JSON.stringify(formData)} */}
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
          {/* onChangeHandler */}
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
