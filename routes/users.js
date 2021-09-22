const express = require('express');

const router = express.Router();

const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

const { signInHandler, signUpHandler, forgotPasswordHandler, getUsersHandler, normalToSupervisorHandler, supervisorToAdminHandler, adminToSupervisorHandler, supervisorToNormalHandler } = require('../controllers/userController');

router.post('/signin', signInHandler);
router.post('/signup', signUpHandler);
router.get('/get-all-users', [verifyToken, isAdmin], getUsersHandler);
router.post('/upgrade-to-supervisor', normalToSupervisorHandler);

module.exports = router;