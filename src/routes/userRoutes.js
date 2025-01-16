const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const authenticate = require('../middleware/authMiddleware'); 

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.get('/username/:id', authenticate, userController.getUsername);


module.exports = router;
