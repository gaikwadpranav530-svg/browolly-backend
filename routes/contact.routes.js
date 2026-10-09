
const express = require("express");

const {
    createContact,
    getAllContacts
} = require("../controllers/contact.controller");

const router = express.Router();

router.post("/", createContact);

router.get("/", getAllContacts);

module.exports = router;