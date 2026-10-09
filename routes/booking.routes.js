
const express = require("express");

const {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking
} = require("../controllers/booking.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createBooking);

router.get("/", authMiddleware, getAllBookings);


router.get("/:id", authMiddleware, getBookingById);
router.put("/:id", authMiddleware, updateBooking);

module.exports = router;