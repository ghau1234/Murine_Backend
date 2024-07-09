require('dotenv').config();
const db_url = process.env.MONGO_URI;
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(db_url);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};
module.exports = connectDB;
