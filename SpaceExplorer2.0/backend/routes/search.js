const express = require('express');
const router = require('express').Router();
const Mission = require('../models/Mission');
const Astronaut = require('../models/Astronaut');
const Discovery = require('../models/Discovery');

router.get('/', async (req, res) => {
  const term = req.query.q;
  if (!term) return res.json([]);

  try {
    const missions = await Mission.find({ $text: { $search: term } }).select('name destination -_id');
    const crew = await Astronaut.find({ $text: { $search: term } }).select('name specialty -_id');
    const finds = await Discovery.find({ $text: { $search: term } }).select('title type -_id');

    res.json({ missions, crew, discoveries: finds });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;