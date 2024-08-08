import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import axiosInstance from '../../auth/axiosInstance';

const PastQuestionForm = () => {
  const [file, setFile] = useState(null);
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSend = () => {
    if (file && courseCode && description) {
      const formData = new FormData();
      formData.append('courseCode', courseCode);
      formData.append('description', description);
      formData.append('file', file);

      axiosInstance.post('/send', formData)
        .then(() => {
          setMessage('Note sent successfully!');
          // Optionally, reset the form here
        })
        .catch(error => {
          console.error('Error sending note:', error);
          setMessage('Error sending note');
        });
    } else {
      setMessage('Please provide a file, course code, and description.');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Send Note</Typography>
        <TextField
          fullWidth
          label="Course Code"
          variant="outlined"
          onChange={(e) => setCourseCode(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: 'block', marginBottom: '16px' }}
        />
        <Button variant="contained" onClick={handleSend}>
          Send Note
        </Button>
        {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
      </CardContent>
    </Card>
  );
};

export default PastQuestionForm;
