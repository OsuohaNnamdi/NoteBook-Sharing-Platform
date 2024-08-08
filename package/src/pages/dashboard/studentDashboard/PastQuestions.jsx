import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, TextField, CircularProgress, IconButton } from '@mui/material';
import { BiPlusCircle } from 'react-icons/bi';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ResourceCard from '../LecturerDashboard/ResourceCard';
import DashboardCards from '../LecturerDashboard/DashboardCards';
import axiosInstance from '../../auth/axiosInstance';

const PastQuestions = () => {
  const [semester, setSemester] = useState("by me");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [uploadedQuestions, setUploadedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch uploaded questions if "by me" is selected
    if (semester === "by me") {
      setLoading(true);
      axiosInstance.get('/past-questions/school/1') // Replace with actual school ID or user ID
        .then(response => {
          setUploadedQuestions(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching uploaded questions:', error);
          setLoading(false);
        });
    }
  }, [semester]);

  useEffect(() => {
    // Search past questions if there's a search keyword
    if (searchKeyword) {
      setLoading(true);
      axiosInstance.get('/past-questions/search', searchKeyword, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => {
        setSearchResults(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
        setLoading(false);
      });
    } else {
      setSearchResults([]);
    }
  }, [searchKeyword]);

  const handleDelete = (id) => {
    axiosInstance.delete(`/past-questions/${id}`)
      .then(() => {
        setUploadedQuestions(prev => prev.filter(q => q.id !== id));
      })
      .catch(error => {
        console.error('Error deleting past question:', error);
      });
  };

  return (
    <Box sx={{ maxHeight: '100vh', overflowY: 'scroll' }}>
      <Box sx={{ p: 5, sm: { p: 10 }, my: 20 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <Box sx={{ borderRadius: '50%', p: 8, bgcolor: 'primary.main', width: 'fit-content' }} />
            <Box>
              <Typography variant="h6" fontWeight="medium">Welcome Joe Doe</Typography>
              <Typography variant="body2" mt={2}>Here are the overview of your courses</Typography>
            </Box>
          </Box>

          <Button sx={{ maxWidth: 'md', textAlign: 'start' }}>
            <DashboardCards
              title="Upload Past Questions"
              icon={<BiPlusCircle size={35} />}
              count={<span>Total uploaded: {uploadedQuestions.length}</span>}
            />
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" mt={10}>Past Questions</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 5, mt: 5 }}>
          <Button
            sx={{
              borderBottom: semester === "by me" ? '2px solid' : '2px solid transparent',
              borderColor: semester === "by me" ? 'primary.main' : 'transparent',
            }}
            onClick={() => setSemester("by me")}
          >
            Uploaded By Me
          </Button>
          <Button
            sx={{
              borderBottom: semester === "first" ? '2px solid' : '2px solid transparent',
              borderColor: semester === "first" ? 'primary.main' : 'transparent',
            }}
            onClick={() => setSemester("first")}
          >
            Harmattan Semester (1st)
          </Button>
          <Button
            sx={{
              borderBottom: semester === "second" ? '2px solid' : '2px solid transparent',
              borderColor: semester === "second" ? 'primary.main' : 'transparent',
            }}
            onClick={() => setSemester("second")}
          >
            Rain Semester (2nd)
          </Button>
        </Box>

        <Box sx={{ mt: 5 }}>
          <TextField
            label="Search Past Questions"
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
              searchResults.map((question) => (
                <Paper key={question.id} sx={{ p: 2, mb: 2 }}>
                  <ResourceCard
                    courseCode={question.courseCode}
                    courseTitle={question.courseTitle}
                    file={question.file}
                    isStudent
                  />
                </Paper>
              ))
            ) : (
              <Typography>No results found</Typography>
            )
          )}
        </Box>

        {semester === "by me" && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" mb={2}>My Uploaded Past Questions</Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              uploadedQuestions.length > 0 ? (
                uploadedQuestions.map((question) => (
                  <Paper key={question.id} sx={{ p: 2, mb: 2, position: 'relative' }}>
                    <ResourceCard
                      courseCode={question.courseCode}
                      courseTitle={question.courseTitle}
                      file={question.file}
                      isStudent={false}
                    />
                    <IconButton
                      onClick={() => handleDelete(question.id)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                ))
              ) : (
                <Typography>No uploaded questions found</Typography>
              )
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PastQuestions;
