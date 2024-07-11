const express = require("express");

const router = express.Router();

// auth routes
router.use("/auth", require("./auth/index"));
router.use("/event", require("./events/index"));
router.use("/quiz", require("./quiz/index"));
router.use("/library", require("./library/index"));

module.exports = router;
