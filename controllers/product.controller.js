const productModel = require("../models/product.model");

// ADD PRODUCT
module.exports.addProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            hourlyPrice,
            dailyPrice,
            weeklyPrice,
            productStatus,
            description,
            productImages,
            brand,
            model,
            includes,
            pickupLocation
        } = req.body;

        const newProduct = await productModel.create({
            ownerId: req.userId,
            name,
            category,
            hourlyPrice,
            dailyPrice,
            weeklyPrice,
            productStatus,
            description,
            productImages,
            brand,
            model,
            includes,
            pickupLocation
        });

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add product",
            error: error.message
        });
    }
};


// GET ALL PRODUCTS
module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel
            .find({ productStatus: "available" })
            .populate("ownerId", "username");

        res.status(200).json({
            message: "Products fetched successfully",
            products: products
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};

module.exports.getMyProducts = async (req, res) => {
    try {
        const products = await productModel
            .find({ ownerId: req.userId })
            .populate("ownerId", "username");

        res.status(200).json({
            message: "Your products fetched successfully",
            products
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch your products",
            error: error.message
        });
    }
};


// GET SINGLE PRODUCT
module.exports.getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            product: product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};


// UPDATE PRODUCT
module.exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productModel.findOneAndUpdate(
            {
                _id: req.params.id,
                ownerId: req.userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found or you are not the owner"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};


// DELETE PRODUCT
module.exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productModel.findOneAndDelete({
            _id: req.params.id,
            ownerId: req.userId
        });

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found or you are not the owner"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};

// UPDATE PRODUCT AVAILABILITY
module.exports.updateProductAvailability = async (req, res) => {
    try {
        const { productStatus } = req.body;

        if (!["available", "unavailable"].includes(productStatus)) {
            return res.status(400).json({
                message: "Status must be available or unavailable"
            });
        }

        const product = await productModel.findOneAndUpdate(
            {
                _id: req.params.id,
                ownerId: req.userId
            },
            {
                productStatus
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you are not the owner"
            });
        }

        res.status(200).json({
            message: "Product availability updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update product availability",
            error: error.message
        });
    }
};