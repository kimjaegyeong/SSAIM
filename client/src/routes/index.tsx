// routes/index.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from '../pages/mainPage/MainPage';
import ProjectListPage from '../pages/project/ProjectListPage';
import MainLayout from '../components/mainLayout/MainLayout';
const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<MainPage />} />
      <Route path="/project" element={<ProjectListPage />}></Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default AppRoutes;
