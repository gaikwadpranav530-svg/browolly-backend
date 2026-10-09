const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    addAddress,
    getAddresses,
} = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/address", authMiddleware, addAddress);
router.get("/addresses", authMiddleware, getAddresses);


module.exports = router;