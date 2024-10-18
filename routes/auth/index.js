const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
// fetch controller functions
const userControllers = require('../../controllers/auth/index');
// user routes
router.route("/signup").post(userControllers.signup);
router.route("/login").post(userControllers.login);
router.route("/getuserdetails").get(middleware.fetchuser, userControllers.getuserdetails);
router.route("/verify-email").post(userControllers.verifyEmail);
router.route("/verifyPassword").post(middleware.fetchuser,userControllers.verifyPassword);
router.route("/deleteAccount").delete(middleware.fetchuser,userControllers.deleteAccount);
module.exports = router;