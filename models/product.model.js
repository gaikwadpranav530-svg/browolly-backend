

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        productImages: [
            {
                type: String
            }
        ],

        name: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        hourlyPrice: {
            type: Number,
            required: true
        },

        dailyPrice: {
            type: Number,
            required: true
        },

        productStatus: {
            type: String,
            default: "available"
        },

        description: {
            type: String
        },

        brand: {
            type: String
        },

        model: {
            type: String
        },

        includes: [
            {
                type: String
            }
        ],

        pickupLocation: {
            type: String
        },

        reviewsCount: {
            type: Number,
            default: 0
        },

        addFeature: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "AddFeature"
            }
        ]
    },
    {
        timestamps: true
    }
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;