import { Box, Snackbar, IconButton } from "@mui/material";
import NotesForm from "../NotesForm/NotesForm";
import React, { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import NotesTable from "../NotesTable/NotesTable";
import axios from "axios";

const Landing = () => {
    const [notes, setNotes] = useState([]);
    const [feedback, setFeedback] = useState({ open: false, message: "" });

    const handleClose = () => setFeedback({ open: false, message: "" });

    // Fetch notes from the server
    const fetchNotes = async () => {
        try {
            const response = await axios.get("https://calc-server-hgvf.onrender.com/api/notes");
            setNotes(response.data);
        } catch (error) {
            console.error("Error fetching notes:", error);
            setFeedback({ open: true, message: "Failed to fetch notes" });
        }
    };

    useEffect(() => {
        fetchNotes(); // Fetch notes when the component mounts
    }, []);

    return (
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
            <NotesTable notes={notes} setNotes={setNotes} fetchNotes={fetchNotes} />
        </Box>
    );
};

export default Landing;
