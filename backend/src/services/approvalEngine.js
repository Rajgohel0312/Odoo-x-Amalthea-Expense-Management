const Approval = require('../models/Approval');
const Expense = require('../models/Expense');
const ApprovalRule = require('../models/ApprovalRule');
const User = require('../models/User');

/** 
 * 🔹 Smart Rule Selector 
 * Selects the most suitable approval rule for an expense 
 * based on category, amount, claimant role, or default.
 */
async function getApplicableRule(expense) {
  const rules = await ApprovalRule.find({ company: expense.company });
  if (!rules.length) return null;

  const claimant = await User.findById(expense.claimant);
  let applicable = rules;

  // Filter by category
  applicable = applicable.filter(
    r => !r.appliesTo.category.length || r.appliesTo.category.includes(expense.category)
  );

  // Filter by amount
  applicable = applicable.filter(
    r =>
      expense.amountInCompanyCurrency >= (r.appliesTo.minAmount || 0) &&
      expense.amountInCompanyCurrency <= (r.appliesTo.maxAmount || Infinity)
  );

  // Filter by claimant role
  applicable = applicable.filter(
    r => !r.appliesTo.roles.length || r.appliesTo.roles.includes(claimant.role)
  );

  // If multiple match, pick most specific (narrowest)
  if (applicable.length > 1) {
    applicable.sort((a, b) => {
      const aScore = (a.appliesTo.category.length ? 1 : 0) + (a.appliesTo.minAmount > 0 ? 1 : 0);
      const bScore = (b.appliesTo.category.length ? 1 : 0) + (b.appliesTo.minAmount > 0 ? 1 : 0);
      return bScore - aScore;
    });
  }

  // fallback
  const finalRule = applicable[0] || rules.find(r => r.appliesTo.default) || rules[0];
  console.log(`✅ Applied rule: ${finalRule.name} for expense ${expense.description}`);
  return finalRule;
}

/**
 * 🔹 Create approvals for an expense based on the applicable rule
 */
async function createApprovalsForExpense(expense) {
  const approvalRule = await getApplicableRule(expense);
  if (!approvalRule) return [];

  const approvers = [];
  const slots = approvalRule.approvers.sort((a, b) => a.order - b.order);

  for (const slot of slots) {
    if (slot.type === 'User' && slot.user) {
      approvers.push({ approver: slot.user.toString(), order: slot.order });
    } else if (slot.type === 'ManagerSlot') {
      const claimant = await User.findById(expense.claimant);
      if (claimant && claimant.manager) {
        approvers.push({ approver: claimant.manager.toString(), order: slot.order });
      } else {
        const admins = await User.find({ company: expense.company, role: 'Admin' }).limit(1);
        if (admins.length) approvers.push({ approver: admins[0]._id.toString(), order: slot.order });
      }
    } else if (slot.type === 'Role' && slot.role) {
      const users = await User.find({ company: expense.company, role: slot.role });
      if (users && users.length) {
        users.forEach(u => approvers.push({ approver: u._id.toString(), order: slot.order }));
      } else {
        const admin = await User.findOne({ company: expense.company, role: 'Admin' });
        if (admin) approvers.push({ approver: admin._id.toString(), order: slot.order });
      }
    }
  }

  // remove duplicates
  const uniqueMap = new Map();
  approvers.forEach(a => {
    const key = `${a.approver}-${a.order}`;
    if (!uniqueMap.has(key)) uniqueMap.set(key, a);
  });

  const createDocs = Array.from(uniqueMap.values()).map(a => ({
    expense: expense._id,
    approver: a.approver,
    order: a.order,
    decision: 'Pending'
  }));

  if (createDocs.length === 0) {
    expense.status = 'Approved';
    await expense.save();
    return [];
  }

  const createdApprovals = await Approval.insertMany(createDocs);
  expense.approvals = createdApprovals.map(a => a._id);
  expense.currentStep = Math.min(...createDocs.map(d => d.order));
  expense.status = 'Waiting';
  expense.approvalRule = approvalRule._id; // ✅ link rule used
  await expense.save();

  return createdApprovals;
}

/**
 * 🔹 Handle approver decision (approve/reject)
 * Logic unchanged from before
 */
async function handleApproverDecision(approvalId, decision, comments) {
  const approval = await Approval.findById(approvalId);
  if (!approval) throw new Error('Approval not found');
  if (approval.decision !== 'Pending') throw new Error('Already decided');

  approval.decision = decision;
  approval.comments = comments || '';
  approval.decidedAt = new Date();
  await approval.save();

  const expense = await Expense.findById(approval.expense).populate('approvals');
  if (!expense) throw new Error('Expense not found');

  const rule = await ApprovalRule.findById(expense.approvalRule);

  const approvals = await Approval.find({ expense: expense._id }).sort({ order: 1 });
  if (!approvals.length) {
    expense.status = 'Approved';
    await expense.save();
    return { status: 'Approved' };
  }

  const orderValues = [...new Set(approvals.map(a => a.order))].sort((a, b) => a - b);
  const stepOrder = approval.order;
  const approvalsInStep = approvals.filter(a => a.order === stepOrder);

  const total = approvalsInStep.length;
  const approvedCount = approvalsInStep.filter(a => a.decision === 'Approved').length;
  const rejectedCount = approvalsInStep.filter(a => a.decision === 'Rejected').length;
  const pendingCount = approvalsInStep.filter(a => a.decision === 'Pending').length;

  let stepApproved = false;
  const cond = rule ? rule.conditional : null;

  if (cond && (cond.type === 'percentage' || cond.type === 'hybrid') && cond.percentageRequired) {
    const pct = (approvedCount / total) * 100;
    if (pct >= cond.percentageRequired) {
      stepApproved = true;
      for (let p of approvalsInStep.filter(a => a.decision === 'Pending')) {
        p.decision = 'Skipped';
        p.decidedAt = new Date();
        await p.save();
      }
    }
  }

  if (!stepApproved) {
    if (rejectedCount > 0) {
      expense.status = 'Rejected';
      await expense.save();
      return { status: 'Rejected' };
    }
    const allDecided = pendingCount === 0;
    if (allDecided) stepApproved = true;
  }

  if (stepApproved) {
    const idx = orderValues.indexOf(stepOrder);
    const nextIdx = idx + 1;
    if (nextIdx >= orderValues.length) {
      expense.status = 'Approved';
      await expense.save();
      return { status: 'Approved' };
    } else {
      const nextOrder = orderValues[nextIdx];
      expense.currentStep = nextOrder;
      expense.status = 'Waiting';
      await expense.save();
      return { status: 'Waiting' };
    }
  }

  expense.status = 'Waiting';
  await expense.save();
  return { status: 'Waiting' };
}

module.exports = { createApprovalsForExpense, handleApproverDecision, getApplicableRule  };
