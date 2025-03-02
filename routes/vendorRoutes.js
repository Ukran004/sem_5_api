const express = require("express");
const {
    addService,
    deleteService,
    getServices,
    updateService  // Ensure your vendorController has this method
} = require("../controllers/vendorController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ✅ Add a new service (Only Admins) - Supports file upload
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), addService);

// ✅ Get all services (Public - accessible to everyone, with optional category filter)
router.get("/", getServices);

// ✅ Update a service by ID (Only Admins) - Supports file upload (optional)
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateService);

// ✅ Delete a service by ID (Only Admins)
router.delete("/:id", authMiddleware, adminMiddleware, deleteService);

module.exports = router;

// const express = require("express");
// const {
//     addService,
//     deleteService,
//     getServices,
//     updateService  // Make sure this exists in vendorController
// } = require("../controllers/vendorController");
// const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
// const upload = require("../middleware/uploadMiddleware");

// const router = express.Router();

// // ✅ Add a new service (Only Admins) - Supports file upload
// router.post("/", authMiddleware, adminMiddleware, upload.single("image"), addService);

// // ✅ Get all services (Public - accessible to everyone)
// router.get("/", getServices);

// // ✅ Update a service (Only Admins) - Supports file upload
// router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateService);

// // ✅ Delete a service by ID (Only Admins)
// router.delete("/:id", authMiddleware, adminMiddleware, deleteService);

// module.exports = router;
