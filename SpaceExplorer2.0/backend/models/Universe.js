const mongoose = require('mongoose');

const UniverseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    genre: { type: String, default: 'Space Opera' },
    description: { type: String },
    ships: [{
        name: { type: String },
        class: { type: String },
        status: { type: String, default: 'Active' }
    }],
    crew: [{
        name: { type: String, required: true },
        role: { type: String },
        species: { type: String, default: 'Human' }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Universe', UniverseSchema);