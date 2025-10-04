import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import ApprovalRules from "./pages/admin/ApprovalRules";
import AllExpenses from "./pages/admin/AllExpenses";

import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerEmployeeApprovals from "./pages/manager/ManagerEmployeeApprovals";
import TeamExpenses from "./pages/manager/TeamExpenses";

import EmployeeDashboard from "./pages/employee/Dashboard";
import MyExpenses from "./pages/employee/MyExpenses";

import PrivateRoute from "./utils/PrivateRoute";

import "./App.css";
import PendingApprovals from "./pages/manager/PendingApprovals";
export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
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

        {/* Manager */}
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
              <PendingApprovals  />
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

        {/* Employee */}
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

        {/* Default */}
        <Route
          path="/"
          element={user ? <h1>Welcome {user.name}</h1> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}
