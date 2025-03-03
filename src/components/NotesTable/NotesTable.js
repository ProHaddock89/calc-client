import { Box, Typography, TextField, Button, Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import History from "../History/History";
import { jwtDecode } from "jwt-decode";

const NotesTable = ({ notes, setNotes }) => {
    const URL_CURRENT = "https://calcserverv2-0.onrender.com";
    const [selectedNote, setSelectedNote] = useState(null);
    const [inputValues, setInputValues] = useState({ PP: "", SL: "", NC: "" });
    const [calculatedResult, setCalculatedResult] = useState(null);
    const [calculationHistory, setCalculationHistory] = useState([]);

    // ➤ Fetch Notes on Mount
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("❌ No token found.");
                    return;
                }

                const response = await axios.get(`${URL_CURRENT}/api/notes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("✅ Notes fetched:", response.data);
                setNotes(response.data);
            } catch (error) {
                console.error("❌ Error fetching notes:", error);
            }
        };

        fetchNotes();
    }, [setNotes]);

    // ➤ Fetch History on Mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("❌ No token found.");
                    return;
                }

                const response = await axios.get(`${URL_CURRENT}/api/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("✅ History fetched:", response.data);
                setCalculationHistory(response.data);
            } catch (error) {
                console.error("❌ Error fetching history:", error.response?.data || error.message);
            }
        };

        fetchHistory();
    }, []);

    // ➤ Handle Calculation and Save to History
    const handleCalculate = async () => {
        const { PP, SL, NC } = inputValues;
        const { MT, TV, title } = selectedNote || {};
    
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found. User is not authenticated.");
            return;
        }
    
        let userId;
        try {
            const decoded = jwtDecode(token);
            userId = decoded.id; // Ensure your token contains an 'id' field
        } catch (error) {
            console.error("❌ Error decoding token:", error);
            return;
        }
    
        if (MT && NC) {
            const result = Math.round((((SL - PP) / MT) * TV) * NC);
            setCalculatedResult(`<h6 style={{ fontSize: "14px" }}>Result is ${result}</h6>`);
    
            const newEntry = { id: Date.now().toString(), userId, title, PP, SL, NC, result };
    
            setCalculationHistory((prev) => [...prev, newEntry]);
    
            try {
                await axios.post(URL_CURRENT + "/api/history/", newEntry, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("✅ History saved:", newEntry);
            } catch (error) {
                console.error("❌ Error saving history:", error.response?.data || error.message);
            }
        } else {
            setCalculatedResult(`<h6 style={{ fontSize: "14px" }}>Invalid MT, NC, or TV value</h6>`);
        }
    };
    

    // ➤ Handle History Deletion
    const handleDeleteHistory = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${URL_CURRENT}/api/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCalculationHistory((prev) => prev.filter((entry) => entry._id !== id));
            console.log(`✅ History entry ${id} deleted.`);
        } catch (error) {
            console.error("❌ Error deleting history entry:", error.response?.data || error.message);
        }
    };

    // ➤ Handle All History Deletion
    const handleDeleteAllHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ No token found. Cannot delete history.");
                return;
            }
    
            const config = { headers: { Authorization: `Bearer ${token}` } };
    
            await axios.delete(URL_CURRENT + "/api/history/", config);
            setCalculationHistory([]); // ✅ Only clears frontend state for that user
            console.log("✅ All history entries for the user deleted.");
        } catch (error) {
            console.error("❌ Error deleting history:", error.response?.data || error.message);
        }
    };
    

    return (
        <Box m="20px" display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Autocomplete
                value={selectedNote}
                onChange={(_, newValue) => {
                    setSelectedNote(newValue);
                    setInputValues({ PP: "", SL: "", NC: "" });
                    setCalculatedResult(null);
                }}
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

                    <TextField variant="outlined" label="Purchase Price" type="number"
                        value={inputValues.PP} onChange={(e) => setInputValues({ ...inputValues, PP: e.target.value })}
                        size="small" sx={{ mb: 1, display: "block" }} />
                    <br />
                    <TextField variant="outlined" label="Stop Loss" type="number"
                        value={inputValues.SL} onChange={(e) => setInputValues({ ...inputValues, SL: e.target.value })}
                        size="small" sx={{ mb: 1, display: "block" }} />
                    <br />
                    <TextField variant="outlined" label="Number of Contracts" type="number"
                        value={inputValues.NC} onChange={(e) => setInputValues({ ...inputValues, NC: e.target.value })}
                        size="small" sx={{ mb: 1, display: "block" }} />
                    <br />

                    {calculatedResult !== null && (
                        <Typography variant="h6" sx={{ mt: 2, fontSize: "20px" }}
                            dangerouslySetInnerHTML={{ __html: calculatedResult }} />
                    )}
                    <br />

                    <Button variant="contained" color="primary" onClick={handleCalculate} sx={{ mt: 1 }}>
                        Calculate
                    </Button>
                    <br /><br />
                    <Button size="small" variant="outlined" color="error" onClick={handleDeleteAllHistory} sx={{ mt: 2 }}>
                        Delete All History
                    </Button>
                </Box>
            )}
            <History history={calculationHistory} onDelete={handleDeleteHistory} />
        </Box>
    );
};

export default NotesTable;
