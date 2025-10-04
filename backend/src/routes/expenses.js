const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createExpense, submitDraft, uploadReceiptAndParse, myExpenses } = require('../controllers/expenseController');

router.use(auth);
router.post('/', createExpense); // create draft or create & submit if body.submit = true
router.post('/:id/submit', submitDraft); // submit a draft
router.post('/upload-receipt', uploadReceiptAndParse);
router.get('/me', myExpenses);

module.exports = router;
