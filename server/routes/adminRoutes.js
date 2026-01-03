const express = require('express');
const router = express.Router();
const { createClientWorkflow, getReports, getAllUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.post('/clients', createClientWorkflow);
router.get('/reports', getReports);
router.get('/users', getAllUsers);

module.exports = router;
