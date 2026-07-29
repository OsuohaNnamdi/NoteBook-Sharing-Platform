import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ICONS = {
  dashboard: '◧',
  chat: '💬',
  edutech: '🎓',
  users: '👥',
  requests: '📝',
};

function initialsOf(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export default function Layout() {
  const { user, isAdmin, hasAccess, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">L</span>
          Learner
        </div>

        <nav className="nav-group">
          <span className="nav-label">Workspace</span>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="nav-icon">{NAV_ICONS.dashboard}</span> Dashboard
          </NavLink>
          {hasAccess('CHAT', 'READ') && (
            <NavLink to="/chat" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon">{NAV_ICONS.chat}</span> Chat
            </NavLink>
          )}
          {hasAccess('EDUTECH', 'READ') && (
            <NavLink to="/edutech" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon">{NAV_ICONS.edutech}</span> Notes
            </NavLink>
          )}
        </nav>

        {isAdmin && (
          <nav className="nav-group">
            <span className="nav-label">Admin</span>
            <NavLink to="/admin/access-requests" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon">{NAV_ICONS.requests}</span> Access Requests
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon">{NAV_ICONS.users}</span> Users
            </NavLink>
          </nav>
        )}
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <div className="avatar" title={user?.email}>
            {initialsOf(user?.name) || 'U'}
          </div>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
