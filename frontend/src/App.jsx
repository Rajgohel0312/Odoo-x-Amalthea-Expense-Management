import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// --- Import All Page Components ---
import LandingPage from './pages/Public/LandingPage';
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

// --- UPDATED ProtectedRoute Component ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated && !user) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Optional: Role-based authorization
  // If allowedRoles are specified and the user's role is not included, redirect
  // (You can uncomment and implement this once roles are fully defined and needed for specific routes)
  /*
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; // Or to dashboard with a message
  }
  */

  // If authenticated, render the children wrapped in PageWrapper
  return <PageWrapper>{children}</PageWrapper>;
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes (and redirection for authenticated users) --- */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
        />

        {/* --- Protected Routes (require authentication and use the layout) --- */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/expenses/new" element={<ProtectedRoute><NewExpensePage /></ProtectedRoute>} />
        <Route path="/expenses/my" element={<ProtectedRoute><MyExpensesPage /></ProtectedRoute>} />
        <Route path="/approvals/team" element={<ProtectedRoute><TeamApprovalsPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><ManageUsersPage /></ProtectedRoute>} />
        <Route path="/admin/rules" element={<ProtectedRoute><ApprovalRulesPage /></ProtectedRoute>} />
        <Route path="/expenses/all" element={<ProtectedRoute><AllExpensesPage /></ProtectedRoute>} />

        {/* --- Fallback Route --- */}
        {/* For any unmatched path, redirect unauthenticated users to landing, authenticated to dashboard */}
        <Route 
          path="*" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;