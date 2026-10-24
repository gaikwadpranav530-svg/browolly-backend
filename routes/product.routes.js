const express = require("express");

const {
    addProduct,
    getAllProducts,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductAvailability
} = require("../controllers/product.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


router.post("/", authMiddleware, addProduct);


router.get("/", getAllProducts);

router.get("/mine", authMiddleware, getMyProducts);

router.get("/:id", getProductById);


router.put("/:id", authMiddleware, updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);

router.patch("/:id/availability",authMiddleware,updateProductAvailability);

module.exports = router;