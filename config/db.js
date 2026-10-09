const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/borrowly");

        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection error:", error.message);
    }
};

module.exports = connectDB;