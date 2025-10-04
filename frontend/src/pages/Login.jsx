import React, { useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme"; // ✅ Use your theme.js directly

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);

      // Role-based redirect
      const role = res.data.user.role;
      if (role === "Admin") navigate("/admin");
      else if (role === "Manager") navigate("/manager");
      else navigate("/employee");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      if (msg === "Account not approved yet") {
        setError("Your account is still pending approval. Please wait for Admin.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0f2f7 0%, #b3e5fc 100%)",
        }}
      >
        <Card
          sx={{
            maxWidth: 400,
            width: "100%",
            p: 3,
            borderRadius: theme.shape.borderRadius,
            textAlign: "center",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <CardContent>
            <BusinessCenterIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h5" component="h1" gutterBottom color="primary">
              Welcome Back!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to continue to Expense Management
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
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
                type={showPassword ? "text" : "password"}
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
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, mb: 2 }}>
                <Link href="/forgot-password" variant="body2" color="primary">
                  Forgot password?
                </Link>
              </Box>

              {/* ✅ Button now uses your theme's default styling */}
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ p: 1.5, mt: 2 }}
              >
                {loading ? "Signing In..." : "Login"}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ mt: 3 }}>
              Don't have an account?{" "}
              <Link href="/signup" variant="body2" color="secondary" sx={{ fontWeight: "bold" }}>
                Sign Up
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
