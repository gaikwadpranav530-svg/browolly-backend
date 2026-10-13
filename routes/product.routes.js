const express = require("express");

const {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductAvailability
} = require("../controllers/product.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


router.post("/", authMiddleware, addProduct);


router.get("/", getAllProducts);


router.get("/:id", getProductById);


router.put("/:id", authMiddleware, updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);

router.patch("/:id/availability",authMiddleware,updateProductAvailability);

module.exports = router;