const Expense = require('../models/Expense');
const ApprovalRule = require('../models/ApprovalRule');
const { createApprovalsForExpense } = require('../services/approvalEngine');
const { convert } = require('../services/currencyService');
const { parseReceipt } = require('../services/ocrService');
const User = require('../models/User');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
   const { getApplicableRule } = require("../services/approvalEngine");
/**
 * create draft expense (status Draft)
 * if body has submit: true -> run submit flow which triggers approvals
 */

const createExpense = async (req, res) => {
  try {
    const claimant = req.user;
    const {
      originalAmount,
      originalCurrency,
      category,
      description,
      dateSpent,
      submit
    } = req.body;

    if (!originalAmount || !originalCurrency)
      return res.status(400).json({ message: "Amount & currency required" });

    const companyCurrency = claimant.company.currency || "INR";
    const converted = await convert(Number(originalAmount), originalCurrency, companyCurrency);

    // Step 1️⃣ - Create Draft Expense
    const expense = new Expense({
      company: claimant.company._id,
      claimant: claimant._id,
      originalAmount: Number(originalAmount),
      originalCurrency,
      amountInCompanyCurrency: converted,
      companyCurrency,
      category,
      description,
      dateSpent: dateSpent || new Date(),
      receipts: req.body.receipts || [],
      status: "Draft",
    });

    await expense.save();

    // Step 2️⃣ - If not submitted yet, return draft
    if (!submit) {
      return res.json({ expense });
    }

    // Step 3️⃣ - Expense is being submitted now
    expense.submittedAt = new Date();

    // Step 4️⃣ - Pick applicable approval rule automatically
    const rules = await ApprovalRule.find({ company: claimant.company._id });
    let appliedRule = null;

    if (rules.length > 0) {
      // Dynamically select best rule (via approvalEngine helper)
   
      appliedRule = await getApplicableRule(expense);

      if (appliedRule) {
        expense.approvalRule = appliedRule._id;
        await expense.save();
        const approvals = await createApprovalsForExpense(expense);
        return res.json({ expense, approvals, rule: appliedRule.name });
      }
    }

    // Step 5️⃣ - Fallback: no rule found → use default manager approval
    const claimantObj = await User.findById(claimant._id);
    if (claimantObj.manager) {
      const defaultRule = {
        approvers: [{ type: "User", user: claimantObj.manager, order: 1 }],
        conditional: { type: "none" },
      };
      await createApprovalsForExpense(expense, defaultRule);
      return res.json({ expense, rule: "Default Manager Rule" });
    }

    // Step 6️⃣ - Fallback: no manager, no rule → auto-approve
    expense.status = "Approved";
    await expense.save();
    return res.json({ expense, rule: "Auto Approved (No Manager / Rule)" });

  } catch (err) {
    console.error("createExpense error:", err);
    res.status(500).json({ message: "Failed to create expense", error: err.message });
  }
};

// Submit a previously saved draft
const submitDraft = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const claimant = req.user;
    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (expense.claimant.toString() !== claimant._id.toString()) return res.status(403).json({ message: 'Not allowed' });
    if (expense.status !== 'Draft') return res.status(400).json({ message: 'Only draft can be submitted' });

    expense.submittedAt = new Date();
    // choose rule
    const rule = expense.approvalRule ? await ApprovalRule.findById(expense.approvalRule) : await ApprovalRule.findOne({ company: claimant.company._id });
    if (!rule) {
      // default manager-only
      const claimantObj = await User.findById(claimant._id);
      if (claimantObj.manager) {
        const defaultRule = { approvers: [{ type: 'User', user: claimantObj.manager, order: 1 }], conditional: { type: 'none' } };
        await createApprovalsForExpense(expense, defaultRule);
      } else {
        expense.status = 'Approved';
        await expense.save();
        return res.json({ expense });
      }
    } else {
      expense.approvalRule = rule._id;
      await expense.save();
      const approvals = await createApprovalsForExpense(expense, rule);
      return res.json({ expense, approvals });
    }
    await expense.save();
    res.json({ expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Submit failed', error: err.message });
  }
};

const uploadReceiptAndParse = [
  upload.single('receipt'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      const filePath = req.file.path;
      const parsed = await parseReceipt(filePath);
      res.json({ parsed });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'OCR failed', error: err.message });
    }
  }
];
const myExpenses = async (req, res) => {
  const expenses = await Expense.find({ claimant: req.user._id })
    .populate({
      path: 'approvals',
      populate: { path: 'approver', select: 'name email role' } // ✅ populate approver details
    })
    .sort({ createdAt: -1 });

  res.json(expenses);
};
module.exports = { createExpense, submitDraft, uploadReceiptAndParse, myExpenses };
