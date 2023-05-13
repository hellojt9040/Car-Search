import React from 'react';
import Card from '@mui/material/Card';
import CarSearchForm from '../CarSearchForm';
import './CarSearch.css';

const CarSearch = () => {
  return (
    <div className="CarSearch">
      <Card sx={{ padding: '20px' }}>
        <CarSearchForm />
      </Card>
    </div>
  );
};

export default CarSearch;
