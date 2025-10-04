const mongoose = require('mongoose');

const ApproverSlotSchema = new mongoose.Schema({
  type: { type: String, enum: ['Role', 'User', 'ManagerSlot'], default: 'Role' },
  role: { type: String }, // e.g., 'Finance', 'Director'
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order: { type: Number, default: 1 }
});

const ConditionalSchema = new mongoose.Schema({
  type: { type: String, enum: ['none', 'percentage', 'specific', 'hybrid'], default: 'none' },
  percentageRequired: { type: Number }, // e.g., 60
  specificApprover: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const ApprovalRuleSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  approvers: [ApproverSlotSchema],
  conditional: { type: ConditionalSchema, default: () => ({}) },

  // 🆕 Rule selection logic fields
  appliesTo: {
    category: { type: [String], default: [] },  // e.g. ["Travel", "Meals"]
    minAmount: { type: Number, default: 0 },    // minimum threshold
    maxAmount: { type: Number, default: Infinity }, // optional cap
    roles: { type: [String], default: [] },     // employee roles
    default: { type: Boolean, default: false }  // fallback rule
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ApprovalRule', ApprovalRuleSchema);
