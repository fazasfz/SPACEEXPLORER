const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// ==========================================
// POST: Register User (Lab 5 & 12 Compliant)
// ==========================================
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  
  try {
    // Structural parameter guard check
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password parameters are mandatory.' });
    }

    // Standardize email tracking to prevent duplicate system entries
    const cleanEmail = email.toLowerCase().trim();
    
    let user = await User.findOne({ email: cleanEmail });
    if (user) {
      return res.status(400).json({ message: 'This email address is already registered.' });
    }

    // Security Password Hashing (Lab 5 specs)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Initializing custom profile architecture matching schema structures
    user = new User({ 
      username: username || email.split('@')[0], 
      email: cleanEmail, 
      passwordHash, 
      role: role || 'spaceViewer',
      points: 0,
      version: 0 // Lab 11 Concurrency Version Flag
    });
    
    await user.save();

    // Generate secure access footprint
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({ 
      token, 
      user: { id: user._id, username: user.username, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error('Registration pipeline error:', err);
    res.status(500).json({ message: 'Internal Server Identity Registry pipeline failure.' });
  }
});

// ==========================================
// POST: Login User (Secure Validation Gate)
// ==========================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password fields cannot be empty.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    
    // Identity verification checks
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials.' });
    }

    // Sign session pass matrix
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ 
      token, 
      user: { id: user._id, username: user.username, email: cleanEmail, role: user.role } 
    });
  } catch (err) {
    console.error('Login process error:', err);
    res.status(500).json({ message: 'Login validation system failure matrix.' });
  }
});

// ==========================================
// GET: Fetch Active Profile (Session Route)
// ==========================================
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User profile data record not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Session query profile tracking error:', err);
    res.status(500).json({ message: 'Identity data payload recovery error.' });
  }
});

module.exports = router;