const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middlewares/auth");

// Get logged-in employee’s own expenses
router.get("/my-expenses", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ claimant: req.user._id })
      .populate("claimant", "name email")
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching my expenses:", err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

module.exports = router;
