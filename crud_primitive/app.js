const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());

const CoolDB = [
    {
        id: 1,
        name: 'John',
        age: 25,
        email: 'rere@gmail.com'
    },
    {
        id: 2,
        name: 'Doe',
        age: 30,
        email: 'fssc@gmail.com'
    },
    {
        id: 3,
        name: 'Jane',
        age: 22,
        email: 'vdsjkn@gmail.com'
    }
]

// Simple server with CRUD operations

// Create
app.post('/users', (req, res) => {
    const user = req.body;
    try {
        const randomId = Math.floor(Math.random() * 1000);
        user.id = randomId;
        CoolDB.push(user);
        res.status(201).send(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    };
});

// Read
app.get('/users', (req, res) => {
    try {
        res.status(200).json(CoolDB);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    };
});

// Update
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userUpdates = req.body;

    try {
        const userIndex = CoolDB.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        CoolDB[userIndex] = { ...CoolDB[userIndex], ...userUpdates, id: CoolDB[userIndex].id };

        res.status(200).json(CoolDB[userIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    try {
        const userIndex = CoolDB.findIndex(user => user.id == id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        CoolDB.splice(userIndex, 1);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    };
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = app;
