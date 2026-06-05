const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'spaceViewer' }, // spaceAdmin, spaceViewer, spaceOwner
  points: { type: Number, default: 0 },
  version: { type: Number, default: 0 }, // Used for Lab 11 Optimistic Locking
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);