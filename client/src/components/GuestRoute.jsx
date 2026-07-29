import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

// Landing/login/register are for signed-out visitors only — bounce
// authenticated users straight into their workspace.
export default function GuestRoute({ children }) {
  const { user, initializing, isAdmin } = useAuth();

  if (initializing) return <Spinner fullPage />;
  if (user) return <Navigate to={isAdmin ? '/admin/access-requests' : '/dashboard'} replace />;
  return children;
}
