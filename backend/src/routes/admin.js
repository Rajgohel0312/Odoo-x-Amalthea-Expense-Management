const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');
const { createApprovalRule, listApprovalRules, allExpenses, overrideExpenseStatus } = require('../controllers/adminController');

router.use(auth, requireRole('Admin'));
router.post('/approval-rules', createApprovalRule);
router.get('/approval-rules', listApprovalRules);
router.get('/expenses', allExpenses);
router.post('/expenses/:id/override', overrideExpenseStatus);

module.exports = router;
