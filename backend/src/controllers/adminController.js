const ApprovalRule = require('../models/ApprovalRule');
const Expense = require('../models/Expense');
const Approval = require('../models/Approval');

/** create rule */
const createApprovalRule = async (req, res) => {
  try {
    const { name, approvers, conditional } = req.body;
    const rule = new ApprovalRule({ company: req.user.company._id, name, approvers, conditional });
    await rule.save();
    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create rule failed', error: err.message });
  }
};

const listApprovalRules = async (req, res) => {
  const rules = await ApprovalRule.find({ company: req.user.company._id }).populate('approvers.user conditional.specificApprover');
  res.json(rules);
};

const allExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ company: req.user.company._id })
      .populate('claimant', 'name email role') // Get employee info
      .populate({
        path: 'approvals',
        populate: {
          path: 'approver', // Nested populate inside approvals
          select: 'name email role', // Only necessary fields
        },
      })
      .sort({ createdAt: -1 }); // Latest first

    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
};

/** Admin override: set expense status directly */
const overrideExpenseStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body; // e.g., 'Approved' or 'Rejected'
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    expense.status = status;
    await expense.save();

    // mark all pending approvals as Skipped so they don't remain actionable
    await Approval.updateMany({ expense: expense._id, decision: 'Pending' }, { $set: { decision: 'Skipped', decidedAt: new Date() } });

    res.json({ expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Override failed', error: err.message });
  }
};

module.exports = { createApprovalRule, listApprovalRules, allExpenses, overrideExpenseStatus };
