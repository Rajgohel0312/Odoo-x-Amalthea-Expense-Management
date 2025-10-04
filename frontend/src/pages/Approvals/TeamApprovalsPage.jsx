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
  Button,
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Chip
} from '@mui/material';
import { NavLink } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const pendingApprovals = [
  { id: 1, employeeName: 'John Doe', employeeAvatar: 'JD', submittedDate: '2025-10-03', description: 'Client Lunch Meeting', category: 'Food', amount: 120.00, currency: 'USD' },
  { id: 2, employeeName: 'Jane Smith', employeeAvatar: 'JS', submittedDate: '2025-10-01', description: 'Annual Software Subscription', category: 'Software', amount: 450.00, currency: 'USD' },
  { id: 3, employeeName: 'David Lee', employeeAvatar: 'DL', submittedDate: '2025-10-01', description: 'Taxi Fare for Airport Trip', category: 'Travel', amount: 75.50, currency: 'USD' },
  { id: 4, employeeName: 'Sarah Chen', employeeAvatar: 'SC', submittedDate: '2025-09-30', description: 'Office Supplies from Amazon', category: 'Office Supplies', amount: 99.09, currency: 'USD' },
];

const TeamApprovalsPage = () => {
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [open, setOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [action, setAction] = useState(null); 
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = (expense, actionType) => {
    setSelectedExpense(expense);
    setAction(actionType);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedExpense(null);
    setComment('');
    setAction(null);
  };

  const handleConfirmAction = () => {
    setLoading(true);
    console.log(`Performing action: ${action} on expense ID: ${selectedExpense.id} with comment: "${comment}"`);
    setTimeout(() => {
      setApprovals(approvals.filter(item => item.id !== selectedExpense.id));
      setLoading(false);
      handleClose();
    }, 1500);
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={NavLink} underline="hover" color="inherit" to="/">
          Dashboard
        </Link>
        <Typography color="text.primary">Team Approvals</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Pending Approval Queue
        </Typography>

        <TextField
          fullWidth
          label="Search by employee or description..."
          variant="outlined"
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Submitted On</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvals.map((expense) => (
                <TableRow key={expense.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                       <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>{expense.employeeAvatar}</Avatar>
                       {expense.employeeName}
                    </Box>
                  </TableCell>
                  <TableCell>{expense.submittedDate}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{expense.description}</TableCell>
                  <TableCell align="right">{`$${expense.amount.toFixed(2)} ${expense.currency}`}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                       <Button variant="outlined" color="success" size="small" onClick={() => handleOpen(expense, 'approve')} startIcon={<ThumbUpIcon />}>Approve</Button>
                       <Button variant="outlined" color="error" size="small" onClick={() => handleOpen(expense, 'reject')} startIcon={<ThumbDownIcon />}>Reject</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
            {action} Expense Claim
        </DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            You are about to {action} the expense claim from <strong>{selectedExpense?.employeeName}</strong> for <strong>${selectedExpense?.amount.toFixed(2)}</strong>.
          </DialogContentText>
          <Chip label={`Description: ${selectedExpense?.description}`} sx={{ mb: 2 }} />
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Add a Comment (Optional for Approve, Required for Reject)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained"
            color={action === 'approve' ? 'success' : 'error'}
            disabled={loading || (action === 'reject' && !comment)}
            startIcon={loading ? <CircularProgress size={20} color="inherit"/> : (action === 'approve' ? <CheckCircleIcon/> : <CancelIcon/>)}
          >
            {loading ? 'Processing...' : `Confirm ${action}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamApprovalsPage;