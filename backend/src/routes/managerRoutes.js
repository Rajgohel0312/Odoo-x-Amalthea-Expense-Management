const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { requireRole } = require("../middlewares/roles");
const Expense = require("../models/Expense");
const User = require("../models/User");
// ✅ Ensure both middlewares are applied correctly
router.use(auth);
router.use(requireRole("Manager"));
// GET all team expenses (employees under this manager)



// ✅ NEW ROUTE — Recent Approved Expenses
router.get("/recent-approved", async (req, res) => {
  try {
    const companyId = req.user.company._id;
    const expenses = await Expense.find({
      company: companyId,
      status: "Approved",
    })
      .populate("claimant", "name email")
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json(expenses);
  } catch (err) {
    console.error("Recent approved error:", err);
    res.status(500).json({ message: "Failed to load recent approved expenses" });
  }
});
router.get("/team-expenses", async (req, res) => {
  try {
    // Find all employees under this manager
    const employees = await User.find({ manager: req.user._id }, "_id");
    const employeeIds = employees.map((e) => e._id);

    if (employeeIds.length === 0) {
      return res.json([]); // no team members yet
    }

    // Fetch all expenses submitted by those employees
    const expenses = await Expense.find({
      claimant: { $in: employeeIds },
    })
      .populate("claimant", "name email")
      .sort({ dateSpent: -1 });

    res.json(expenses);
  } catch (err) {
    console.error("getTeamExpenses error:", err);
    res.status(500).json({ message: "Failed to load team expenses" });
  }
});

// GET pending employees for this manager
router.get("/pending-employees", auth, requireRole("Manager"), async (req, res) => {
  try {
    const users = await User.find({ manager: req.user._id, status: "Pending" });
    res.json(users);
  } catch (err) {
    console.error("pending-employees error:", err);
    res.status(500).json({ message: "Failed to fetch pending employees" });
  }
});

// POST approve/reject employee
router.post("/employee/:id/decide", auth, requireRole("Manager"), async (req, res) => {
  try {
    const { decision } = req.body; // "Approved" or "Rejected"
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (String(user.manager) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your employee" });
    }

    user.status = decision;
    await user.save();

    res.json({ message: `Employee ${decision}`, user });
  } catch (err) {
    console.error("employee-decision error:", err);
    res.status(500).json({ message: "Failed to update employee status" });
  }
});
router.get("/approval-stats", async (req, res) => {
  try {
    const companyId = req.user.company;
    const managerId = req.user._id;

    const approved = await Expense.countDocuments({
      approver: managerId,
      company: companyId,
      status: "Approved",
    });

    const rejected = await Expense.countDocuments({
      approver: managerId,
      company: companyId,
      status: "Rejected",
    });

    const pending = await Expense.countDocuments({
      approver: managerId,
      company: companyId,
      status: "Pending",
    });

    res.json({ approved, rejected, pending });
  } catch (err) {
    console.error("Manager stats error:", err);
    res.status(500).json({ message: "Failed to load manager stats" });
  }
});
module.exports = router;
