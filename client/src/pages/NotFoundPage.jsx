import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="auth-screen">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 className="page-title">404</h1>
        <p className="page-subtitle">That page doesn't exist.</p>
        <Link className="btn btn-primary" to="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
