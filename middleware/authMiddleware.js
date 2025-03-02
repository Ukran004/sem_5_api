const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify user authentication
exports.authMiddleware = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const token = req.header("Authorization");

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // Verify the token
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

        // Fetch the user from the database to ensure they exist
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

// Middleware to verify admin access
exports.adminMiddleware = (req, res, next) => {
    // Check if the user is authenticated and is an admin
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied, admin only" });
    }
    next();
};