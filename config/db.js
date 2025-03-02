const mongoose = require('mongoose'); // Importing the mongoose library to interact with MongoDB

// Function to establish a connection to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection string from environment variables
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // Enables the new URL parser (recommended by Mongoose)
            useUnifiedTopology: true // Enables the new Server Discovery and Monitoring engine
        });

        console.log('✅ MongoDB Connected'); // Log a success message when connected
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message); // Log the error message if connection fails
        process.exit(1); // Exit the application with failure status
    }
};

module.exports = connectDB; // Export the connectDB function to use it in other files
