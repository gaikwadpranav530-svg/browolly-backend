
const mongoose = require("mongoose");

const addFeatureSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        value: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const addFeatureModel = mongoose.model(
    "AddFeature",
    addFeatureSchema
);

module.exports = addFeatureModel;