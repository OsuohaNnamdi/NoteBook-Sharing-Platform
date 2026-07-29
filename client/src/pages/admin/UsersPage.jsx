import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { extractErrorMessage } from '../../lib/api';
import Spinner from '../../components/Spinner';

export default function UsersPage() {
  const [usersPage, setUsersPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.listUsers(0, 50);
      setUsersPage(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load users.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateUser = async (u, changes) => {
    setSavingId(u.id);
    setError('');
    try {
      const updated = await adminApi.updateUser(u.id, { role: u.role, enabled: u.enabled, ...changes });
      setUsersPage((prev) => ({
        ...prev,
        content: prev.content.map((row) => (row.id === updated.id ? updated : row)),
      }));
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not update that user.'));
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <Spinner fullPage />;

  const users = usersPage?.content ?? [];

  return (
    <div className="page">
      <h1 className="page-title">Users</h1>
      <p className="page-subtitle">Promote to admin, or enable/disable an account.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Enabled</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    disabled={savingId === u.id}
                    onChange={(e) => updateUser(u, { role: e.target.value })}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>{u.enabled ? 'Yes' : 'No'}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    disabled={savingId === u.id}
                    onClick={() => updateUser(u, { enabled: !u.enabled })}
                  >
                    {u.enabled ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
