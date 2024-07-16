const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
// fetch controller functions
const userControllers = require('../../controllers/auth/index');

// user routes
router.route("/signup").post(userControllers.signup);
router.route("/login").post(userControllers.login);
router.route("/getuserdetails").get(middleware.fetchuser, userControllers.getuserdetails);

module.exports = router;