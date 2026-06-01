const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
            console.error(`Database connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Database disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('Database reconnected');
        });

    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;