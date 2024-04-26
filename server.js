const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

let users = []; // This will store user data
let citations = []; // This will store citations data

// POST endpoint to create a new user
app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        res.status(400).json({ message: 'Username already exists', success: false });
    } else {
        users.push({ username, password });
        res.status(201).json({ message: 'User created successfully', success: true });
    }
});

// GET endpoint to authenticate a user
app.get('/api/login', (req, res) => {
    const { username, password } = req.query;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ message: 'Login successful', success: true, username });
    } else {
        res.status(401).json({ message: 'Unauthorized: Incorrect username or password', success: false });
    }
});

// Adjusted the citations POST endpoint
app.post('/api/citations', (req, res) => {
    const { citationNumber, timeOccurred, locationOccurred, licensePlate, username } = req.body;
    const userExists = users.some(user => user.username === username);
    if (!userExists) {
        return res.status(401).json({ message: 'Unauthorized: You must be logged in to post data', success: false });
    }
    const newCitation = { citationNumber, timeOccurred, locationOccurred, licensePlate, timestamp: new Date().toISOString() };
    citations.push(newCitation);
    res.status(201).json(newCitation);
});

// GET endpoint to fetch all citations for a user
app.get('/api/citations', (req, res) => {
    const { username, password } = req.query;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json([...citations].reverse()); // Return citations from newest to oldest
    } else {
        res.status(401).json({ message: 'Unauthorized: Incorrect username or password' });
    }
});

// Additional routing and server setup
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
