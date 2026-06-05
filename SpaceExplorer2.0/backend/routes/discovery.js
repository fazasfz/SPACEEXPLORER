const express = require('express');
const router = express.Router();
const Discovery = require('../models/Discovery');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const d = new Discovery({ ...req.body, discoveredBy: req.user.id });
  await d.save();
  res.json(d);
});

router.get('/', async (req, res) => {
  const data = await Discovery.find();
  res.json(data);
});

module.exports = router;