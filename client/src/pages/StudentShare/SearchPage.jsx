// src/pages/SearchPage.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axiosInstance from '../auth/axiosInstance'; 
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.length > 2) {
      setLoading(true);
      axiosInstance.get(`/${search}`)
        .then(response => {
          console.log('Response data:', response.data);
          setProfile(response.data); // Handle single profile object
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          setProfile(null);
          setLoading(false);
        });
    } else {
      setProfile(null);
    }
  };

  const handleSelect = (email) => {
    navigate(`/chat/${email}`);
  };

  return (
    <Container>
      <Box mb={2}>
        <TextField
          label="Search for an email"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Box>

      {profile ? (
        <Box>
          <Typography variant="h6">{profile.email}</Typography>
          <Typography variant="body1">{profile.fullName || 'No full name available'}</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSelect(profile.email)}
            sx={{ mt: 2 }}
          >
            Start Chat
          </Button>
        </Box>
      ) : (
        search.length > 2 && !loading && (
          <Typography variant="body1">No results found</Typography>
        )
      )}
    </Container>
  );
};

export default SearchPage;
