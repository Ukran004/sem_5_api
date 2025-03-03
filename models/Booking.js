const mongoose = require('mongoose');

// ✅ Define the Booking schema
const BookingSchema = new mongoose.Schema({
    // Reference to the User who made the booking
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Reference to the Vendor service being booked
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    // Date of the booking
    date: {
        type: Date,
        required: true
    },
    // Number of guests for the booking
    guestCount: {
        type: Number,
        required: true
    },
    // Status of the booking: pending, confirmed, or declined
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'declined'],
        default: 'pending'
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// ✅ Export the Booking model
module.exports = mongoose.model('Booking', BookingSchema);
