const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },  // Category is a simple string
    price: { type: Number, required: true },
    image: { type: String, required: true }, // URL to the uploaded image
});

module.exports = mongoose.model("Vendor", VendorSchema);
