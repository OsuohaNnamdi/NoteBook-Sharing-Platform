import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const FEATURES = [
  {
    icon: '💬',
    title: 'Chat',
    description: 'Message classmates and course groups in real time, right alongside your notes.',
  },
  {
    icon: '📚',
    title: 'Notes',
    description: 'Browse and download shared course notes and past questions by course.',
  },
  {
    icon: '🛡️',
    title: 'Access control',
    description: 'Every service is opt-in. Admins review each request before it’s granted.',
  },
];

const STEPS = [
  { title: 'Create an account', description: 'Sign up with your email — access to Chat and Notes is requested automatically.' },
  { title: 'Get approved', description: 'An admin reviews your request and grants the access level you need.' },
  { title: 'Get studying', description: 'Log in once to chat with classmates and reach every shared note in one place.' },
];

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="brand">
          <span className="brand-mark">L</span>
          Learner
        </div>
        <div className="landing-nav-actions">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <Link to="/login" className="btn btn-secondary">Log in</Link>
          <Link to="/register" className="btn btn-primary">Get started</Link>
        </div>
      </nav>

      <header className="landing-hero">
        <span className="landing-badge">Built for students</span>
        <h1 className="landing-title">
          Chat with classmates. <span className="accent-text">Share your notes.</span>
        </h1>
        <p className="landing-subtitle">
          Learner is a chat and note-sharing platform for students — message your
          classmates and browse shared course notes and past questions, all in one place.
        </p>
        <div className="landing-hero-actions">
          <Link to="/register" className="btn btn-primary">Create your account</Link>
          <Link to="/login" className="btn btn-secondary">I already have one</Link>
        </div>
      </header>

      <section className="landing-section">
        <div className="landing-section-header">
          <span className="landing-eyebrow">What's inside</span>
          <h2 className="landing-section-title">Chat and notes. One dashboard.</h2>
          <p className="landing-section-subtitle">Request access to only what you need, when you need it.</p>
        </div>
        <div className="grid grid-cols-3">
          {FEATURES.map((f) => (
            <div className="card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="course-title">{f.title}</div>
              <p style={{ margin: '8px 0 0', color: 'var(--text-dim)', fontSize: 14 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-header">
          <span className="landing-eyebrow">How it works</span>
          <h2 className="landing-section-title">Up and running in three steps</h2>
        </div>
        <div className="landing-steps">
          {STEPS.map((step, i) => (
            <div className="landing-step" key={step.title}>
              <div className="landing-step-index">{i + 1}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{step.title}</div>
                <p style={{ margin: '4px 0 0', color: 'var(--text-dim)', fontSize: 14 }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800 }}>Ready to get bundled in?</h2>
        <p style={{ margin: '0 0 24px', opacity: 0.9 }}>It takes less than a minute to create an account.</p>
        <Link to="/register" className="btn landing-cta-btn">Create your account</Link>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} Learner. All rights reserved.
      </footer>
    </div>
  );
}
