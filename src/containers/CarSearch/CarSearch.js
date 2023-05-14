import React, { useEffect, useCallback, useState } from 'react';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Backdrop from '@mui/material/Backdrop';
import CarSearchForm from '../CarSearchForm';
import './CarSearch.scss';

const CarSearch = () => {
  const [vehicleType, setVehicleType] = useState();
  const [vehicleMake, setVehicleMake] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const fetchVehicleType = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        'https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablevalueslist/vehicle%20type?format=json'
      );
      const data = await response.json();
      setVehicleType(data);
      console.log('vehicle type', data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // fetch masters data
  useEffect(() => {
    fetchVehicleType();
  }, [fetchVehicleType]);

  return (
    <>
      {isFetching && <LinearProgress />}
      <div className="CarSearch CarSearch--disabled">
        <Backdrop className="CarSearch CarSearch__backdrop"
          sx={{
            backgroundColor: '#00000024',
            position: 'absolute',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          // className="CarSearchForm__backdrop"
          open={isFetching}
          // onClick={handleClose}
        ></Backdrop>
        <Card sx={{ padding: '20px' }}>
          <CarSearchForm
            vehicleType={vehicleType}
            vehicleMake={vehicleMake}
            isFetching={isFetching}
          />
        </Card>
      </div>
    </>
  );
};

export default CarSearch;
