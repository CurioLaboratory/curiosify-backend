const express = require("express");

const router = express.Router();

// auth routes
router.use("/auth", require("./auth/index"));

module.exports = router;
