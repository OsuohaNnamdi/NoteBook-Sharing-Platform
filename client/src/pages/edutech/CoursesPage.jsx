import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { edutechApi } from '../../api/edutechApi';
import { extractErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

export default function CoursesPage() {
  const { isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    edutechApi
      .listCourses()
      .then(setCourses)
      .catch((err) => setError(extractErrorMessage(err, 'Could not load courses.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullPage />;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">Browse available course materials.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link className="btn btn-secondary" to="/edutech/past-questions">Past questions</Link>
          {isAdmin && <Link className="btn btn-primary" to="/edutech/new">+ Add course</Link>}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {courses.length === 0 ? (
        <div className="card empty-state">No courses have been uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-3">
          {courses.map((c) => (
            <Link to={`/edutech/${c.id}`} key={c.id} className="card course-card">
              <span className="course-tag">{c.courseCode}</span>
              <span className="course-title">{c.courseTitle}</span>
              <span className="course-meta">{c.semester || 'Semester not set'}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
