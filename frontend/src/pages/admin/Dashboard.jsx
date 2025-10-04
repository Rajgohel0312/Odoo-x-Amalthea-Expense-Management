import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  ButtonBase,
  useTheme,
  Divider,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import RuleIcon from "@mui/icons-material/Rule";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const usersRes = await api.get("/users");
      const expensesRes = await api.get("/admin/expenses");

      const approved = expensesRes.data.filter(
        (e) => e.status === "Approved"
      ).length;
      const rejected = expensesRes.data.filter(
        (e) => e.status === "Rejected"
      ).length;
      const pending = expensesRes.data.filter(
        (e) => e.status === "Waiting"
      ).length;

      setStats({
        users: usersRes.data.length,
        expenses: {
          total: expensesRes.data.length,
          approved,
          rejected,
          pending,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        bgcolor="#f8f9fa"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #333333, #6c757d)",
          color: "white",
          borderRadius: "0 0 20px 20px",
          px: { xs: 3, md: 6 },
          py: { xs: 6, md: 8 },
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mb: 1, fontFamily: "Helvetica" }}
        >
          Welcome Back, Admin 👋
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Manage users, monitor expenses, and control approval workflows — all in one place.
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Box sx={{ p: { xs: 3, md: 6 } }}>
        <Typography
          variant="h5"
          fontWeight={700}
          mb={3}
          color="#333333"
          sx={{ fontFamily: "Helvetica" }}
        >
          Overview
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              icon={<PeopleIcon sx={{ color: "#007bff" }} />}
              title="Users"
              value={stats.users}
              gradient="linear-gradient(135deg, #e3f2fd, #bbdefb)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              icon={<ReceiptLongIcon sx={{ color: "#6c757d" }} />}
              title="Total Expenses"
              value={stats.expenses.total}
              gradient="linear-gradient(135deg, #f8f9fa, #e9ecef)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              icon={<CheckCircleIcon sx={{ color: "#28a745" }} />}
              title="Approved"
              value={stats.expenses.approved}
              gradient="linear-gradient(135deg, #e8f5e9, #c8e6c9)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              icon={<CancelIcon sx={{ color: "#dc3545" }} />}
              title="Rejected"
              value={stats.expenses.rejected}
              gradient="linear-gradient(135deg, #fdecea, #f8d7da)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              icon={<HourglassBottomIcon sx={{ color: "#ff9800" }} />}
              title="Pending"
              value={stats.expenses.pending}
              gradient="linear-gradient(135deg, #fff8e1, #ffecb3)"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* Quick Access */}
        <Typography
          variant="h5"
          fontWeight={700}
          mb={3}
          color="#333333"
          sx={{ fontFamily: "Helvetica" }}
        >
          Quick Access
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <QuickLinkCard
              title="User Management"
              description="Create, update, and assign roles."
              icon={<SettingsIcon fontSize="large" sx={{ color: "#007bff" }} />}
              onClick={() => navigate("/admin/users")}
              hoverColor="#e3f2fd"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <QuickLinkCard
              title="Approval Rules"
              description="Define workflows & conditional approvals."
              icon={<RuleIcon fontSize="large" sx={{ color: "#28a745" }} />}
              onClick={() => navigate("/admin/rules")}
              hoverColor="#e8f5e9"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <QuickLinkCard
              title="All Expenses"
              description="View & override employee claims."
              icon={
                <DashboardCustomizeIcon
                  fontSize="large"
                  sx={{ color: "#6c757d" }}
                />
              }
              onClick={() => navigate("/admin/expenses")}
              hoverColor="#f8f9fa"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

/* 🌟 Animated Stat Card */
function MotionCard({ icon, title, value, gradient }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Card
        sx={{
          borderRadius: 4,
          background: gradient,
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          p: 2.5,
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ fontSize: 32 }}>{icon}</Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* 🌟 Quick Access Card */
function QuickLinkCard({ title, description, icon, onClick, hoverColor }) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.03 }} transition={{ duration: 0.3 }}>
      <ButtonBase
        onClick={onClick}
        sx={{
          width: "100%",
          borderRadius: 4,
          textAlign: "left",
        }}
      >
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            width: "100%",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: hoverColor,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            },
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            {icon}
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Card>
      </ButtonBase>
    </motion.div>
  );
}
