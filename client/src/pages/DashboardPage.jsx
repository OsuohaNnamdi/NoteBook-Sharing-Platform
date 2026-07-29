import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { extractErrorMessage } from '../lib/api';
import StatusPill from '../components/StatusPill';

const SERVICES = [
  { key: 'CHAT', label: 'Chat', level: 'WRITE', description: 'Message other users in real time.', path: '/chat' },
  { key: 'EDUTECH', label: 'Notes', level: 'READ', description: 'Browse and download shared course notes and past questions.', path: '/edutech' },
];

export default function DashboardPage() {
  const { user, requests, hasAccess, requestStatusFor, refreshAccessState } = useAuth();
  const [busyService, setBusyService] = useState(null);
  const [error, setError] = useState('');

  const requestAccess = async (service, level) => {
    setError('');
    setBusyService(service);
    try {
      await userApi.requestAccess({ service, requestedLevel: level, reason: 'Requested from dashboard.' });
      await refreshAccessState();
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not submit the access request.'));
    } finally {
      setBusyService(null);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
      <p className="page-subtitle">Here's the status of your bundled services.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid grid-cols-2">
        {SERVICES.map((svc) => {
          const status = requestStatusFor(svc.key);
          const granted = hasAccess(svc.key, 'READ');

          return (
            <div className="card" key={svc.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="course-tag">{svc.label}</div>
                  <p style={{ margin: '6px 0 0', color: 'var(--text-dim)', fontSize: 14 }}>{svc.description}</p>
                </div>
                {status && <StatusPill status={status} />}
              </div>

              <div style={{ marginTop: 18 }}>
                {granted ? (
                  <Link to={svc.path} className="btn btn-primary">
                    Open {svc.label}
                  </Link>
                ) : status === 'PENDING' ? (
                  <button className="btn btn-secondary" disabled>
                    Awaiting admin approval…
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    disabled={busyService === svc.key}
                    onClick={() => requestAccess(svc.key, svc.level)}
                  >
                    {busyService === svc.key ? 'Requesting…' : status === 'REJECTED' ? 'Request again' : 'Request access'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="course-tag">Your requests</div>
        {requests.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>No access requests yet.</p>
        ) : (
          <table className="table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>Service</th>
                <th>Level</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.service}</td>
                  <td>{r.requestedLevel}</td>
                  <td><StatusPill status={r.status} /></td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
