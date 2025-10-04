const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { listPendingForUser, decide } = require('../controllers/approvalController');

router.use(auth);
router.get('/pending', listPendingForUser);
router.post('/:id/decide', decide);

module.exports = router;
