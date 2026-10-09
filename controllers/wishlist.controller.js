
const wishlistModel = require("../models/wishlist.model");
const productModel = require("../models/product.model");

// ADD PRODUCT TO WISHLIST
module.exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        let wishlist = await wishlistModel.findOne({
            userId: req.userId
        });

        // If wishlist does not exist, create new wishlist
        if (!wishlist) {
            wishlist = await wishlistModel.create({
                userId: req.userId,
                wishlist: [
                    {
                        productId: productId,
                        ownerId: product.ownerId
                    }
                ]
            });

            return res.status(201).json({
                message: "Product added to wishlist",
                wishlist: wishlist
            });
        }

        // Check if product already exists
        const alreadyAdded = wishlist.wishlist.some(
            (item) => item.productId.toString() === productId
        );

        if (alreadyAdded) {
            return res.status(400).json({
                message: "Product already in wishlist"
            });
        }

        wishlist.wishlist.push({
            productId: productId,
            ownerId: product.ownerId
        });

        await wishlist.save();

        res.status(200).json({
            message: "Product added to wishlist",
            wishlist: wishlist
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add product to wishlist",
            error: error.message
        });
    }
};


// GET MY WISHLIST
module.exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistModel
            .findOne({
                userId: req.userId
            })
            .populate("wishlist.productId")
            .populate("wishlist.ownerId", "-password");

        if (!wishlist) {
            return res.status(200).json({
                message: "Wishlist is empty",
                wishlist: []
            });
        }

        res.status(200).json({
            message: "Wishlist fetched successfully",
            wishlist: wishlist.wishlist
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch wishlist",
            error: error.message
        });
    }
};


// REMOVE PRODUCT FROM WISHLIST
module.exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await wishlistModel.findOne({
            userId: req.userId
        });

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found"
            });
        }

        const itemExists = wishlist.wishlist.some(
            (item) => item.productId.toString() === productId
        );

        if (!itemExists) {
            return res.status(404).json({
                message: "Product not found in wishlist"
            });
        }

        wishlist.wishlist = wishlist.wishlist.filter(
            (item) => item.productId.toString() !== productId
        );

        await wishlist.save();

        res.status(200).json({
            message: "Product removed from wishlist",
            wishlist: wishlist.wishlist
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to remove product from wishlist",
            error: error.message
        });
    }
};