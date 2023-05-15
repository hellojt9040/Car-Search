export const INITIAL_STATE = {
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

export const FORM_FIELD_CHANGE = 'FORM_FIELD_CHANGE';
export const FORM_FIELD_SET_VALIDITY = 'FORM_FIELD_SET_VALIDITY';
export const FORM_SUBMIT = 'FORM_SUBMIT';
export const RESET_FORM_SUBMIT = 'RESET_FORM_SUBMIT';

const checkFormValidity = (inputs, name, validity) =>
  Object.keys(inputs).every((input) =>
    input !== name ? inputs[input]?.validity : validity
  );

export const formDataReducer = (state, action = {}) => {
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

export const createVehicleMakePromises = (data = {}) => {
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
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });

  return promises;
};
