const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalAmount: { type: Number, required: true },
  originalCurrency: { type: String, required: true },
  amountInCompanyCurrency: { type: Number, required: true },
  companyCurrency: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  dateSpent: { type: Date, default: Date.now },
  receipts: [{ type: String }], // file paths or URLs
  status: { type: String, enum: ['Draft', 'Waiting', 'Pending', 'Approved', 'Rejected', 'PartiallyApproved'], default: 'Draft' },
  approvals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Approval' }],
  approvalRule: { type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalRule' }, // rule used
  currentStep: { type: Number }, // current active order/step
  createdAt: { type: Date, default: Date.now },
  submittedAt: { type: Date }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
