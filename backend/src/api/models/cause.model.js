const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema({
  // Tenant ID for data isolation
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  missionaryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Missionary',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
   ministryType: { type: [String], required: false },
  name: { type: String, required: true },
  description: String,
  images: [String],
  videoUrl: { type: String },
  goalAmount: { type: Number, required: true, min: 0 },
  raisedAmount: { type: Number, default: 0 },
  deadline: Date,
  isCompleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isReported: { type: Boolean, default: false },
}, { timestamps: true });

// Index for faster queries within a tenant
causeSchema.index({ organizationId: 1, isActive: 1 });

module.exports = mongoose.model('Cause', causeSchema);