// frontend/src/routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login    from './components/Auth/Login';
import Register from './components/Auth/Register';

import Layout          from './components/Layout/Layout';
import Dashboard       from './components/Dashboard/Dashboard';
import WorkflowList    from './components/Workflows/WorkflowList';
import WorkflowForm    from './components/Workflows/WorkflowForm';
import WorkflowDetail  from './components/Workflows/WorkflowDetail';
import Profile         from './components/Profiles/Profile';

import PrivateRoute    from './components/Layout/PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected, wrapped in our responsive Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="workflows"       element={<WorkflowList />} />
        <Route path="workflows/new"   element={<WorkflowForm />} />
        <Route path="workflows/:id"   element={<WorkflowDetail />} />
        <Route path="profile"         element={<Profile />} />
        {/* you can add more nested routes here */}
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
