import { Outlet, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { Box } from "@mui/material";

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      {/* 🔸 Global Header / Logout */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        }}
      >
        <Box
          sx={{
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
            color: "#333333",
          }}
          onClick={() => navigate("/")}
        >
          Expense Management
        </Box>
        <LogoutButton variant="outlined" />
      </Box>

      {/* 🔸 Page Content */}
      <Box sx={{ p: 3 }}>
        <Outlet /> {/* <-- This renders child routes (like dashboards, etc.) */}
      </Box>
    </Box>
  );
}
