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
import { useSelector } from 'react-redux';
import axios from 'axios';

// Icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description'; // Changed NotesIcon to DescriptionIcon
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language'; // New icon for currency

const expenseCategories = ['Travel', 'Food', 'Software', 'Office Supplies', 'Other'];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: 1, overflow: 'hidden',
  position: 'absolute', bottom: 0, left: 0, whiteSpace: 'nowrap', width: 1,
});

const ExpenseForm = () => {
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    amount: '',
    currency: user?.company?.defaultCurrency || 'USD',
    category: '',
    expenseDate: '',
    description: '',
  });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setCurrencies(Object.keys(response.data.rates).sort());
      } catch (err) {
        console.error("Failed to fetch currencies", err);
        setCurrencies(['USD', 'EUR', 'GBP', 'INR', 'JPY']); // Fallback currencies
      }
    };
    fetchCurrencies();
  }, []);
  
  useEffect(() => {
      if (user?.company?.defaultCurrency) {
          setFormData(prev => ({...prev, currency: user.company.defaultCurrency}));
      }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) { setReceipt(e.target.files[0]); }
  };
  
  const clearForm = () => {
    setFormData({ amount: '', currency: user?.company?.defaultCurrency || 'USD', category: '', expenseDate: '', description: '' });
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
    <Paper sx={{ p: 4, maxWidth: 900, margin: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
        New Expense Claim
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {success && 
            <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mb: 3 }}
                action={<IconButton size="small" onClick={() => setSuccess('')}><CloseIcon /></IconButton>}
            >
                {success}
            </Alert>
        }
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={4}> {/* Increased spacing for cleaner look */}
          
          {/* Left Column for Details */}
          <Grid item xs={12} md={7}>
            
            {/* Transaction Details Section */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>Transaction Details</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><AttachMoneyIcon color="action" /></InputAdornment>) }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="Currency" name="currency" value={formData.currency} onChange={handleChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><LanguageIcon color="action" /></InputAdornment>) }}>
                  {currencies.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
                </TextField>
              </Grid>
            </Grid>

            {/* Categorization Section */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>Categorization</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><CategoryIcon color="action" /></InputAdornment>) }}>
                  {expenseCategories.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Date of Expense" name="expenseDate" type="date" value={formData.expenseDate} onChange={handleChange} required InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: (<InputAdornment position="start"><EventIcon color="action" /></InputAdornment>) }} />
              </Grid>
            </Grid>

            {/* Context Section */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>Context</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" name="description" multiline rows={4} value={formData.description} onChange={handleChange} required InputProps={{ startAdornment: (<InputAdornment position="start" sx={{alignItems: 'flex-start', mt: 1.5}}><DescriptionIcon color="action" /></InputAdornment>) }} />
              </Grid>
            </Grid>
          </Grid>
          
          {/* Right Column for Receipt & Actions */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>Proof of Purchase</Typography>
            <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center', backgroundColor: '#fafafa', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', mb: 3 }}>
              <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mx: 'auto' }} />
              <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                {receipt ? `File selected: ${receipt.name}` : 'Drag & drop your receipt or click to upload'}
              </Typography>
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} size="small">
                Upload Receipt
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button variant="text" color="inherit" onClick={clearForm} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Submitting...' : 'Submit Claim'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ExpenseForm;