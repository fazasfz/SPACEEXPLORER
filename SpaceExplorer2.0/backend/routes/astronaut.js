const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Astronaut = require('../models/Astronaut');
const User = require('../models/User');
const Mission = require('../models/Mission');
const auth = require('../middleware/auth');

// GET: Pagination & Filtering (Lab 8 Optimization)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Lab 8: Strict Pagination Limit
  const skip = (page - 1) * limit;

  try {
    const total = await Astronaut.countDocuments();
    const records = await Astronaut.find().skip(skip).limit(limit);
    res.json({ total, page, pages: Math.ceil(total / limit), data: records });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST: Register Astronaut & Add Points via Transaction (Lab 10)
router.post('/', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const astronaut = new Astronaut({ ...req.body, createdBy: req.user.id });
    await astronaut.save({ session });

    // Lab 11: Optimistic Locking update on user points
    const user = await User.findOne({ _id: req.user.id });
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id, version: user.version },
      { $inc: { points: 10, version: 1 } },
      { new: true, session }
    );

    if (!updatedUser) throw new Error('Optimistic Lock Conflict encountered. Please retry.');

    await session.commitTransaction();
    session.endSession();
    res.json(astronaut);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
});

// PUT: Pessimistic Lock Assignment System (Lab 10 & 11)
router.put('/:id/assign', auth, async (req, res) => {
  const { missionId } = req.body;
  const astronautId = req.params.id;

  // 1. Acquire Pessimistic Lock on Astronaut Document
  const lockedAstronaut = await Astronaut.findOneAndUpdate(
    { _id: astronautId, locked: false },
    { locked: true, lockOwner: req.user.id, lockTime: new Date() },
    { new: true }
  );

  if (!lockedAstronaut) {
    return res.status(423).json({ message: 'Resource Lock Denied: Astronaut profile currently deployed.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Perform Atomic Assignment
    lockedAstronaut.assignedMission = missionId;
    lockedAstronaut.locked = false; // Release lock upon commitment
    lockedAstronaut.lockOwner = null;
    await lockedAstronaut.save({ session });

    await Mission.findByIdAndUpdate(missionId, { $push: { crew: astronautId } }, { session });

    await session.commitTransaction();
    session.endSession();
    res.json({ message: 'Assignment finalized under explicit server isolation transaction framework.' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    // Ensure lock is released even if assignment fails
    await Astronaut.findByIdAndUpdate(astronautId, { locked: false, lockOwner: null });
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;