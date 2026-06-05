const express = require('express');
const router = express.Router();

// Mock Live Satellite and Launch Tracking Telemetry Provider
router.get('/launches', (req, res) => {
    res.json([
        {
            id: "launch-01",
            mission: "Artemis III Lunar Core Sync",
            rocket: "SpaceX Starship HLS",
            netDate: new Date(Date.now() + 86400000 * 2).toISOString(), // T-Minus 2 Days
            status: "go"
        },
        {
            id: "launch-02",
            mission: "James Webb Deep Space Field Survey",
            rocket: "Ariane 6 Heavy",
            netDate: new Date(Date.now() + 86400000 * 5).toISOString(), // T-Minus 5 Days
            status: "planning"
        }
    ]);
});

module.exports = router;