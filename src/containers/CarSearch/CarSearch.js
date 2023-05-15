import React, { useEffect, useCallback, useState } from 'react';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Backdrop from '@mui/material/Backdrop';
import CarSearchForm from '../CarSearchForm';
import Table from '../../components/Table';
import { ROWDATA } from '../../constants/constants';
import './CarSearch.scss';

const CarSearch = () => {
  const [vehicleType, setVehicleType] = useState();
  const [vehicleMake, setVehicleMake] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [vehicleSearchData, setVehicleSearchData] = useState();
  const fetchVehicleType = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        'https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablevalueslist/vehicle%20type?format=json'
      );
      const data = await response.json();
      const VehicleTypesData = {
        ...data,
        Results: data.Results?.map((el) => ({
          ...el,
          id: el.Id,
          name: el.Name,
        })),
      };
      setVehicleType(VehicleTypesData);
      console.log('vehicle type', VehicleTypesData);
    } catch (e) {
      console.log(e);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const fetchVehicleMake = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
      );
      const data = await response.json();
      const VehicleMakesData = {
        ...data,
        Results: data.Results?.map((el) => ({
          ...el,
          id: el.MakeId,
          name: el.MakeName,
        })),
      };
      setVehicleMake(VehicleMakesData);
      console.log('vehicle make', VehicleMakesData);
    } catch (e) {
      console.log(e);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // fetch masters data
  useEffect(() => {
    fetchVehicleType();
    fetchVehicleMake();
  }, [fetchVehicleType, fetchVehicleMake]);
  // console.log('constants', ROWDATA);
  return (
    <>
      {isFetching && <LinearProgress />}
      <div className="CarSearch CarSearch--disabled">
        <Backdrop
          className="CarSearch CarSearch__backdrop"
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
            setIsFetching={setIsFetching}
            setVehicleSearchData={setVehicleSearchData}
          />
        </Card>
        {!!vehicleSearchData?.length && <Card sx={{ padding: '20px', my: 2 }}>
          <Table rowData={ROWDATA} tableData={vehicleSearchData} />
        </Card>}
      </div>
    </>
  );
};

export default CarSearch;
