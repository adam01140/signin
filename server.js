const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files
//lets see

let citations = [];









let users = []; // This will store user data

// POST endpoint to create a new user
app.post('/api/users', (req, res) => {
    const { username, password } = req.body;

    // Check if the username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'Username already exists', success: false });
    }

    // Add the new user
    users.push({ username, password });
    res.status(201).json({ message: 'User created successfully', success: true });
});

// GET endpoint to authenticate a user
app.get('/api/login', (req, res) => {
    const { username, password } = req.query;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized: Incorrect username or password', success: false });
    }
    res.json({ message: 'Login successful', success: true });
});



// Adjust the POST endpoint to accept complete citation details
app.post('/api/citations', (req, res) => {
    const { citationNumber, timeOccurred, locationOccurred, licensePlate } = req.body;
    const newCitation = {
        citationNumber: citationNumber || "Unavailable",
        timeOccurred: timeOccurred || "Unavailable",
        locationOccurred: locationOccurred || "Unavailable",
        licensePlate: licensePlate || "Unavailable",
        timestamp: new Date().toISOString()
    };
    citations.push(newCitation);
    res.status(201).json(newCitation);
});

// GET endpoint to fetch all citations
app.get('/api/citations', (req, res) => {
    const { username, password } = req.query; // Expect both username and password to be sent as query parameters
    
    // Check if the username and password are correct
    if (username !== 'adam0114' || password !== 'N@vy0114') {
        // If the credentials are incorrect, respond with an unauthorized status code and message
        return res.status(401).json({ message: 'Unauthorized: Incorrect username or password' });
    }
    
    // If the credentials are correct, send back the citations
    res.json([...citations].reverse()); // Return citations from newest to oldest
});


// DELETE endpoint to remove a citation by its citation number
app.delete('/api/citations/:citationNumber', (req, res) => {
    const citationNumber = req.params.citationNumber;
    const index = citations.findIndex(c => c.citationNumber === citationNumber);
    
    if (index === -1) {
        return res.status(404).send('Citation not found');
    }
    
    citations.splice(index, 1); // Remove the citation
    res.status(200).send('Citation deleted successfully');
});

// Serve index.html for any other GET request
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
