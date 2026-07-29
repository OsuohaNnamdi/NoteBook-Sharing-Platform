import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { extractErrorMessage } from '../../lib/api';

const initialForm = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
  
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Registration failed. Please check your details and try again.'));
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
          <h1 className="auth-split-headline">Chat with classmates. Share your notes.</h1>
          <ul className="auth-split-points">
            <li>Chat and Notes access requested automatically</li>
            <li>An admin reviews and grants each request</li>
            <li>Track approval status from your dashboard</li>
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
          <h1 className="page-title">Create your account</h1>
          <p className="page-subtitle">
            Access to Chat and Notes is requested automatically — an admin reviews it after you sign up.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full name</label>
              <input required value={form.name} onChange={update('name')} placeholder="Alice Johnson" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={update('email')} placeholder="alice@example.com" />
            </div>
            <div className="field">
              <label>Phone (optional)</label>
              <input value={form.phone} onChange={update('phone')} placeholder="+2348012345678" />
            </div>
            <div className="field">
              <label>Password</label>
              <div className="field-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Min 12 characters, mixed case, digit, symbol"
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
            <div className="field">
              <label>Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
              />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading} type="submit">
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-a)', fontWeight: 700 }}>Log in</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
