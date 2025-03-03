const mongoose = require('mongoose');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../server.js');  // Import the Express app
const User = require('../models/User');

describe('Auth Controller', () => {
    let userId;
    let token;

    before((done) => {
        // Ensure mongoose is connected to the test database only once
        if (mongoose.connection.readyState === 0) {
            mongoose.connect('mongodb://localhost:27017/test_db', { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => {
                    // Create a test user for login and profile-related tests
                    const user = new User({
                        name: 'Test User',
                        email: 'testuser@example.com',
                        password: bcrypt.hashSync('password123', 10),
                        isAdmin: false,
                    });

                    return user.save();
                })
                .then((user) => {
                    userId = user._id;
                    token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
                    done();
                })
                .catch((err) => done(err));
        } else {
            done();
        }
    });

    after((done) => {
        mongoose.connection.close()
            .then(() => done())
            .catch((err) => done(err));
    });


    it('should not login with incorrect credentials', (done) => {
        const loginUser = {
            email: 'testuser@example.com',
            password: 'wrongpassword',
        };

        request(app)
            .post('/api/auth/login')
            .send(loginUser)
            .expect(400)
            .then((response) => {
                assert.strictEqual(response.body.message, 'Invalid email or password');
                done();
            })
            .catch((err) => done(err));
    });



    it('should not get the profile for invalid token', (done) => {
        request(app)
            .get('/api/auth/profile')
            .set('Authorization', 'Bearer invalidToken')
            .expect(401)
            .then((response) => {
                assert.strictEqual(response.body.message, 'Invalid token');
                done();
            })
            .catch((err) => done(err));
    });


});