const mongoose = require('mongoose');

const AstronautSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: String, required: true },
  specialty: { type: String, required: true },
  experienceYears: { type: Number, required: true },
  assignedMission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', default: null },
  
  // LAB 11: Pessimistic Locking Fields
  locked: { type: Boolean, default: false },
  lockOwner: { type: String, default: null },
  lockTime: { type: Date, default: null },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// LAB 7: Indexes
AstronautSchema.index({ name: 1 });
AstronautSchema.index({ rank: 1 });
AstronautSchema.index({ name: 'text', specialty: 'text' });

module.exports = mongoose.model('Astronaut', AstronautSchema);