import React from "react";
import { Box, Button, Card, CardContent, Typography, Grid, Container } from "@mui/material";
import { Link } from "react-router-dom"; // Assuming you're using react-router for navigation

const HomePage = () => {
  return (
    <Container>
      <Card variant="outlined" sx={{ p: 0, mb: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to the Notebook Sharing System
          </Typography>
          <Typography variant="body1" gutterBottom>
            A platform to share and manage notes and documents easily among students, lecturers.
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Student Dashboard
              </Typography>
              <Typography variant="body2" gutterBottom>
                Access your notes, send PDFs, and manage your documents.
              </Typography>
              <Button variant="contained" color="primary" component={Link} to="/student-dashboard">
                Go to Student Dashboard
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Lecturer Dashboard
              </Typography>
              <Typography variant="body2" gutterBottom>
                Share notes with students and manage your teaching materials.
              </Typography>
              <Button variant="contained" color="primary" component={Link} to="/lecturer-dashboard">
                Go to Lecturer Dashboard
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2">
          Not a member? <Link to="/register">Register here</Link>
        </Typography>
        <Typography variant="body2">
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
