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

// User routes
router.post('/', authMiddleware, createBooking);
router.get('/my', authMiddleware, getMyBookings);
router.delete('/:id/cancel', authMiddleware, cancelBooking);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getBookings);
router.put('/:id/approve', authMiddleware, adminMiddleware, approveBooking);
router.put('/:id/decline', authMiddleware, adminMiddleware, declineBooking);

module.exports = router;
