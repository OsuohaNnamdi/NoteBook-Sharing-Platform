import React, { useEffect, useState } from 'react';
import { edutechApi } from '../../api/edutechApi';
import { extractErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const initialForm = { courseCode: '', courseTitle: '', year: '', semester: '', schoolId: '' };

export default function PastQuestionsPage() {
  const { isAdmin } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    edutechApi
      .listPastQuestions()
      .then(setQuestions)
      .catch((err) => setError(extractErrorMessage(err, 'Could not load past questions.')))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please attach a file.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await edutechApi.createPastQuestion(form, file);
      setForm(initialForm);
      setFile(null);
      load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not upload this past question.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this past question?')) return;
    try {
      await edutechApi.deletePastQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not delete this past question.'));
    }
  };

  if (loading) return <Spinner fullPage />;

  return (
    <div className="page">
      <h1 className="page-title">Past questions</h1>
      <p className="page-subtitle">Archived past examination questions.</p>

      {error && <div className="alert alert-error">{error}</div>}

      {isAdmin && (
        <form className="card" onSubmit={handleUpload} style={{ marginBottom: 20 }}>
          <div className="grid grid-cols-2">
            <div className="field">
              <label>Course code</label>
              <input required value={form.courseCode} onChange={update('courseCode')} />
            </div>
            <div className="field">
              <label>Course title</label>
              <input required value={form.courseTitle} onChange={update('courseTitle')} />
            </div>
            <div className="field">
              <label>Year</label>
              <input value={form.year} onChange={update('year')} placeholder="2024" />
            </div>
            <div className="field">
              <label>Semester</label>
              <input value={form.semester} onChange={update('semester')} />
            </div>
          </div>
          <div className="field">
            <label>School ID</label>
            <input value={form.schoolId} onChange={update('schoolId')} />
          </div>
          <div className="field">
            <label>File</label>
            <input type="file" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <button className="btn btn-primary" disabled={saving} type="submit">
            {saving ? 'Uploading…' : 'Upload'}
          </button>
        </form>
      )}

      {questions.length === 0 ? (
        <div className="card empty-state">No past questions available yet.</div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th><th>Title</th><th>Year</th><th>Semester</th><th>File</th>{isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id}>
                  <td>{q.courseCode}</td>
                  <td>{q.courseTitle}</td>
                  <td>{q.year}</td>
                  <td>{q.semester}</td>
                  <td>{q.file ? <a href={q.file} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-a)' }}>Download</a> : '—'}</td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDelete(q.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
