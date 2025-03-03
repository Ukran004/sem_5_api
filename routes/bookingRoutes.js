const express = require('express');
const {
    createBooking,
    getBookings,
    getMyBookings,
    cancelBooking,
    approveBooking,
    declineBooking
} = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ User Routes

// Create a new booking (User must be authenticated)
router.post('/', authMiddleware, createBooking);

// Get all bookings of the logged-in user
router.get('/my', authMiddleware, getMyBookings);

// Cancel a booking (User can only cancel their own booking)
router.delete('/:id/cancel', authMiddleware, cancelBooking);

// ✅ Admin Routes (Require authentication and admin privileges)

// Get all bookings (Admin only)
router.get('/', authMiddleware, adminMiddleware, getBookings);

// Approve a booking (Admin only)
router.put('/:id/approve', authMiddleware, adminMiddleware, approveBooking);

// Decline a booking (Admin only)
router.put('/:id/decline', authMiddleware, adminMiddleware, declineBooking);

module.exports = router;
