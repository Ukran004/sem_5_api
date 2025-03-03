const mongoose = require("mongoose");

// ✅ Define the Vendor schema
const VendorSchema = new mongoose.Schema({
    // Vendor's name
    name: { type: String, required: true },
    
    // Category of the service/product provided by the vendor
    category: { type: String, required: true },  // Category is a simple string
    
    // Price of the service/product
    price: { type: Number, required: true },
    
    // URL or path of the vendor's image
    image: { type: String, required: true } // URL to the uploaded image
});

// ✅ Export the Vendor model
module.exports = mongoose.model("Vendor", VendorSchema);
