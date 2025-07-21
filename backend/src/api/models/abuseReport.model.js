const mongoose = require('mongoose');

const abuseReportSchema = new mongoose.Schema({
  reporterEmail: {
    type: String,
    trim: true,
  },
  abuseType: {
    type: String,
    required: true,
    enum: ['harassment', 'spam', 'offensive-content', 'scam', 'other'],
  },
  description: {
    type: String,
    required: true,
  },
  // What kind of content is being reported?
  reportType: {
    type: String,
    required: true,
    enum: ['missionary', 'cause'],
  },
  // Reference to the reported missionary or cause
  reportedMissionary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Missionary',
  },
  reportedCause: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cause',
  },
  // For tracking the report's lifecycle
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved_blocked', 'resolved_dismissed'],
    default: 'pending',
  },
  // Notes from the super_admin
  resolutionNotes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('AbuseReport', abuseReportSchema);