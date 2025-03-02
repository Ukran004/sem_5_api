// const Booking = require("../models/Booking");
// const Vendor = require("../models/Vendor");

// // ✅ Create Booking
// const createBooking = async (req, res) => {
//     try {
//         const { service, date, guestCount } = req.body;
//         const user = req.user.id;

//         if (!service || !date || !guestCount) {
//             return res.status(400).json({ message: "All fields (service, date, guestCount) are required." });
//         }

//         const vendorService = await Vendor.findById(service);
//         if (!vendorService) {
//             return res.status(404).json({ message: "Service not found" });
//         }

//         const newBooking = new Booking({ user, service, date, guestCount });
//         await newBooking.save();

//         const populatedBooking = await Booking.findById(newBooking._id)
//             .populate("service", "name category price")
//             .populate("user", "name email");

//         res.status(201).json({ message: "Booking created successfully", booking: populatedBooking });
//     } catch (error) {
//         res.status(500).json({ message: "Error creating booking", error: error.message });
//     }
// };

// // ✅ Get All Bookings (Admin Only)
// const getBookings = async (req, res) => {
//     try {
//         if (!req.user.isAdmin) {
//             return res.status(403).json({ message: "Unauthorized: Admin access only" });
//         }

//         const bookings = await Booking.find()
//             .populate("user", "name email")
//             .populate("service", "name category price");

//         res.status(200).json(bookings);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching bookings", error: error.message });
//     }
// };

// // ✅ Get User's Own Bookings
// const getMyBookings = async (req, res) => {
//     try {
//         const bookings = await Booking.find({ user: req.user.id })
//             .populate("service", "name category price");

//         res.status(200).json(bookings);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching user bookings", error: error.message });
//     }
// };

// // ✅ Update Booking (User can only update their own)
// const updateBooking = async (req, res) => {
//     try {
//         const { date, guestCount } = req.body;
//         const booking = await Booking.findById(req.params.id);

//         if (!booking) {
//             return res.status(404).json({ message: "Booking not found" });
//         }

//         if (booking.user.toString() !== req.user.id) {
//             return res.status(403).json({ message: "Unauthorized: You can only update your own bookings" });
//         }

//         booking.date = date || booking.date;
//         booking.guestCount = guestCount || booking.guestCount;

//         await booking.save();
//         res.status(200).json({ message: "Booking updated successfully", booking });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating booking", error: error.message });
//     }
// };

// // ✅ Cancel Booking (User can only cancel their own)
// const cancelBooking = async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.id);
//         if (!booking) {
//             return res.status(404).json({ message: "Booking not found" });
//         }

//         if (booking.user.toString() !== req.user.id) {
//             return res.status(403).json({ message: "Unauthorized: You can only cancel your own bookings" });
//         }

//         await booking.deleteOne();
//         res.status(200).json({ message: "Booking cancelled successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error cancelling booking", error: error.message });
//     }
// };

// // ✅ Admin Delete Booking
// const adminDeleteBooking = async (req, res) => {
//     try {
//         if (!req.user.isAdmin) {
//             return res.status(403).json({ message: "Unauthorized: Admin access only" });
//         }

//         const booking = await Booking.findById(req.params.id);
//         if (!booking) {
//             return res.status(404).json({ message: "Booking not found" });
//         }

//         await booking.deleteOne();
//         res.status(200).json({ message: "Booking deleted by admin successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting booking", error: error.message });
//     }
// };

// // ✅ Final Exports
// module.exports = {
//     createBooking,
//     getBookings,
//     getMyBookings,
//     updateBooking,
//     cancelBooking,
//     adminDeleteBooking
// };

const Booking = require('../models/Booking');
const Vendor = require('../models/Vendor');

// ✅ Create Booking - User Side
const createBooking = async (req, res) => {
    try {
        const { service, date, guestCount } = req.body;
        const user = req.user.id;

        if (!service || !date || !guestCount) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const vendorService = await Vendor.findById(service);
        if (!vendorService) {
            return res.status(404).json({ message: 'Jobs not found.' });
        }

        const booking = new Booking({
            user,
            service,
            date,
            guestCount
        });

        await booking.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate('user', 'name email')
            .populate('service', 'name category price');

        res.status(201).json({ message: 'Booking created successfully.', booking: populatedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking.', error: error.message });
    }
};

// ✅ Admin - Approve Booking
const approveBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Application not found.' });

        booking.status = 'confirmed';
        await booking.save();

        res.status(200).json({ message: 'Application approved.', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error approving application.', error: error.message });
    }
};

// ✅ Admin - Decline Booking
const declineBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Application not found.' });

        booking.status = 'declined';
        await booking.save();

        res.status(200).json({ message: 'Application declined.', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error declining Application.', error: error.message });
    }
};

// ✅ Fetch All Bookings - Admin Only
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('service', 'name category price');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Applications.', error: error.message });
    }
};

// ✅ Fetch Logged-in User's Bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('service', 'name category price');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your Applications.', error: error.message });
    }
};

// ✅ Cancel Booking (User Side)
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: 'Application not found.' });

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: You can only cancel your own application.' });
        }

        await booking.deleteOne();
        res.status(200).json({ message: 'Application cancelled successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling application.', error: error.message });
    }
};

module.exports = {
    createBooking,
    getBookings,
    getMyBookings,
    cancelBooking,
    approveBooking,
    declineBooking
};


