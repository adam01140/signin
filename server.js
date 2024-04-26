const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

let users = [];
let citations = [];

app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'Username already exists', success: false });
    }
    users.push({ username, password }); // Consider hashing the password
    res.status(201).json({ message: 'User created successfully', success: true });
});

app.get('/api/login', (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Authorization header is missing or incorrect', success: false });
    }
    const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials', success: false });
    }
    res.json({ message: 'Login successful', success: true });
});

app.get('/api/citations', (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Authorization required', success: false });
    }
    const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    if (username !== 'adam0114' || password !== 'N@vy0114') {
        return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    res.json(citations);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
