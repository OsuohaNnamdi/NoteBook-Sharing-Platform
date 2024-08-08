import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Button, TextField,Box, CircularProgress } from '@mui/material';
import ResourceCard from '../LecturerDashboard/ResourceCard';
import axiosInstance from '../../auth/axiosInstance'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [semester, setSemester] = useState('first');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [semesterCourses, setSemesterCourses] = useState([]);
  const userProfile = JSON.parse(localStorage.getItem('profile')) || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/courses');
        setCourses(response.data);
        filterCourses(response.data, semester);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [semester]);

  useEffect(() => {
    filterCourses(courses, semester);
  }, [semester, courses]);

  const filterCourses = (allCourses, semester) => {
    const filteredCourses = allCourses.filter(course =>
      (semester === 'first' && course.semester === 'Harmattan') ||
      (semester === 'second' && course.semester === 'Rain')
    );
    setSemesterCourses(filteredCourses);
  };

  useEffect(() => {
    if (searchKeyword) {
      setLoading(true);
      axiosInstance.get(`/courses/search/${searchKeyword}`)
        .then((response) => {
          setSearchResults(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
          setLoading(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchKeyword]);

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <Container sx={{ my: 4, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
      <Grid container spacing={3} justifyContent="space-between" alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 2, boxShadow: 3 }}>
            <div style={{ marginLeft: 16 }}>
              <Typography variant="h6" gutterBottom>Welcome {userProfile.fullName}</Typography>
              <Typography variant="body2" color="textSecondary">Here is an overview of your courses</Typography>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            sx={{
              borderBottom: semester === 'first' ? '2px solid' : '2px solid transparent',
              borderColor: semester === 'first' ? 'primary.main' : 'transparent',
              mr: 2
            }}
            onClick={() => setSemester('first')}
          >
            Harmattan Semester (1st)
          </Button>
          <Button
            sx={{
              borderBottom: semester === 'second' ? '2px solid' : '2px solid transparent',
              borderColor: semester === 'second' ? 'primary.main' : 'transparent',
            }}
            onClick={() => setSemester('second')}
          >
            Rain Semester (2nd)
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h4" sx={{ mt: 5 }}>Available Resources</Typography>

      <Box sx={{ mt: 5 }}>
        <TextField
          label="Search Courses"
          variant="outlined"
          fullWidth
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{ mb: 2 }}
        />
        {loading ? (
          <CircularProgress />
        ) : (
          searchResults.length > 0 ? (
            searchResults.map((course) => (
              <Paper key={course.id} sx={{ p: 2, mb: 2 }} onClick={() => handleCourseClick(course.id)}>
                <ResourceCard id={course.id} courseCode={course.courseCode} courseTitle={course.courseTitle} file={course.file} isStudent={true} />
              </Paper>
            ))
          ) : (
            <Typography>No results found</Typography>
          )
        )}
      </Box>

      <Box sx={{ mt: 5 }}>
        {semesterCourses.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{semester === 'first' ? 'Harmattan Semester' : 'Rain Semester'}</Typography>
            {semesterCourses.map((course) => (
              <Paper key={course.id} sx={{ p: 2, mb: 2 }} onClick={() => handleCourseClick(course.id)}>
                <ResourceCard id={course.id} courseCode={course.courseCode} courseTitle={course.courseTitle} file={course.file} isStudent={true} />
              </Paper>
            ))}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
