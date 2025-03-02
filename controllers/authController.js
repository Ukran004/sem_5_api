const bcrypt = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for generating JWT tokens
const crypto = require('crypto'); // Node.js module for cryptographic operations
const User = require('../models/User'); // Importing the User model
const sendEmail = require('../utils/sendEmail'); // Utility function to send emails
const multer = require('multer'); // Middleware for handling file uploads
const fs = require('fs'); // File system module for managing directories
const path = require('path'); // Module for handling and transforming file paths

// Ensure upload directories exist
const profileUploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(profileUploadDir)) {
    fs.mkdirSync(profileUploadDir, { recursive: true }); // Create directory if it doesn't exist
}

// Configure multer storage for profile photos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profileUploadDir); // Save files in the profile upload directory
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`); // Generate a unique filename
    }
});
const upload = multer({ storage });

// ✅ User Registration
exports.register = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const user = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false, // Default isAdmin to false
            profilePhoto: "" // Default empty profile photo
        });

        await user.save(); // Save the user to the database

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Respond with user details and token
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, profilePhoto: user.profilePhoto }
        });
    } catch (error) {
        console.error("Error in Register:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Secure Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        res.set("Cache-Control", "no-store"); // Prevent storing login responses in cache

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Respond with user details and token
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                profilePhoto: user.profilePhoto
            }
        });
    } catch (error) {
        console.error("Error in Login:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get User Profile
exports.getProfile = async (req, res) => {
    try {
        // Fetch user details excluding password
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields if provided
        user.name = name || user.name;
        user.email = email || user.email;

        // Hash new password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Upload Profile Photo (with multer)
exports.uploadProfilePhoto = [
    upload.single('profilePhoto'),
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Store profile photo URL
            user.profilePhoto = `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`;
            await user.save();

            res.status(200).json({ message: 'Profile photo uploaded successfully', profilePhoto: user.profilePhoto });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
];

// ✅ Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

        // Send email with reset link
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message: `Please click on the following link to reset your password: ${resetUrl}`
        });

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
    try {
        // Find user by reset token
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: { $gt: Date.now() } // Ensure token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash and update new password
        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Logout (frontend can clear token)
exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};
