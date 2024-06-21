const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

router.post('/verify-token', (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, '9a0b9d1b9292b4e81234567890abcdef01234567890abcdef01234567890abcdef', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      // Assuming decoded contains user info
      res.status(200).json({ user: decoded });
    });
  });

module.exports = router;
