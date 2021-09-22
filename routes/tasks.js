const express = require('express');

const router = express.Router();

const verifyToken = require('../middleware/auth');

const { getTasksHandler, postTasksHandler, putTasksHandler, deleteTasksHandler } = require('../controllers/tasksController');

router.get('/get-all-tasks', getTasksHandler);
router.post('/post-a-task', verifyToken, postTasksHandler);
router.put('/update-a-task/:taskID', verifyToken, putTasksHandler);
router.delete('/delete-a-task/:taskID', verifyToken, deleteTasksHandler);

module.exports = router;