const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const userRoutes = require('./routes/userRoutes');
const errorHandler = require("./utils/errorHandler");




dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.use('/api/users', userRoutes);
// ✅ Serve static images from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Prevent API Caching
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
});

// Debugging - Show loaded routes
console.log("Checking loaded routes...");
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes);

// Debugging: Print Loaded Routes
console.log("Loaded Routes:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`✅ ${r.route.stack[0].method.toUpperCase()} ${r.route.path}`);
    }
});

// Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: "API route not found" });
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});