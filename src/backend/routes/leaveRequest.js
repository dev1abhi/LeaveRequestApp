const express = require('express');
const router = express.Router();
const leaveRequestController = require('../controllers/leaveRequestController');
const authMiddleware = require('../middlewares/authMiddleware');



// Create a new leave request
router.post('/', leaveRequestController.createLeaveRequest);

//get a particular leave request of a employee
router.get('/:id', leaveRequestController.getLeaveRequestById);

// Get all leave requests for admin
router.get('/',  leaveRequestController.getAllLeaveRequests);

// Get leave requests for a specific employee
router.get('/employee/:employeeId', leaveRequestController.getLeaveRequestsByEmployee);

// Update leave request status
router.put('/:id/status', leaveRequestController.updateLeaveRequestStatus);

module.exports = router;
