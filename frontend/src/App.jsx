import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./utils/PrivateRoute";

// Layout
import AppLayout from "./components/AppLayout";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import ApprovalRules from "./pages/admin/ApprovalRules";
import AllExpenses from "./pages/admin/AllExpenses";

// Manager
import ManagerDashboard from "./pages/manager/Dashboard";
import PendingApprovals from "./pages/manager/PendingApprovals";
import TeamExpenses from "./pages/manager/TeamExpenses";

// Employee
import EmployeeDashboard from "./pages/employee/Dashboard";
import MyExpenses from "./pages/employee/MyExpenses";
import ExpenseFormPage from "./pages/employee/ExpenseFormPage";

import "./App.css";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <BrowserRouter>
        <Routes>
          {/* 🔓 Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 🔐 Protected Routes (Common Layout with Logout) */}
          <Route element={<AppLayout />}>
            {/* --- Admin --- */}
            <Route
              path="/admin"
              element={
                <PrivateRoute roles={["Admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute roles={["Admin"]}>
                  <Users />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/rules"
              element={
                <PrivateRoute roles={["Admin"]}>
                  <ApprovalRules />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/expenses"
              element={
                <PrivateRoute roles={["Admin"]}>
                  <AllExpenses />
                </PrivateRoute>
              }
            />

            {/* --- Manager --- */}
            <Route
              path="/manager"
              element={
                <PrivateRoute roles={["Manager"]}>
                  <ManagerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/manager/approvals"
              element={
                <PrivateRoute roles={["Manager"]}>
                  <PendingApprovals />
                </PrivateRoute>
              }
            />
            <Route
              path="/manager/team"
              element={
                <PrivateRoute roles={["Manager"]}>
                  <TeamExpenses />
                </PrivateRoute>
              }
            />

            {/* --- Employee --- */}
            <Route
              path="/employee"
              element={
                <PrivateRoute roles={["Employee"]}>
                  <EmployeeDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/employee/my-expenses"
              element={
                <PrivateRoute roles={["Employee"]}>
                  <MyExpenses />
                </PrivateRoute>
              }
            />
            <Route
              path="/employee/new-expense"
              element={
                <PrivateRoute roles={["Employee"]}>
                  <ExpenseFormPage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
