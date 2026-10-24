const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    flatNo: {
        type: String
    },
    buildingName: {
        type: String
    },
    road: {
        type: String
    },
    city: {
        type: String
    },
    district: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    }
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        addresses: [addressSchema],

        profileImage: {
            type: String
        },

        bio: {
            type: String
        },

        location: {
            type: String
        },

        about: {
            type: String
        },

        coverImage: {
            type: String
        },

        role: {
            type: String,
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;