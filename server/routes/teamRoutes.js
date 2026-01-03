const express = require('express');
const router = express.Router();
const { getMyTasks, updateTaskStatus } = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('team', 'admin'));

router.get('/tasks', getMyTasks);
router.patch('/tasks/:taskId', updateTaskStatus);

module.exports = router;
