import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import Icons
import { Visibility, VisibilityOff } from '@mui/icons-material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessIcon from '@mui/icons-material/Business';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    country: null,
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([]);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
        const countryData = response.data.map(country => ({
          label: country.name.common,
          currency: Object.keys(country.currencies || {})[0] || 'USD',
        })).sort((a, b) => a.label.localeCompare(b.label));
        setCountries(countryData);
      } catch (err) {
        console.error("Failed to fetch countries", err);
        setError("Could not load country list. Please try again later.");
      } finally {
        setIsCountriesLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleCountryChange = (event, value) => {
    setFormData({ ...formData, country: value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Submitting Signup Data:', {
      ...formData,
      currency: formData.country?.currency, 
    });

    setTimeout(() => {
      console.log("Registration successful!");
      navigate('/login'); 
      setLoading(false);
    }, 2000);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0f2f7 0%, #b3e5fc 100%)' }}>
      <Card sx={{ maxWidth: 420, width: '100%', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <CardContent>
          <BusinessCenterIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Get started with your new expense management system.
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSignup} noValidate>
            <TextField fullWidth label="Full Name" name="fullName" variant="outlined" margin="normal" value={formData.fullName} onChange={handleChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon color="action" /></InputAdornment>)}} />
            <TextField fullWidth label="Company Name" name="companyName" variant="outlined" margin="normal" value={formData.companyName} onChange={handleChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment>)}} />
            <Autocomplete
                options={countries}
                loading={isCountriesLoading}
                onChange={handleCountryChange}
                getOptionLabel={(option) => option.label || ""}
                value={formData.country}
                renderInput={(params) => <TextField {...params} label="Country" variant="outlined" margin="normal" required InputProps={{...params.InputProps, endAdornment: (<>{isCountriesLoading ? <CircularProgress color="inherit" size={20} /> : null}{params.InputProps.endAdornment}</>)}}/>}
            />
            <TextField fullWidth label="Email Address" name="email" type="email" variant="outlined" margin="normal" value={formData.email} onChange={handleChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon color="action" /></InputAdornment>)}} />
            <TextField fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'} variant="outlined" margin="normal" value={formData.password} onChange={handleChange} required InputProps={{
                startAdornment: (<InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>),
                endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>)
            }} />
            
            <Button fullWidth variant="contained" type="submit" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} sx={{ p: 1.5, mt: 2 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link href="/login" variant="body2" color="secondary" sx={{ fontWeight: 'bold' }}>
              Log In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignupPage;