const User = require('../models/User');

// ✅ Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users and return only name, email, and isAdmin fields
        const users = await User.find({}, 'name email isAdmin');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

// ✅ Delete a user by ID (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        // Find user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Delete the user
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};
