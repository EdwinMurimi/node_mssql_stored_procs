const express = require('express');

const router = express.Router();

const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

const { getProjectsHandler, postProjectsHandler, putProjectsHandler, deleteProjectsHandler } = require('../controllers/projectsController');

router.get('/get-all-projects', getProjectsHandler);
router.post('/post-a-project', verifyToken, postProjectsHandler);
router.put('/update-a-project/:projectID', verifyToken, putProjectsHandler);
router.delete('/delete-a-project/:projectID', [verifyToken, isAdmin], deleteProjectsHandler);

module.exports = router;