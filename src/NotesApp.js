import React, { useEffect, useState } from 'react';

const NotesApp = () => {
    const [notes, setNotes] = useState([]); // State for holding fetched notes
    const [error, setError] = useState(null); // State for handling errors

    // Function to fetch notes from the backend
    const fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/notes');
            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }
            const data = await response.json();
            console.log(data);  // Log the data for debugging
            setNotes(data); // Set the fetched data to the notes state
        } catch (error) {
            console.error('Error fetching notes:', error); // Log error to console
            setError('Failed to fetch notes'); // Set the error state
        }
    };

    // Fetch notes when the component is mounted
    useEffect(() => {
        fetchNotes();
    }, []); // Empty dependency array ensures it runs only once on mount

    return (
        <div>
            <h1>Notes</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error if any */}
            <ul>
                {notes.map((note) => (
                    <li key={note._id}>
                        {note.title} - MT: {note.MT}, TV: {note.TV}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotesApp;
