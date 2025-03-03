const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get all users (Admin only)
// Requires authentication and admin privileges to access
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

// ✅ Delete a user by ID (Admin only)
// Requires authentication and admin privileges to delete a user
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;