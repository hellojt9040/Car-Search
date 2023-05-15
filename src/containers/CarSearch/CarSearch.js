import React, { useEffect, useCallback, useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
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
  const [isError, setError] = useState();

  const fetchVehicleType = useCallback(async () => {
    try {
      setIsFetching(true);
      setError(null);
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
    } catch (e) {
      setError(e);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const fetchVehicleMake = useCallback(async (vehicleTypeSelected) => {
    if (!vehicleTypeSelected) return;

    try {
      setIsFetching(true);
      setError(null);
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${vehicleTypeSelected}?format=json`
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
    } catch (e) {
      setError(e);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // fetch masters data
  useEffect(() => {
    fetchVehicleType();
  }, [fetchVehicleType, fetchVehicleMake]);
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
          open={isFetching}
        ></Backdrop>
        <Card sx={{ padding: '20px' }}>
          <CarSearchForm
            vehicleType={vehicleType}
            vehicleMake={vehicleMake}
            fetchVehicleMake={fetchVehicleMake}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
            setVehicleSearchData={setVehicleSearchData}
            setError={setError}
          />
        </Card>
        {!!vehicleSearchData?.length && (
          <Card sx={{ padding: '20px', my: 2 }}>
            <Table rowData={ROWDATA} tableData={vehicleSearchData} />
          </Card>
        )}
        {!!isError && (
          <Typography variant="h5" align="center" component="h5" className="CarSearch__error">
            Something went wrong
          </Typography>
        )}
        {!isFetching &&
          !isError &&
          !!vehicleSearchData &&
          !vehicleSearchData.length && (
            <Card sx={{ padding: '20px', my: 2 }}>
              <Typography variant="h4" align="center" component="h2">
                No results found
              </Typography>
            </Card>
          )}
      </div>
    </>
  );
};

export default CarSearch;
