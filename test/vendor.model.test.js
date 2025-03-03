const mongoose = require('mongoose');
const assert = require('assert');  // Built-in Node.js assert module
const Vendor = require('../models/Vendor'); // Path to your Vendor model

describe('Vendor Model', () => {
    // Connect to test database before running tests
    before((done) => {
        mongoose.connect('mongodb://localhost:27017/test_db', { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => done())
            .catch((err) => done(err));
    });

    // Clear test database and close connection after tests
    after((done) => {
        mongoose.connection.dropDatabase()
            .then(() => mongoose.connection.close())
            .then(() => done())
            .catch((err) => done(err));
    });

    // Test: Create a new vendor with required fields
    it('should create a new vendor with required fields', (done) => {
        const vendorData = {
            name: 'Wedding Planner',
            category: 'Event Planning',
            price: 5000,
            image: 'http://example.com/image.jpg'
        };

        const vendor = new Vendor(vendorData);
        vendor.save()
            .then((savedVendor) => {
                // Assertions using Node's built-in assert module
                assert.ok(savedVendor._id);
                assert.strictEqual(savedVendor.name, vendorData.name);
                assert.strictEqual(savedVendor.category, vendorData.category);
                assert.strictEqual(savedVendor.price, vendorData.price);
                assert.strictEqual(savedVendor.image, vendorData.image);
                done();
            })
            .catch((err) => done(err));
    });

    // Test: Try to create a vendor without required fields
    it('should not create a vendor without required fields', (done) => {
        const invalidVendorData = {
            name: 'Vendor without price',
            // Missing category, price, and image
        };

        const vendor = new Vendor(invalidVendorData);
        vendor.save()
            .then(() => done(new Error('Vendor should not have been created')))
            .catch((err) => {
                // Check for validation errors
                assert.ok(err.errors['category']);
                assert.ok(err.errors['price']);
                assert.ok(err.errors['image']);
                done();
            })
            .catch((err) => done(err));
    });

    // Test: Ensure that price is a number
    it('should require the price to be a number', (done) => {
        const invalidVendorData = {
            name: 'Wedding Music',
            category: 'Entertainment',
            price: 'five thousand', // Invalid price (should be a number)
            image: 'http://example.com/music.jpg'
        };

        const vendor = new Vendor(invalidVendorData);
        vendor.save()
            .then(() => done(new Error('Vendor with invalid price should not have been created')))
            .catch((err) => {
                assert.ok(err.errors['price']);
                done();
            })
            .catch((err) => done(err));
    });

    // Test: Check that price can be a valid positive number
    it('should allow price to be a valid positive number', (done) => {
        const validVendorData = {
            name: 'Caterer',
            category: 'Food & Drink',
            price: 3000, // Valid price
            image: 'http://example.com/caterer.jpg'
        };

        const vendor = new Vendor(validVendorData);
        vendor.save()
            .then((savedVendor) => {
                assert.strictEqual(savedVendor.price, validVendorData.price);
                done();
            })
            .catch((err) => done(err));
    });
});