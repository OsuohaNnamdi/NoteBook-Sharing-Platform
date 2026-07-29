import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { extractErrorMessage } from '../../lib/api';
import StatusPill from '../../components/StatusPill';
import Spinner from '../../components/Spinner';

export default function AccessRequestsPage() {
  const [requestsPage, setRequestsPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [decidingId, setDecidingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.pendingRequests(0, 50);
      setRequestsPage(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load access requests.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (id, decision) => {
    setDecidingId(id);
    setError('');
    try {
      await adminApi.decideRequest(id, decision);
      setRequestsPage((prev) => ({ ...prev, content: prev.content.filter((r) => r.id !== id) }));
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not record that decision.'));
    } finally {
      setDecidingId(null);
    }
  };

  if (loading) return <Spinner fullPage />;

  const pending = requestsPage?.content ?? [];

  return (
    <div className="page">
      <h1 className="page-title">Access requests</h1>
      <p className="page-subtitle">Approve or reject pending requests for Chat and Notes access.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {pending.length === 0 ? (
          <div className="empty-state">No pending requests right now.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Service</th>
                <th>Level</th>
                <th>Reason</th>
                <th>Submitted</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((r) => (
                <tr key={r.id}>
                  <td>{r.userEmail}</td>
                  <td>{r.service}</td>
                  <td>{r.requestedLevel}</td>
                  <td style={{ maxWidth: 220 }}>{r.reason || '—'}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td><StatusPill status={r.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-primary"
                        disabled={decidingId === r.id}
                        onClick={() => decide(r.id, 'APPROVED')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-secondary"
                        disabled={decidingId === r.id}
                        onClick={() => decide(r.id, 'REJECTED')}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
