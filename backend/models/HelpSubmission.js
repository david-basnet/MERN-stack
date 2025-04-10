const mongoose = require("mongoose");

const helpSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  issue: {
    type: String,
    required: true,
    enum: ['login', 'assignment', 'account', 'other']
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model("HelpSubmission", helpSubmissionSchema); 