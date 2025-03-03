import { Box, Snackbar, IconButton, Button } from "@mui/material";
import NotesForm from "../NotesForm/NotesForm";
import React, { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import NotesTable from "../NotesTable/NotesTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const URL_CURRENT = "https://calcserverv2-0.onrender.com"
    const [notes, setNotes] = useState([]);
    const [feedback, setFeedback] = useState({ open: false, message: "" });

    const handleClose = () => setFeedback({ open: false, message: "" });

    // Fetch notes from the server
    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("🔹 Sending request with token:", token);
    
            const response = await axios.get("https://calcserverv2-0.onrender.com/api/notes", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log("✅ Notes fetched:", response.data);
        } catch (error) {
            console.error("❌ Error fetching notes:", error);
        }
    };
    

    useEffect(() => {
        fetchNotes(); // Fetch notes when the component mounts
    }, []);
    // logout
    const navigate = useNavigate();
      
    const handleLogout = () => {
          localStorage.removeItem("token");
          navigate("/"); // Redirect to login 
    };

    
    return (
        <>
        <Box sx={{ flexGrow: 1, flexWrap: 'wrap' }}>
            <title>Asset Calculator</title>
            <Snackbar
                open={feedback.open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={feedback.message}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
            
    
            <NotesForm setFeedback={setFeedback} setNotes={setNotes} fetchNotes={fetchNotes} />
            <Button onClick={handleLogout} variant="contained" color="primary">Logout</Button>
            <NotesTable notes={notes} setNotes={setNotes} fetchNotes={fetchNotes} />
        </Box>
        </>
    );
};

export default Landing;