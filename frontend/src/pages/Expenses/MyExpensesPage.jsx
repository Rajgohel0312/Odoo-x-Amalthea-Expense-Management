import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import { NavLink } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const allMyExpenses = [
  { id: 1, submittedDate: '2025-10-03', expenseDate: '2025-10-01', description: 'Client Lunch Meeting', category: 'Food', amount: 120.00, currency: 'USD', status: 'Pending' },
  { id: 2, submittedDate: '2025-10-01', expenseDate: '2025-09-29', description: 'Annual Software Subscription', category: 'Software', amount: 450.00, currency: 'USD', status: 'Pending' },
  { id: 3, submittedDate: '2025-09-28', expenseDate: '2025-09-28', description: 'Dinner with Sales Team', category: 'Food', amount: 215.50, currency: 'USD', status: 'Approved' },
  { id: 4, submittedDate: '2025-09-25', expenseDate: '2025-09-24', description: 'Keyboards and Mice for new hires', category: 'Office Supplies', amount: 99.09, currency: 'USD', status: 'Approved' },
  { id: 5, submittedDate: '2025-09-22', expenseDate: '2025-09-20', description: 'Flight to New York Conference', category: 'Travel', amount: 850.00, currency: 'USD', status: 'Approved' },
  { id: 6, submittedDate: '2025-09-20', expenseDate: '2025-09-18', description: 'Taxi from airport to hotel', category: 'Travel', amount: 65.00, currency: 'USD', status: 'Rejected' },
  { id: 7, submittedDate: '2025-09-15', expenseDate: '2025-09-15', description: 'Coffee for the team', category: 'Food', amount: 25.00, currency: 'USD', status: 'Approved' },
];

const getStatusChipColor = (status) => {
  switch (status) {
    case 'Approved': return 'success';
    case 'Pending': return 'warning';
    case 'Rejected': return 'error';
    default: return 'default';
  }
};

const MyExpensesPage = () => {
  const [expenses, setExpenses] = useState(allMyExpenses);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterAndSearch = () => {
    let filtered = allMyExpenses;

    if (statusFilter !== 'All') {
      filtered = filtered.filter(expense => expense.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setExpenses(filtered);
  };

  React.useEffect(() => {
    handleFilterAndSearch();
  }, [statusFilter, searchTerm]);

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={NavLink} underline="hover" color="inherit" to="/">
          Dashboard
        </Link>
        <Typography color="text.primary">My Expenses</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Expense History
        </Typography>

        {/* Filter and Search Controls */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search by description..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Expenses Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Submitted On</TableCell>
                <TableCell>Expense Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <TableRow key={expense.id} hover>
                    <TableCell>{expense.submittedDate}</TableCell>
                    <TableCell>{expense.expenseDate}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell align="right">{`$${expense.amount.toFixed(2)} ${expense.currency}`}</TableCell>
                    <TableCell align="center">
                      <Chip label={expense.status} color={getStatusChipColor(expense.status)} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography sx={{ p: 4 }}>No expenses found that match your criteria.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default MyExpensesPage;