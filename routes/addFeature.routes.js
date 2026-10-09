
const express = require("express");

const {
    addFeature,
    getProductFeatures
} = require("../controllers/addFeature.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, addFeature);

router.get("/:productId", getProductFeatures);

module.exports = router;