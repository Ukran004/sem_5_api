const mongoose = require('mongoose');
const assert = require('assert');
const Booking = require('../models/Booking');
const User = require('../models/User');  // Assuming a User model exists
const Vendor = require('../models/Vendor');  // Assuming a Vendor model exists

describe('Booking Model', () => {
    let userId;
    let vendorId;

    // Connect to test database before running tests
    before((done) => {
        mongoose.connect('mongodb://localhost:27017/test_db', { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                // Create a user and vendor to associate with the booking
                const user = new User({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                });
                const vendor = new Vendor({
                    name: 'Wedding Planner',
                    category: 'Event Planning',
                    price: 5000,
                    image: 'http://example.com/planner.jpg',
                });

                Promise.all([user.save(), vendor.save()])
                    .then(([savedUser, savedVendor]) => {
                        userId = savedUser._id;
                        vendorId = savedVendor._id;
                        done();
                    })
                    .catch((err) => done(err));
            })
            .catch((err) => done(err));
    });

    // Clear test database and close connection after tests
    after((done) => {
        mongoose.connection.dropDatabase()
            .then(() => mongoose.connection.close())
            .then(() => done())
            .catch((err) => done(err));
    });

    // Test: Create a new booking with all required fields
    it('should create a new booking with required fields', (done) => {
        const bookingData = {
            user: userId,
            service: vendorId,
            date: new Date('2025-06-01'),
            guestCount: 100,
            status: 'pending',
        };

        const booking = new Booking(bookingData);
        booking.save()
            .then((savedBooking) => {
                // Assertions using Node's built-in assert module
                assert.ok(savedBooking._id);
                assert.strictEqual(savedBooking.user.toString(), bookingData.user.toString());
                assert.strictEqual(savedBooking.service.toString(), bookingData.service.toString());
                assert.strictEqual(savedBooking.date.toString(), bookingData.date.toString());
                assert.strictEqual(savedBooking.guestCount, bookingData.guestCount);
                assert.strictEqual(savedBooking.status, bookingData.status);
                done();
            })
            .catch((err) => done(err));
    });

    // Test: Create booking without required fields
    it('should not create a booking without required fields', (done) => {
        const invalidBookingData = {
            // Missing required fields like user, service, date, and guestCount
        };

        const booking = new Booking(invalidBookingData);
        booking.save()
            .then(() => done(new Error('Booking should not have been created')))
            .catch((err) => {
                assert.ok(err.errors['user']);
                assert.ok(err.errors['service']);
                assert.ok(err.errors['date']);
                assert.ok(err.errors['guestCount']);
                done();
            })
            .catch((err) => done(err));
    });

    // Test: Ensure the status is within the allowed enum values
    it('should have a default status of "pending" if no status is provided', (done) => {
        const bookingData = {
            user: userId,
            service: vendorId,
            date: new Date('2025-06-01'),
            guestCount: 100,
        };

        const booking = new Booking(bookingData);
        booking.save()
            .then((savedBooking) => {
                assert.strictEqual(savedBooking.status, 'pending');
                done();
            })
            .catch((err) => done(err));
    });

    it('should not create a booking with an invalid status', (done) => {
        const invalidBookingData = {
            user: userId,
            service: vendorId,
            date: new Date('2025-06-01'),
            guestCount: 100,
            status: 'invalid', // Invalid status value
        };

        const booking = new Booking(invalidBookingData);
        booking.save()
            .then(() => done(new Error('Booking should not have been created with an invalid status')))
            .catch((err) => {
                assert.ok(err.errors['status']);
                done();
            })
            .catch((err) => done(err));
    });
});