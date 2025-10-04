const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { requireRole } = require("../middlewares/roles");
const Expense = require("../models/Expense");

const { listPendingForUser, decide } = require("../controllers/approvalController");
// ✅ Get all pending approvals for the manager
router.get("/pending", auth, listPendingForUser);
router.post("/:id/decide", auth, decide);
module.exports = router;
