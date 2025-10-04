// routes/ruleRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const ApprovalRule = require("../models/ApprovalRule");

router.get("/", auth, async (req, res) => {
  try {
    const rules = await ApprovalRule.find({ company: req.user.company._id });
    res.json(rules);
  } catch (err) {
    console.error("Failed to load rules", err);
    res.status(500).json({ message: "Failed to fetch rules" });
  }
});

module.exports = router;
