const express = require('express');
const router = express.Router();
const userController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:id', verifyToken, userController.getUser);
router.put('/:id', verifyToken, userController.updateUser);
router.get('/', verifyToken, userController.getAllUsers);

module.exports = router;
