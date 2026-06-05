const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  objective: { type: String, required: true },
  launchDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  priority: { type: String, default: 'Medium' },
  status: { type: String, default: 'planning' }, // planning, active, completed, failed
  crewSize: { type: Number, default: 0 },
  crew: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Astronaut' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// LAB 7: Indexing Rules
MissionSchema.index({ status: 1 });
MissionSchema.index({ name: 1 });
MissionSchema.index({ status: 1, launchDate: -1 }); // Compound Index
MissionSchema.index({ name: 'text', destination: 'text', objective: 'text' }); // Text Index for Lab 8 Search

module.exports = mongoose.model('Mission', MissionSchema);