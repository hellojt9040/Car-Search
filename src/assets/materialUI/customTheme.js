import { createTheme } from '@mui/material/styles';

export const themeOptions = {
  palette: {
    type: 'light',
    primary: {
        main: '#f7ae25',
        dark: '#f19d12',
        light: '#f7bb4b',
    },
    secondary: {
      main: '#5da900',
    },
  },
  typography:{
      htmlFontSize:18,
      fontSize:14
  }
};

const theme = createTheme(themeOptions);

export default theme;