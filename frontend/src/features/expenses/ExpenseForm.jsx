import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import EventIcon from '@mui/icons-material/Event';
import NotesIcon from '@mui/icons-material/Notes';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

const expenseCategories = ['Travel', 'Food', 'Software', 'Office Supplies', 'Other'];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    category: '',
    expenseDate: '',
    description: '',
  });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currencies, setCurrencies] = useState(['USD']);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setCurrencies(Object.keys(response.data.rates).sort());
      } catch (err) {
        console.error("Failed to fetch currencies", err);
        setCurrencies(['USD', 'EUR', 'GBP', 'INR', 'JPY']);
      }
    };
    fetchCurrencies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setReceipt(e.target.files[0]);
      console.log("Receipt uploaded:", e.target.files[0].name);
    }
  };
  
  const clearForm = () => {
    setFormData({ amount: '', currency: 'USD', category: '', expenseDate: '', description: '' });
    setReceipt(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Submitting Expense:', { ...formData, receiptName: receipt?.name });

    setTimeout(() => {
      setSuccess('Expense claim submitted successfully!');
      setLoading(false);
      clearForm();
    }, 2000);
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        New Expense Claim
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {success && 
            <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mb: 2 }}
                action={<IconButton size="small" onClick={() => setSuccess('')}><CloseIcon /></IconButton>}
            >
                {success}
            </Alert>
        }
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              InputProps={{ startAdornment: (<InputAdornment position="start"><AttachMoneyIcon color="action" /></InputAdornment>) }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
            >
              {currencies.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              InputProps={{ startAdornment: (<InputAdornment position="start"><CategoryIcon color="action" /></InputAdornment>) }}
            >
              {expenseCategories.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Expense"
              name="expenseDate"
              type="date"
              value={formData.expenseDate}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><EventIcon color="action" /></InputAdornment>) }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              InputProps={{ startAdornment: (<InputAdornment position="start" sx={{alignItems: 'flex-start', mt: 1.5}}><NotesIcon color="action" /></InputAdornment>) }}
            />
          </Grid>
          <Grid item xs={12}>
              <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center', backgroundColor: '#fafafa' }}>
                  <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                    {receipt ? `File selected: ${receipt.name}` : 'Drag & drop a receipt here, or click to upload'}
                  </Typography>
                  <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                      Upload Receipt
                      <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                  </Button>
              </Box>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="text" color="inherit" onClick={clearForm} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ p: '10px 24px' }}
            >
              {loading ? 'Submitting...' : 'Submit Claim'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ExpenseForm;