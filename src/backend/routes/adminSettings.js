const express = require('express');
const router = express.Router();
const adminSettingsController = require('../controllers/adminSettingsController');
const authMiddleware = require('../middlewares/authMiddleware');

//create admin setting
router.post('/',  adminSettingsController.createTiming);

// Get admin settings
router.get('/',  adminSettingsController.getTiming);

// Update admin settings
router.put('/:id', adminSettingsController.updateTiming);

module.exports = router;