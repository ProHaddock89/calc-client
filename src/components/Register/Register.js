import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import CheckoutButton from '../CheckoutButton/CheckoutButton';

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
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const userData = { name, email, password };
  
    try {
      const response = await fetch("https://calcserverv2-0.onrender.com/api/users/register", { // Adjust URL to match your backend route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("User registered:", data);
        // alert("User registered successfully!");
        localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home")
      } else {
        console.error("Error:", data.message);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <a href='/'>Already have an account?</a>
      <form onSubmit={handleSubmit}>
      <TextField
          label="Name"
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
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
        <CheckoutButton product={{ productName: "Stock Analysis Tool", price: 1 }} />

      </form>
    </StyledBox>
  );
};

export default Login;