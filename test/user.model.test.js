const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../models/User'); // Import your User model

describe('User Model', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/test_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should create a new user with required fields', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        };

        const user = new User(userData);
        const savedUser = await user.save();

        assert.ok(savedUser._id); // Check that user has an _id
        assert.strictEqual(savedUser.name, userData.name); // Check that name matches
        assert.strictEqual(savedUser.email, userData.email); // Check that email matches
        assert.strictEqual(savedUser.password, userData.password); // Check that password matches
        assert.strictEqual(savedUser.isAdmin, false); // Default value check
        assert.strictEqual(savedUser.profilePhoto, ''); // Default value check
    });

    it('should not create a user without required fields', async () => {
        const invalidUserData = {
            name: 'Invalid User',
            // Missing email and password fields
        };

        const user = new User(invalidUserData);
        try {
            await user.save();
            throw new Error('User should not have been created');
        } catch (err) {
            assert.ok(err.errors.email); // Check email field error
            assert.ok(err.errors.password); // Check password field error
        }
    });
});