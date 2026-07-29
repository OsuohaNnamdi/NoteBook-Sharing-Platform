import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

// requireAdmin: only ADMIN role may pass.
// requireService: { service: 'CHAT' | 'EDUTECH', level: 'READ' | 'WRITE' } — user
// must hold a satisfying grant (admins bypass automatically).
export default function ProtectedRoute({ children, requireAdmin, requireService }) {
  const { user, initializing, isAdmin, hasAccess } = useAuth();
  const location = useLocation();

  if (initializing) return <Spinner fullPage />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (requireService && !hasAccess(requireService.service, requireService.level)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
