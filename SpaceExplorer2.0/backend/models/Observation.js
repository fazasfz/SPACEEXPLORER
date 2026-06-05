const mongoose = require('mongoose');

const ObservationSchema = new mongoose.Schema({
  objectName: { type: String, required: true },
  objectType: { type: String, required: true },
  observedAt: { type: Date, default: Date.now },
  locationName: { type: String },
  equipment: { type: String },
  seeing: { type: Number },
  bortleScale: { type: Number },
  notes: { type: String },
  rating: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

ObservationSchema.index({ createdBy: 1 });
ObservationSchema.index({ createdBy: 1, observedAt: -1 }); // Compound

module.exports = mongoose.model('Observation', ObservationSchema);