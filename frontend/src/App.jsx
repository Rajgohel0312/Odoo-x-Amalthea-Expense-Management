import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// --- Import All Page Components ---
import LoginPage from './pages/Authentication/LoginPage';
import SignupPage from './pages/Authentication/SignupPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
// Employee Pages
import NewExpensePage from './pages/Expenses/NewExpensePage';
import MyExpensesPage from './pages/Expenses/MyExpensesPage';
// Manager Pages
import TeamApprovalsPage from './pages/Approvals/TeamApprovalsPage';
// Admin Pages
import ManageUsersPage from './pages/Admin/ManageUsersPage';
import ApprovalRulesPage from './pages/Admin/ApprovalRulesPage';
import AllExpensesPage from './pages/Admin/AllExpensesPage';

// Import the main layout wrapper
import PageWrapper from './components/Layout/PageWrapper';

// Helper component to protect routes that require authentication.
// It wraps pages that should only be visible to logged-in users.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Also check for the user object for session persistence during development
  const user = useSelector((state) => state.auth.user);

  if (!isAuthenticated && !user) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }
  // If authenticated, render the requested page within the main layout
  return <PageWrapper>{children}</PageWrapper>;
};

// This is the final and complete router for our application.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        {/* These routes are accessible to everyone and do not use the PageWrapper layout. */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* --- Protected Routes --- */}
        {/* Each of these routes uses the ProtectedRoute component. */}
        {/* This ensures the user is logged in and wraps the page in our standard layout. */}
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        
        {/* Employee Routes */}
        <Route path="/expenses/new" element={<ProtectedRoute><NewExpensePage /></ProtectedRoute>} />
        <Route path="/expenses/my" element={<ProtectedRoute><MyExpensesPage /></ProtectedRoute>} />
        
        {/* Manager Routes */}
        <Route path="/approvals/team" element={<ProtectedRoute><TeamApprovalsPage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/users" element={<ProtectedRoute><ManageUsersPage /></ProtectedRoute>} />
        <Route path="/admin/rules" element={<ProtectedRoute><ApprovalRulesPage /></ProtectedRoute>} />
        <Route path="/expenses/all" element={<ProtectedRoute><AllExpensesPage /></ProtectedRoute>} />

        {/* --- Fallback Route --- */}
        {/* If a user tries to access any other URL, they will be redirected to the dashboard. */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;