const express = require("express");
const router = express.Router();

// fetch controller functions
const userControllers = require('../../controllers/user/user');

// user routes
router.route("/signup").post(userControllers.signup);
router.route("/login").post(userControllers.login);

module.exports = router;