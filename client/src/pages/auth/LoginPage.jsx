import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { extractErrorMessage } from '../../lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      const from = location.state?.from?.pathname;
      navigate(from || (user.role === 'ADMIN' ? '/admin/access-requests' : '/dashboard'), { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-screen">
      <aside className="auth-split-brand">
        <Link to="/" className="auth-logo" style={{ marginBottom: 0 }}>
          <span className="brand-mark">L</span>
          <strong style={{ fontSize: 18 }}>Learner</strong>
        </Link>

        <div>
          <h1 className="auth-split-headline">Welcome back to your notes and chats.</h1>
          <ul className="auth-split-points">
            <li>Pick up conversations right where you left them</li>
            <li>Jump straight into your shared notes and past questions</li>
            <li>See the status of any pending access requests</li>
          </ul>
        </div>

        <p className="auth-split-footnote">Learner — chat and note sharing for students.</p>
      </aside>

      <section className="auth-split-form-side">
        <div className="auth-card auth-card--flat">
          <div className="auth-logo auth-logo--mobile-only">
            <span className="brand-mark">L</span>
            <strong style={{ fontSize: 18 }}>Learner</strong>
          </div>
          <h1 className="page-title">Log in</h1>
          <p className="page-subtitle">Access your chat and notes.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={update('email')} placeholder="you@example.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <div className="field-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={update('password')}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className="field-toggle-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button className="btn btn-primary btn-block" disabled={loading} type="submit">
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent-a)', fontWeight: 700 }}>Register</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
