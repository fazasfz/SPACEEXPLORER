require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware Array Setup
app.use(cors());
app.use(express.json());

// Boot Database Network
connectDB();

// Global Pipeline Routing Registry Mapping
app.use('/api/auth', require('./routes/auth'));
app.use('/api/missions', require('./routes/mission'));
app.use('/api/astronauts', require('./routes/astronaut'));
app.use('/api/discoveries', require('./routes/discovery'));
app.use('/api/universe', require('./routes/universe'));
app.use('/api/observations', require('./routes/observation'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/search', require('./routes/search'));

// Standby Core Fallback Routing Layout
app.get('/', (req, res) => res.send('🌌 SpaceExplorer 2.0 Core Network Server Array Active.'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🛰️ Production Core server tracking cleanly on port ${PORT}`));