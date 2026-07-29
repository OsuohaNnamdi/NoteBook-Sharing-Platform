import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { edutechApi } from '../../api/edutechApi';
import { extractErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    edutechApi
      .getCourse(id)
      .then(setCourse)
      .catch((err) => setError(extractErrorMessage(err, 'Could not load this course.')))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await edutechApi.deleteCourse(id);
      navigate('/edutech', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not delete this course.'));
      setDeleting(false);
    }
  };

  if (loading) return <Spinner fullPage />;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!course) return null;

  return (
    <div className="page">
      <span className="course-tag">{course.courseCode}</span>
      <h1 className="page-title">{course.courseTitle}</h1>
      <p className="page-subtitle">{course.semester || 'Semester not set'}</p>

      <div className="card">
        <table className="table">
          <tbody>
            <tr><th>School ID</th><td>{course.schoolId || '—'}</td></tr>
            <tr><th>Course</th><td>{course.course || '—'}</td></tr>
            <tr>
              <th>Video</th>
              <td>{course.videoLink ? <a href={course.videoLink} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-a)' }}>Watch lecture</a> : '—'}</td>
            </tr>
            <tr>
              <th>File</th>
              <td>{course.file ? <a href={course.file} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-a)' }}>Download</a> : '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {isAdmin && (
        <button className="btn btn-danger" style={{ marginTop: 16 }} disabled={deleting} onClick={handleDelete}>
          {deleting ? 'Deleting…' : 'Delete course'}
        </button>
      )}
    </div>
  );
}
