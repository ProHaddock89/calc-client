import { Box, Typography, TextField, Button, Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import History from "../History/History";

const NotesTable = ({ notes, setNotes }) => {
    const [selectedNote, setSelectedNote] = useState(null);
    const [inputValues, setInputValues] = useState({ PP: "", SL: "", NC: "" });
    const [calculatedResult, setCalculatedResult] = useState(null);
    const [calculationHistory, setCalculationHistory] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get("https://calc-server-hgvf.onrender.com/api/notes");
                setNotes(response.data);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };

        const fetchHistory = async () => {
            try {
                const response = await axios.get("https://calc-server-hgvf.onrender.com/api/history/");
                setCalculationHistory(response.data);
            } catch (error) {
                console.error("Error fetching calculation history:", error);
            }
        };

        fetchNotes();
        fetchHistory();
    }, []);

    const handleSelectChange = (_, newValue) => {
        setSelectedNote(newValue);
        setInputValues({ PP: "", SL: "", NC: "" });
        setCalculatedResult(null);
    };

    const handleCalculate = async () => {
        const { PP, SL, NC } = inputValues;
        const { MT, TV, title } = selectedNote || {};

        if (MT && NC) {
            const result = Math.round((((SL - PP) / MT) * TV) * NC);
            setCalculatedResult("<h6 style={{ fontSize: '14px' padding: '0' }}>Result is</h6> "+result);

            const newEntry = { id: Date.now().toString(), title, PP, SL, NC, result };
            setCalculationHistory((prev) => [...prev, newEntry]);

            try {
                await axios.post("https://calc-server-hgvf.onrender.com/api/history/", newEntry);
                console.log("History saved:", newEntry);
            } catch (error) {
                console.error("Error saving history:", error.response?.data || error.message);
            }
        } else {
            setCalculatedResult(`<h6 style={{ fontSize: "14px" }}>Invalid MT, NC, or TV value</h6>`);
        }
    };

    const handleDeleteNote = async () => {
        console.log(`DELETE URL: https://calc-server-hgvf.onrender.com/api/notes/${selectedNote._id}`);

        if (!selectedNote?._id) {
            console.error("Invalid note ID:", selectedNote);
            return;
        }

        try {
            const response = await axios.delete(`https://calc-server-hgvf.onrender.com/api/notes/${selectedNote._id}`);
            


            if (response.status === 200) {
                setNotes((prevNotes) => prevNotes.filter((note) => note._id !== selectedNote._id));
                setSelectedNote(null); // Clear the selection after deletion
            } else {
                throw new Error(`Failed to delete note: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleDeleteHistory = async (id) => {
        try {
            await axios.delete(`https://calc-server-hgvf.onrender.com/api/history/${id}`);
            setCalculationHistory((prev) => prev.filter((entry) => entry.id !== id));
        } catch (error) {
            console.error("Error deleting history entry:", error.response?.data || error.message);
        }
    };

    const handleDeleteAllHistory = async () => {
        try {
            await axios.delete("https://calc-server-hgvf.onrender.com/api/history/");
            setCalculationHistory([]);
            console.log("All history entries deleted.");
        } catch (error) {
            console.error("Error deleting history:", error.response?.data || error.message);
        }
    };

    return (
        <Box m="20px" display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Autocomplete
                value={selectedNote}
                onChange={handleSelectChange}
                options={notes}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => <TextField {...params} label="Select an Asset" variant="outlined" />}
                sx={{ mb: 2, width: { xs: "100%", sm: "250px" } }}
            />
            {selectedNote && (
                <Box textAlign="center">
                    <Typography variant="h5">{selectedNote.title}</Typography>
                    <Typography variant="body1">MT: {selectedNote.MT}</Typography>
                    <Typography variant="body1">TV: {selectedNote.TV}</Typography>

                    {/* Text Fields with line breaks */}
                    <TextField
                        variant="outlined"
                        label="Purchase Price"
                        type="number"
                        value={inputValues.PP}
                        onChange={(e) => {
                            setInputValues({ ...inputValues, PP: e.target.value });
                        }}
                        size="small"
                        sx={{ mb: 1, display: "block" }}
                    />
                    <br />
                    <TextField
                        variant="outlined"
                        label="Stop Loss"
                        type="number"
                        value={inputValues.SL}
                        onChange={(e) => {
                            setInputValues({ ...inputValues, SL: e.target.value });
                        }}
                        size="small"
                        sx={{ mb: 1, display: "block" }}
                    />
                    <br />
                    <TextField
                        variant="outlined"
                        label="Number of Contracts"
                        type="number"
                        value={inputValues.NC}
                        onChange={(e) => {
                            setInputValues({ ...inputValues, NC: e.target.value });
                        }}
                        size="small"
                        sx={{ mb: 1, display: "block" }}
                    />

                    <br />

                    {calculatedResult !== null && (
                        <Typography 
                        variant="h6" 
                        sx={{ mt: 2, fontSize: "20px" }} 
                        dangerouslySetInnerHTML={{ __html: calculatedResult }} 
                      />
                    )}
                    <br />

                    <Button variant="contained" color="primary" onClick={handleCalculate} sx={{ mt: 1 }}>
                        Calculate
                    </Button>
                    <br />
                    <br />
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={handleDeleteNote}
                        sx={{ mt: 1, ml: 1 }}
                    >
                        Delete Asset
                    </Button>
                </Box>
            )}
            <Button size="small" variant="outlined" color="error" onClick={handleDeleteAllHistory} sx={{ mt: 2 }}>
                Delete All History
            </Button>
            <History history={calculationHistory} onDelete={handleDeleteHistory} />
        </Box>
    );
};

export default NotesTable;
