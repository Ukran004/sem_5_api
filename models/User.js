const mongoose = require('mongoose');

// ✅ Define the User schema
const UserSchema = new mongoose.Schema({
    // User's full name
    name: { type: String, required: true },
    
    // User's email address (must be unique)
    email: { type: String, required: true, unique: true },
    
    // User's hashed password for authentication
    password: { type: String, required: true },
    
    // Boolean flag to determine if the user has admin privileges
    isAdmin: { type: Boolean, default: false },
    
    // URL or path of the user's profile photo
    profilePhoto: { type: String, default: '' }  // ✅ Optional field for storing profile picture
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// ✅ Export the User model
module.exports = mongoose.model('User', UserSchema);