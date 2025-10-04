const Approval = require("../models/Approval");
const Expense = require("../models/Expense");
const User = require("../models/User");
const { handleApproverDecision } = require("../services/approvalEngine");

// 🔹 List pending approvals for the logged-in user
const listPendingForUser = async (req, res) => {
  try {
    const approvals = await Approval.find({
      approver: req.user._id,
      decision: "Pending"
    }).populate({
      path: "expense",
      populate: { path: "claimant", select: "name email" }
    });

    res.json(approvals);
  } catch (err) {
    console.error("listPendingForUser error:", err);
    res.status(500).json({ message: "Failed to load approvals" });
  }
};

// 🔹 Utility: resolve approver slot to actual user
async function resolveApprover(slot, expense) {
  if (!slot) return null;

  if (slot.type === "ManagerSlot") {
    const claimant = await User.findById(expense.claimant);
    return claimant?.manager || null;
  }

  if (slot.type === "Role") {
    const user = await User.findOne({
      company: expense.company,
      role: slot.role
    });
    return user ? user._id : null;
  }

  if (slot.type === "User") {
    return slot.user || null;
  }

  return null;
}

// 🔹 When approver decides (approve/reject)
const decide = async (req, res) => {
  try {
    const id = req.params.id;
    const { decision, comments } = req.body;

    if (!["Approved", "Rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    const approval = await Approval.findById(id).populate("expense");
    if (!approval) return res.status(404).json({ message: "Approval not found" });

    // ensure current user is this approver
    if (approval.approver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // ensure not already acted
    if (approval.decision !== "Pending") {
      return res.status(400).json({ message: "Already decided" });
    }

    const result = await handleApproverDecision(id, decision, comments);

    res.json({ success: true, message: "Decision recorded", result });
  } catch (err) {
    console.error("decide error:", err);
    res.status(500).json({ message: "Decision failed", error: err.message });
  }
};

module.exports = {
  listPendingForUser,
  decide,
  resolveApprover
};
