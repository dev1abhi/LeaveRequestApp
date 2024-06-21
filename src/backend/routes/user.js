const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get details of particular user
router.get('/getEmployees',userController.getUniqueEmployeeDetails);
router.get('/:id',userController.getUserDetails);
router.get('/check-admin/:id',userController.checkAdmin);



module.exports = router;