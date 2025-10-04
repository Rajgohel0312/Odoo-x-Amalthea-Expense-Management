const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');
const { createUser, listUsers, updateUser,resendPassword } = require('../controllers/userController');

router.use(auth);
router.post('/', requireRole('Admin'), createUser);
router.get('/', requireRole('Admin'), listUsers);
router.put('/:id', requireRole('Admin'), updateUser);

router.post('/:id/resend-password', requireRole('Admin'), resendPassword);
module.exports = router;
