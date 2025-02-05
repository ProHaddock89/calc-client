import { Box, Typography, Button } from "@mui/material";

const History = ({ history, onDelete }) => {
    // Get the last 5 entries and reverse their order
    const displayedHistory = history.slice(-5).reverse();

    return (
        <Box mt={1} sx={{ width: '100%', maxWidth: 600 }}>
            <Typography variant="h6">Calculation History</Typography>
            {displayedHistory.length === 0 ? (
                <Typography>No calculations yet.</Typography>
            ) : (
                displayedHistory.map((entry) => (
                    <Box key={entry.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 1 }}>
                        <Box>
                            <Typography variant="subtitle1">{entry.title}</Typography>
                            <Typography>Purchase Price: {entry.PP}</Typography>
                            <Typography>Stop Loss: {entry.SL}</Typography>
                            <Typography>Number of Contracts: {entry.NC}</Typography>
                            <Typography>Result: {entry.result}</Typography>
                        </Box>
                        {/* <Button variant="outlined" color="secondary" onClick={() => onDelete(entry.id)}>
                            Delete
                        </Button> */}
                    </Box>
                ))
            )}
        </Box>
    );
};

export default History;