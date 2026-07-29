import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { edutechApi } from '../../api/edutechApi';
import { extractErrorMessage } from '../../lib/api';

const initialForm = { courseTitle: '', courseCode: '', semester: '', videoLink: '', schoolId: '', course: '' };

export default function AdminCourseFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const created = await edutechApi.createCourse(form, file);
      navigate(`/edutech/${created.id}`, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save this course.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h1 className="page-title">Add course</h1>
      <p className="page-subtitle">Upload notes for students with Notes access.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Course title</label>
          <input required value={form.courseTitle} onChange={update('courseTitle')} />
        </div>
        <div className="field">
          <label>Course code</label>
          <input required value={form.courseCode} onChange={update('courseCode')} placeholder="CSC 401" />
        </div>
        <div className="field">
          <label>Semester</label>
          <input value={form.semester} onChange={update('semester')} placeholder="First semester" />
        </div>
        <div className="field">
          <label>Video link</label>
          <input value={form.videoLink} onChange={update('videoLink')} placeholder="https://…" />
        </div>
        <div className="field">
          <label>School ID</label>
          <input value={form.schoolId} onChange={update('schoolId')} />
        </div>
        <div className="field">
          <label>Course (department/programme)</label>
          <input value={form.course} onChange={update('course')} />
        </div>
        <div className="field">
          <label>Attachment</label>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <button className="btn btn-primary" disabled={saving} type="submit">
          {saving ? 'Saving…' : 'Save course'}
        </button>
      </form>
    </div>
  );
}
