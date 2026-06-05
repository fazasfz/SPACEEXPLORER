const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET: Complex Metrics Aggregation Engine (Lab 6 Pipeline Execution)
router.get('/', async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: 'discoveries',
          localField: '_id',
          foreignField: 'discoveredBy',
          as: 'discoveriesData'
        }
      },
      {
        $lookup: {
          from: 'observations',
          localField: '_id',
          foreignField: 'createdBy',
          as: 'observationsData'
        }
      },
      {
        $project: {
          username: 1,
          points: 1,
          totalDiscoveries: { $size: '$discoveriesData' },
          totalObservations: { $size: '$observationsData' }
        }
      },
      { $sort: { points: -1 } },
      { $limit: 15 } // Materialized View Snapshot Constraints
    ];

    const analytics = await User.aggregate(pipeline);
    res.json(analytics);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;