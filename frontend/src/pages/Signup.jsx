import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    country: "",
    currency: "",
  });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Fetch countries and currencies on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies");
        const data = await res.json();

        // Transform to simplified format
        const formatted = data
          .filter((c) => c.name?.common && c.currencies)
          .map((c) => {
            const currencyCode = Object.keys(c.currencies)[0];
            const currencyName = c.currencies[currencyCode]?.name;
            return {
              name: c.name.common,
              code: currencyCode,
              currency: currencyName,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formatted);
      } catch (err) {
        console.error("Failed to load countries:", err);
      }
    };

    fetchCountries();
  }, []);

  // Update currency when country changes
  useEffect(() => {
    const selected = countries.find((c) => c.name === form.country);
    if (selected) {
      setForm((prev) => ({ ...prev, currency: `${selected.code} - ${selected.currency}` }));
    }
  }, [form.country, countries]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/signup", form);
      login(res.data);
      alert("Signup successful!");
      const role = res.data.user.role;
      if (role === "Admin") navigate("/admin");
      else if (role === "Manager") navigate("/manager");
      else navigate("/employee");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
            maxWidth: 450,
            width: "100%",
            p: 3,
            borderRadius: theme.shape.borderRadius,
            textAlign: "center",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <CardContent>
            <BusinessCenterIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h5" gutterBottom color="primary">
              Create Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sign up to get started with Amalthea Expense Management
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                margin="normal"
                value={form.name}
                onChange={handleChange}
                required
              />
              <TextField
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                value={form.email}
                onChange={handleChange}
                required
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={form.password}
                onChange={handleChange}
                required
              />
              <TextField
                name="companyName"
                label="Company Name"
                fullWidth
                margin="normal"
                value={form.companyName}
                onChange={handleChange}
                required
              />
              <TextField
                name="country"
                label="Select Country"
                select
                fullWidth
                margin="normal"
                value={form.country}
                onChange={handleChange}
                required
              >
                {countries.length > 0 ? (
                  countries.map((c) => (
                    <MenuItem key={c.name} value={c.name}>
                      {c.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading countries...</MenuItem>
                )}
              </TextField>

              <TextField
                name="currency"
                label="Currency"
                fullWidth
                margin="normal"
                value={form.currency}
                InputProps={{ readOnly: true }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ mt: 2, p: 1.5 }}
              >
                {loading ? "Signing Up..." : "Signup"}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ mt: 3 }}>
              Already have an account?{" "}
              <a
                href="/login"
                style={{ color: theme.palette.secondary.main, fontWeight: 600 }}
              >
                Login
              </a>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
