const express = require('express');
const router = express.Router();
const { getMyProject } = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('client'));

router.get('/dashboard', getMyProject);

module.exports = router;
