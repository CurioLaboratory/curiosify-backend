const express = require("express");
const router = express.Router();
const fetchuser = require('../../middleware/fetchuser')
// fetch controller functions
const userControllers = require('../../controllers/auth/index');

// user routes
router.route("/signup").post(userControllers.signup);
router.route("/login").post(userControllers.login);
router.route("/getuserdetails").get(fetchuser, userControllers.getuserdetails);

module.exports = router;