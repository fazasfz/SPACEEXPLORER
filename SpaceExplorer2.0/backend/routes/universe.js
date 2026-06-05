const express = require('express');
const router = express.Router();
const Universe = require('../models/Universe');

// 1. CREATE A NEW UNIVERSE
router.post('/create', async (req, res) => {
    try {
        const { userId, name, genre, description } = req.body;

        if (!userId || !name) {
            return res.status(400).json({ message: 'User ID and Universe Name are required' });
        }

        const newUniverse = new Universe({
            userId,
            name,
            genre,
            description
        });

        await newUniverse.save();
        res.status(201).json({ message: 'Fictional universe initialized!', universe: newUniverse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET ALL UNIVERSES FOR A SPECIFIC USER
router.get('/user/:userId', async (req, res) => {
    try {
        const universes = await Universe.find({ userId: req.params.userId });
        res.json(universes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;