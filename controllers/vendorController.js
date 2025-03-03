const Vendor = require("../models/Vendor");

// ✅ Add a new service (Admin only)
exports.addService = async (req, res) => {
    try {
        const { name, category, price } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({ message: "All fields (name, category, price) are required." });
        }

        const newService = new Vendor({
            name,
            category,
            price: parseFloat(price),
            image: req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "",
        });

        await newService.save();

        res.status(201).json({ message: "Service added successfully!", service: newService });
    } catch (error) {
        res.status(500).json({ message: "Error adding service.", error: error.message });
    }
};
// ✅ Get all services (Supports category filtering)


// ✅ Get all services (Public - Supports optional category filtering)
exports.getServices = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};

        if (category && category !== 'All') {
            filter.category = category;  // Apply category filter if provided
        }

        const services = await Vendor.find(filter);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch services", error: error.message });
    }
};

// ✅ Update a service (Admin only)


exports.updateService = async (req, res) => {
    try {
        const { name, category, price } = req.body;
        const { id } = req.params;

        const service = await Vendor.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service not found." });
        }

        // Update text fields
        service.name = name || service.name;
        service.category = category || service.category;
        service.price = price !== undefined ? parseFloat(price) : service.price;

        // ✅ Handle new image upload if file provided
        if (req.file) {
            service.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        await service.save();

        res.status(200).json({ message: "Service updated successfully.", service });
    } catch (error) {
        res.status(500).json({ message: "Error updating service.", error: error.message });
    }
};


// ✅ Delete a service by ID (Admin only)
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Vendor.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service not found." });
        }

        await Vendor.findByIdAndDelete(id);
        res.status(200).json({ message: "Service deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service.", error: error.message });
    }
};


