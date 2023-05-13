import React from 'react';
import Header from '../Header';
import CarSearch from '../../containers/CarSearch';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <CarSearch />
      </main>
    </>
  );
};

export default Layout;
