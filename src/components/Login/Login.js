import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%', 
  width: '60vh', 
  margin: 'auto',
  padding: theme.spacing(3),
  fontFamily: 'arial',
  [theme.breakpoints.down('sm')]: {
    width: '90vw', // Adjust width for smaller screens
    height: 'auto', // Allow it to shrink in height
    padding: theme.spacing(2),
  },
}));


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch("https://calcserverv2-0.onrender.com/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Login successful. Token stored:", data.token);

        window.location.href = "/home"; // Redirect
    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong. Please try again.");
    }
};

  
  

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <a href='/register'>Don't have an account?</a>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
      label="Password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      fullWidth
      margin="normal"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </StyledBox>
  );
};

export default Login;