const express = require("express");

const router = express.Router();

// auth routes
router.use("/auth", require("./auth/index"));
router.use("/event", require("./events/index"));

module.exports = router;
