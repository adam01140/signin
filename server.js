const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let citations = [];

app.post('/api/citations', (req, res) => {
    const { citationNumber, timeOccurred, locationOccurred, licensePlate } = req.body;
    const newCitation = {
        citationNumber,
        timeOccurred,
        locationOccurred,
        licensePlate,
        timestamp: new Date().toISOString()
    };
    citations.push(newCitation);
    res.status(201).json(newCitation);
});

// Updated GET endpoint to include username and password checks
app.get('/api/citations', (req, res) => {
    const { username, password } = req.query;
    
    // Check if both username and password are correct
    if (username !== 'adam' || password !== 'N@vy0114') {
        return res.status(401).json({ message: 'Unauthorized: Incorrect username or password' });
    }
    
    res.json([...citations].reverse());
});

app.delete('/api/citations/:citationNumber', (req, res) => {
    const citationNumber = req.params.citationNumber;
    const index = citations.findIndex(c => c.citationNumber === citationNumber);
    
    if (index === -1) {
        return res.status(404).send('Citation not found');
    }
    
    citations.splice(index, 1);
    res.status(200).send('Citation deleted successfully');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
