import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Layout from './components/Layout';
import theme from './assets/materialUI/customTheme';
import './style.css';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}
