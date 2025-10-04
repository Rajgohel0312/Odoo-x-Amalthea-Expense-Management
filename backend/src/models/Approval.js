const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
  expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  decision: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Skipped'], default: 'Pending' },
  comments: { type: String },
  order: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  decidedAt: { type: Date }
});

module.exports = mongoose.model('Approval', ApprovalSchema);
