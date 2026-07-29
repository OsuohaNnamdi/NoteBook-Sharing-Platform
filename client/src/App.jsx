import React from 'react';
import { Route, HashRouter, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AccessRequestsPage from './pages/admin/AccessRequestsPage';
import UsersPage from './pages/admin/UsersPage';
import ChatPage from './pages/chat/ChatPage';
import CoursesPage from './pages/edutech/CoursesPage';
import CourseDetailPage from './pages/edutech/CourseDetailPage';
import AdminCourseFormPage from './pages/edutech/AdminCourseFormPage';
import PastQuestionsPage from './pages/edutech/PastQuestionsPage';
import NotFoundPage from './pages/NotFoundPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GuestRoute><HomePage /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route
          path="/chat"
          element={
            <ProtectedRoute requireService={{ service: 'CHAT', level: 'READ' }}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edutech"
          element={
            <ProtectedRoute requireService={{ service: 'EDUTECH', level: 'READ' }}>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edutech/past-questions"
          element={
            <ProtectedRoute requireService={{ service: 'EDUTECH', level: 'READ' }}>
              <PastQuestionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edutech/new"
          element={
            <ProtectedRoute requireAdmin>
              <AdminCourseFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edutech/:id"
          element={
            <ProtectedRoute requireService={{ service: 'EDUTECH', level: 'READ' }}>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/access-requests"
          element={
            <ProtectedRoute requireAdmin>
              <AccessRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin>
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
}
