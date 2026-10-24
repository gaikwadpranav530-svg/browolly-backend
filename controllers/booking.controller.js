const bookingModel = require("../models/booking.model");
const productModel = require("../models/product.model");

// CALCULATE BOOKING PRICE
const calculateBookingPrice = (duration, product) => {
    const weeks = Math.floor(duration / 7);
    const remainingDays = duration % 7;

    return (
        weeks * product.weeklyPrice +
        remainingDays * product.dailyPrice
    );
};


// CHECK BOOKING AVAILABILITY
const isProductBooked = async (productId, start, end, excludeBookingId = null) => {
    const query = {
        productId,
        startDate: { $lt: end },
        endDate: { $gt: start }
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const existingBooking = await bookingModel.findOne(query);

    return Boolean(existingBooking);
};


// CREATE BOOKING
module.exports.createBooking = async (req, res) => {
    try {
        const {
            productId,
            startDate,
            endDate
        } = req.body;

        if (!productId || !startDate || !endDate) {
            return res.status(400).json({
                message: "Product ID, start date and end date are required"
            });
        }

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

        if (
            isNaN(start.getTime()) ||
            isNaN(end.getTime()) ||
            end <= start
        ) {
            return res.status(400).json({
                message: "Invalid booking dates"
            });
        }

        const timeDifference = end - start;

        const duration = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        // CHECK EXISTING BOOKINGS
        const alreadyBooked = await isProductBooked(
            productId,
            start,
            end
        );

        if (alreadyBooked) {
            return res.status(409).json({
                message: "Product is already booked for the selected dates"
            });
        }

        const calculatedAmount = calculateBookingPrice(
            duration,
            product
        );

        const bookingId = "BK" + Date.now();

        const newBooking = await bookingModel.create({
            ownerId: product.ownerId,
            renterId: req.userId,
            productId,
            bookingId,
            startDate: start,
            endDate: end,
            duration,
            calculatedAmount
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
        })
            .populate("productId")
            .populate("ownerId", "username email phone")
            .populate("renterId", "username email phone");

        res.status(200).json({
            message: "Bookings fetched successfully",
            bookings
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
        const booking = await bookingModel.findOne({
            _id: req.params.id,
            $or: [
                { ownerId: req.userId },
                { renterId: req.userId }
            ]
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking fetched successfully",
            booking
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

        if (
            isNaN(start.getTime()) ||
            isNaN(end.getTime()) ||
            end <= start
        ) {
            return res.status(400).json({
                message: "Invalid booking dates"
            });
        }

        const duration = Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        );

        const product = await productModel.findById(
            booking.productId
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // CHECK OVERLAP, EXCLUDING CURRENT BOOKING
        const alreadyBooked = await isProductBooked(
            booking.productId,
            start,
            end,
            booking._id
        );

        if (alreadyBooked) {
            return res.status(409).json({
                message: "Product is already booked for the selected dates"
            });
        }

        const calculatedAmount = calculateBookingPrice(
            duration,
            product
        );

        booking.startDate = start;
        booking.endDate = end;
        booking.duration = duration;
        booking.calculatedAmount = calculatedAmount;

        await booking.save();

        res.status(200).json({
            message: "Booking updated successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update booking",
            error: error.message
        });
    }
};