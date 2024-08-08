import React, { useState } from "react";
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import axios from 'axios';

const RegistrationPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("STUDENT"); // Default to STUDENT
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/register', {
        fullName, email, schoolId, password, accountType
      });
      
      setMessage('Registration successful!');
      console.log(response.data);
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage('Registration failed');
    }
  };

  return (
    <div>
      <Card variant="outlined" sx={{ p: 0 }}>
        <Box sx={{ padding: "15px 30px" }} display="flex" alignItems="center">
          <Box flexGrow={1}>
            <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
              Register
            </Typography>
          </Box>
        </Box>
        <Divider />
        <CardContent sx={{ padding: "30px" }}>
          <form onSubmit={handleRegister}>
            <TextField
              id="full-name"
              label="Full Name"
              variant="outlined"
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              id="email-text"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              id="school-id"
              label="School ID or Matric Number"
              variant="outlined"
              fullWidth
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              id="password-input"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="account-type-label">Account Type</InputLabel>
              <Select
                labelId="account-type-label"
                id="account-type"
                value={accountType}
                label="Account Type"
                onChange={(e) => setAccountType(e.target.value)}
              >
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="LECTURER">Lecturer</MenuItem>
              </Select>
            </FormControl>
            <Button color="primary" variant="contained" type="submit">
              Register
            </Button>
            {message && <Typography color={message.includes('failed') ? 'error' : 'success'} sx={{ mt: 2 }}>{message}</Typography>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPage;
