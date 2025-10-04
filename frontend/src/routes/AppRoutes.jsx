import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import PageWrapper from '../components/Layout/PageWrapper';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageWrapper>
            <DashboardPage />
          </PageWrapper>
        }
      />
    </Routes>
  );
};

export default AppRoutes;