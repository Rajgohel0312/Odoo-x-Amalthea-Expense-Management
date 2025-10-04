import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Button,
  Avatar,
  Autocomplete
} from '@mui/material';
import { NavLink } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';

const allCompanyExpenses = [
  { id: 1, employee: { name: 'John Doe', avatar: 'JD' }, submittedDate: '2025-10-03', description: 'Client Lunch Meeting', category: 'Food', amount: 120.00, status: 'Pending' },
  { id: 2, employee: { name: 'Jane Smith', avatar: 'JS' }, submittedDate: '2025-10-01', description: 'Annual Software Subscription', category: 'Software', amount: 450.00, status: 'Pending' },
  { id: 3, employee: { name: 'Priya Patel', avatar: 'PP' }, submittedDate: '2025-09-28', description: 'Dinner with Sales Team', category: 'Food', amount: 215.50, status: 'Approved' },
  { id: 4, employee: { name: 'John Doe', avatar: 'JD' }, submittedDate: '2025-09-25', description: 'Keyboards and Mice', category: 'Office Supplies', amount: 99.09, status: 'Approved' },
  { id: 5, employee: { name: 'Ravi Kumar', avatar: 'RK' }, submittedDate: '2025-09-22', description: 'Flight to New York Conference', category: 'Travel', amount: 850.00, status: 'Approved' },
  { id: 6, employee: { name: 'Jane Smith', avatar: 'JS' }, submittedDate: '2025-09-20', description: 'Taxi from airport', category: 'Travel', amount: 65.00, status: 'Rejected' },
];

const getStatusChipColor = (status) => {
  if (status === 'Approved') return 'success';
  if (status === 'Pending') return 'warning';
  if (status === 'Rejected') return 'error';
  return 'default';
};

const AllExpensesPage = () => {
  const [filters, setFilters] = useState({
    employee: null,
    status: 'All',
    category: 'All',
  });

  const employees = [...new Set(allCompanyExpenses.map(e => e.employee.name))];
  const categories = [...new Set(allCompanyExpenses.map(e => e.category))];

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredExpenses = useMemo(() => {
    return allCompanyExpenses.filter(expense => {
      const employeeMatch = !filters.employee || expense.employee.name === filters.employee;
      const statusMatch = filters.status === 'All' || expense.status === filters.status;
      const categoryMatch = filters.category === 'All' || expense.category === filters.category;
      return employeeMatch && statusMatch && categoryMatch;
    });
  }, [filters]);

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={NavLink} underline="hover" color="inherit" to="/">Dashboard</Link>
        <Typography color="text.primary">All Expenses</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">Company Expense Report</Typography>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
                Export Report
            </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
                <Autocomplete
                    options={employees}
                    onChange={(event, newValue) => handleFilterChange('employee', newValue)}
                    renderInput={(params) => <TextField {...params} label="Filter by Employee" variant="outlined" />}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField select fullWidth label="Filter by Status" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                    <MenuItem value="All">All Statuses</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField select fullWidth label="Filter by Category" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                    <MenuItem value="All">All Categories</MenuItem>
                    {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>
            </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead><TableRow>
                <TableCell>Employee</TableCell><TableCell>Submitted On</TableCell>
                <TableCell>Description</TableCell><TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell><TableCell align="center">Status</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} hover>
                    <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>{expense.employee.avatar}</Avatar>
                        {expense.employee.name}
                    </Box></TableCell>
                    <TableCell>{expense.submittedDate}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell align="right">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell align="center"><Chip label={expense.status} color={getStatusChipColor(expense.status)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AllExpensesPage;