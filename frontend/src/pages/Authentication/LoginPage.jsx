import React, { useState } from 'react';
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
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../features/authentication/authSlice';

// Import Icons
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@amalthea.com' && password === 'password') {
        const mockUserData = {
          user: { name: 'Ankit Sharma', email: 'admin@amalthea.com', role: 'ADMIN' },
          token: 'mock-jwt-token-string',
        };
        // Dispatch the loginSuccess action to update the Redux store
        dispatch(loginSuccess(mockUserData));
        // Navigate to the main dashboard page
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0f2f7 0%, #b3e5fc 100%)' }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <CardContent>
          <BusinessCenterIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to continue to Amalthea Expense Management
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
              <Link href="#" variant="body2" color="primary">
                Forgot password?
              </Link>
            </Box>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ p: 1.5, mt: 2 }}
            >
              {loading ? 'Signing In...' : 'Login'}
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 3 }}>
            Don't have an account?{' '}
            <Link href="/signup" variant="body2" color="secondary" sx={{ fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;