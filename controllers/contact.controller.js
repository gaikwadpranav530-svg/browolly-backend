
const contactModel = require("../models/contact.model");

// CREATE CONTACT MESSAGE
module.exports.createContact = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            message
        } = req.body;

        const newContact = await contactModel.create({
            name,
            email,
            address,
            message
        });

        res.status(201).json({
            message: "Contact message submitted successfully",
            contact: newContact
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to submit contact message",
            error: error.message
        });
    }
};


// GET ALL CONTACT MESSAGES
module.exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await contactModel.find();

        res.status(200).json({
            message: "Contact messages fetched successfully",
            contacts: contacts
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch contact messages",
            error: error.message
        });
    }
};