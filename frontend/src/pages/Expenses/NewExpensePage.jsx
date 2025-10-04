import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import ExpenseForm from '../../features/expenses/ExpenseForm'; 

const NewExpensePage = () => {
  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={NavLink} underline="hover" color="inherit" to="/">
          Dashboard
        </Link>
        <Typography color="text.primary">New Expense</Typography>
      </Breadcrumbs>

      <ExpenseForm />
    </Box>
  );
};

export default NewExpensePage;