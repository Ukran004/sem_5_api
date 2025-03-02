const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    guestCount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'declined'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
