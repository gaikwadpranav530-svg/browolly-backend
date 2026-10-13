
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        renterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        bookingId: {
            type: String,
            required: false
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        calculatedAmount: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = bookingModel;