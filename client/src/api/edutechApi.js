import { api } from '../lib/api';

export const edutechApi = {
  listCourses: () => api.get('/services/edutech/courses').then((r) => r.data),
  getCourse: (id) => api.get(`/services/edutech/courses/${id}`).then((r) => r.data),
  coursesBySchool: (schoolId) => api.get(`/services/edutech/courses/school/${schoolId}`).then((r) => r.data),
  createCourse: (course, file) => {
    const form = new FormData();
    form.append('course', new Blob([JSON.stringify(course)], { type: 'application/json' }));
    if (file) form.append('file', file);
    return api
      .post('/services/edutech/courses', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
  updateCourse: (id, course) => api.put(`/services/edutech/courses/${id}`, course).then((r) => r.data),
  deleteCourse: (id) => api.delete(`/services/edutech/courses/${id}`).then((r) => r.data),

  listPastQuestions: () => api.get('/services/edutech/past-questions').then((r) => r.data),
  pastQuestionsByCode: (code) => api.get(`/services/edutech/past-questions/${code}`).then((r) => r.data),
  createPastQuestion: (question, file) => {
    const form = new FormData();
    form.append('question', new Blob([JSON.stringify(question)], { type: 'application/json' }));
    form.append('file', file);
    return api
      .post('/services/edutech/past-questions', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
  deletePastQuestion: (id) => api.delete(`/services/edutech/past-questions/${id}`).then((r) => r.data),
};
