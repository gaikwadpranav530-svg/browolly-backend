
const bookingModel = require("../models/booking.model");
const productModel = require("../models/product.model");

// CREATE BOOKING
module.exports.createBooking = async (req, res) => {
    try {
        const {
            productId,
            startDate,
            endDate
        } = req.body;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.productStatus !== "available") {
            return res.status(400).json({
                message: "Product is not available"
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const timeDifference = end - start;

        const duration = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        if (duration <= 0) {
            return res.status(400).json({
                message: "Invalid booking dates"
            });
        }

        const calculatedAmount =
            duration * product.dailyPrice;

        const bookingId =
            "BK" + Date.now();

        const newBooking = await bookingModel.create({
            ownerId: product.ownerId,
            renterId: req.userId,
            productId: productId,
            bookingId: bookingId,
            startDate: start,
            endDate: end,
            duration: duration,
            calculatedAmount: calculatedAmount
        });

        res.status(201).json({
            message: "Booking created successfully",
            booking: newBooking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create booking",
            error: error.message
        });
    }
};


// GET ALL BOOKINGS
module.exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({
            $or: [
                { ownerId: req.userId },
                { renterId: req.userId }
            ]
        });

        res.status(200).json({
            message: "Bookings fetched successfully",
            bookings: bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};


// GET SINGLE BOOKING
module.exports.getBookingById = async (req, res) => {
    try {
        const booking = await bookingModel.findById(
            req.params.id
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking fetched successfully",
            booking: booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch booking",
            error: error.message
        });
    }
};


// UPDATE BOOKING
module.exports.updateBooking = async (req, res) => {
    try {
        const booking = await bookingModel.findOne({
            _id: req.params.id,
            renterId: req.userId
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found or you are not the renter"
            });
        }

        const start = new Date(
            req.body.startDate || booking.startDate
        );

        const end = new Date(
            req.body.endDate || booking.endDate
        );

        const timeDifference = end - start;

        const duration = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        if (duration <= 0) {
            return res.status(400).json({
                message: "Invalid booking dates"
            });
        }

        const product = await productModel.findById(
            booking.productId
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const calculatedAmount =
            duration * product.dailyPrice;

        booking.startDate = start;
        booking.endDate = end;
        booking.duration = duration;
        booking.calculatedAmount = calculatedAmount;

        await booking.save();

        res.status(200).json({
            message: "Booking updated successfully",
            booking: booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update booking",
            error: error.message
        });
    }
};