const Booking = require('../models/Booking');
const Vendor = require('../models/Vendor');

// ✅ Create a new booking - User Side
const createBooking = async (req, res) => {
    try {
        const { service, date, guestCount } = req.body;
        const user = req.user.id;

        // Validate required fields
        if (!service || !date || !guestCount) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if the service exists
        const vendorService = await Vendor.findById(service);
        if (!vendorService) {
            return res.status(404).json({ message: 'Jobs not found.' });
        }

        // Create a new booking instance
        const booking = new Booking({
            user,
            service,
            date,
            guestCount
        });

        await booking.save();

        // Populate the booking details before sending the response
        const populatedBooking = await Booking.findById(booking._id)
            .populate('user', 'name email')
            .populate('service', 'name category price');

        res.status(201).json({ message: 'Booking created successfully.', booking: populatedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking.', error: error.message });
    }
};

// ✅ Approve a booking - Admin Only
const approveBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Application not found.' });

        // Update booking status to confirmed
        booking.status = 'confirmed';
        await booking.save();

        res.status(200).json({ message: 'Application approved.', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error approving application.', error: error.message });
    }
};

// ✅ Decline a booking - Admin Only
const declineBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Application not found.' });

        // Update booking status to declined
        booking.status = 'declined';
        await booking.save();

        res.status(200).json({ message: 'Application declined.', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error declining application.', error: error.message });
    }
};

// ✅ Fetch all bookings - Admin Only
const getBookings = async (req, res) => {
    try {
        // Retrieve all bookings with populated user and service details
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('service', 'name category price');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Applications.', error: error.message });
    }
};

// ✅ Fetch logged-in user's bookings
const getMyBookings = async (req, res) => {
    try {
        // Retrieve bookings associated with the logged-in user
        const bookings = await Booking.find({ user: req.user.id })
            .populate('service', 'name category price');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your Applications.', error: error.message });
    }
};

// ✅ Cancel a booking - User Side
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: 'Application not found.' });

        // Ensure the user can only cancel their own bookings
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: You can only cancel your own application.' });
        }

        // Delete the booking
        await booking.deleteOne();
        res.status(200).json({ message: 'Application cancelled successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling application.', error: error.message });
    }
};

// ✅ Export functions
module.exports = {
    createBooking,
    getBookings,
    getMyBookings,
    cancelBooking,
    approveBooking,
    declineBooking
};
