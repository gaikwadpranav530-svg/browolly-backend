
const addFeatureModel = require("../models/addFeature.model");
const productModel = require("../models/product.model");

// ADD FEATURE
module.exports.addFeature = async (req, res) => {
    try {
        const {
            productId,
            title,
            value
        } = req.body;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const newFeature = await addFeatureModel.create({
            productId,
            title,
            value
        });

        product.addFeature.push(newFeature._id);

        await product.save();

        res.status(201).json({
            message: "Feature added successfully",
            feature: newFeature
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add feature",
            error: error.message
        });
    }
};


// GET PRODUCT FEATURES
module.exports.getProductFeatures = async (req, res) => {
    try {
        const features = await addFeatureModel.find({
            productId: req.params.productId
        });

        res.status(200).json({
            message: "Features fetched successfully",
            features: features
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch features",
            error: error.message
        });
    }
};