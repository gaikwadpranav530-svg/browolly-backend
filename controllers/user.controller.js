const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// REGISTER USER
module.exports.registerUser = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            phone
        } = req.body;

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            phone
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// LOGIN USER
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const db_user = await userModel.findOne({
            email: email
        });

        if (!db_user) {
            return res.status(400).json({
                message: "Email or password is wrong"
            });
        }

        const match = await bcrypt.compare(
            password,
            db_user.password
        );

        if (!match) {
            return res.status(400).json({
                message: "Email or password is wrong"
            });
        }

        // JWT TOKEN
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        const token = jwt.sign(
            {
                userId: db_user._id,
                email: db_user.email,
                role: db_user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                _id: db_user._id,
                username: db_user.username,
                email: db_user.email,
                phone: db_user.phone,
                role: db_user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

// GET USER PROFILE
module.exports.getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user: user
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};

// UPDATE USER PROFILE
module.exports.updateProfile = async (req, res) => {
    try {
        const {
            username,
            phone,
            bio,
            about,
            location
        } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(
            req.userId,
            {
                username,
                phone,
                bio,
                about,
                location
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Profile update failed",
            error: error.message
        });
    }
};

// ADD ADDRESS
module.exports.addAddress = async (req, res) => {
    try {
        const {
            flatNo,
            buildingName,
            road,
            city,
            district,
            state,
            country
        } = req.body;

        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.addresses.push({
            flatNo,
            buildingName,
            road,
            city,
            district,
            state,
            country
        });

        await user.save();

        res.status(201).json({
            message: "Address added successfully",
            addresses: user.addresses
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add address",
            error: error.message
        });
    }
};

// GET ADDRESSES
module.exports.getAddresses = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Addresses fetched successfully",
            addresses: user.addresses
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch addresses",
            error: error.message
        });
    }
};