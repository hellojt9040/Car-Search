import React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

const Header = () => {
  return (
    // <div>
    <AppBar position="static" sx={{ marginBottom: '20px' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          align="center"
          sx={{ flexGrow: 1 }}
        >
          Car Search
        </Typography>
      </Toolbar>
    </AppBar>
    // </div>
  );
};

export default Header;
