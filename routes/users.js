const express = require('express');

const router = express.Router();

const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

const { signInHandler, signUpHandler, putUsersHandler, forgotPasswordHandler, getUsersHandler, normalToSupervisorHandler, supervisorToAdminHandler, adminToSupervisorHandler, supervisorToNormalHandler } = require('../controllers/userController');

router.post('/signin', signInHandler);
router.post('/signup', signUpHandler);
router.get('/get-all-users', [verifyToken, isAdmin], getUsersHandler);
router.post('/update-a-user/:userID', verifyToken, putUsersHandler)
router.post('/upgrade-to-supervisor', [verifyToken, isAdmin], normalToSupervisorHandler);
router.post('/upgrade-to-admin', [verifyToken, isAdmin], supervisorToAdminHandler);
router.post('/degrade-to-supervisor', [verifyToken, isAdmin], adminToSupervisorHandler);
router.post('/degrade-to-normal', [verifyToken, isAdmin], supervisorToNormalHandler);

module.exports = router;