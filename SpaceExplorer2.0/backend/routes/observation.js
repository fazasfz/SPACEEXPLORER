const express = require('express');
const router = express.Router();
const Observation = require('../models/Observation');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const obs = new Observation({ ...req.body, createdBy: req.user.id });
  await obs.save();
  res.json(obs);
});

router.get('/', auth, async (req, res) => {
  const data = await Observation.find({ createdBy: req.user.id }).sort({ observedAt: -1 });
  res.json(data);
});

module.exports = router;