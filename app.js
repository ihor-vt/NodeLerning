const express = require('express');
const databaseService = require('./services/databaseService');
const e = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// Simple server with CRUD operations
// Create
app.post('/users', (req, res) => {
    const user = req.body;
    databaseService.createUser(user, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(result);
    });
});

// Read
app.get('/users', (req, res) => {
    databaseService.getUsers((err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
});

// Update
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userUpdates = req.body;

    databaseService.updateUser(id, userUpdates, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
});

// Delete
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    databaseService.deleteUser(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = app;
