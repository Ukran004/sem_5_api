const express = require("express");
const { body, validationResult } = require("express-validator");
const { register, login, getProfile, updateProfile, uploadProfilePhoto } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ User Registration with Validation
// Ensures name, email, and password are provided and valid
router.post(
    "/register",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    register
);

// ✅ User Login with Validation
// Ensures email and password are provided and valid
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    login
);

// ✅ Get User Profile
// Requires authentication middleware to ensure the user is logged in
router.get("/profile", authMiddleware, getProfile);

// ✅ Update User Profile with Validation
// Allows optional updates for name, email, and password with validation
router.put(
    "/profile",
    authMiddleware,
    [
        body("name").optional().notEmpty().withMessage("Name cannot be empty"),
        body("email").optional().isEmail().withMessage("Valid email required"),
        body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    updateProfile
);

// ✅ Upload Profile Photo
// Requires authentication middleware to allow only logged-in users to upload
router.post("/upload-photo", authMiddleware, uploadProfilePhoto);

// ✅ Export the router module
module.exports = router;