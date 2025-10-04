import React from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const PageWrapper = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Header />

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3, 
          backgroundColor: 'background.default', 
          width: '100%',
        }}
      >
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
};

export default PageWrapper;