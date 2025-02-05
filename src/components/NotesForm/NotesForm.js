import { Box, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import axios from "axios";

const NotesForm = ({ setFeedback, fetchNotes }) => {
    const [noteData, setNoteData] = useState({ title: "", MT: "", TV: "" });
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Add an ID to the noteData before submitting
        const newNote = { id: Date.now().toString(), ...noteData };  // Adding the ID here

        try {
            const response = await axios.post("https://calc-server-hgvf.onrender.com/api/notes", newNote);
            console.log("Response data:", response.data);
            setFeedback({ open: true, message: "Note Saved Successfully!" });
            setNoteData({ title: "", MT: "", TV: "" });
            
            // Fetch notes after adding a new note
            fetchNotes(); 

            handleClose(); 
        } catch (error) {
            console.error("Error saving note:", error);
            setFeedback({ open: true, message: "Failed to save note..." });
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNoteData({ title: "", MT: "", TV: "" });
    };

    return (
        <Box sx={{ position: 'relative', height: '5vh', padding: 1 }}>
            <Button 
                variant="contained" 
                onClick={handleClickOpen} 
                sx={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '100%', 
                    position: 'absolute', 
                    right: '20px', 
                    top: '4px',
                    bgcolor: 'primary.main',
                    '&:hover': {
                        bgcolor: 'primary.dark',
                    },
                    fontSize: '24px',
                }}
            >
                +
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add an Asset</DialogTitle> <hr/>
                <DialogContent>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs>
                                <TextField 
                                    variant="outlined" 
                                    label="Asset Name" 
                                    value={noteData.title} 
                                    required 
                                    fullWidth 
                                    onChange={(e) => setNoteData({ ...noteData, title: e.target.value })} 
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    variant="outlined" 
                                    label="Minimum Tick" 
                                    type="number" 
                                    value={noteData.MT} 
                                    onChange={(e) => setNoteData({ ...noteData, MT: e.target.value })} 
                                    fullWidth 
                                /> 
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    variant="outlined" 
                                    label="Tick Value" 
                                    type="number" 
                                    value={noteData.TV} 
                                    onChange={(e) => setNoteData({ ...noteData, TV: e.target.value })} 
                                    fullWidth 
                                />
                            </Grid>
                        </Grid>
                        <DialogActions sx={{ justifyContent: 'center' }}>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit" variant="outlined">Save</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default NotesForm;
