const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
const userChatHistoryControllers = require("../../controllers/userChatHistory/index");

router.route("/addChatMessage").post(userChatHistoryControllers.addChatMessage);
router.route("/getChatHistory/:userId").get(userChatHistoryControllers.getChatHistory);
router.route("/getChatById/:userId/:chatId").get(userChatHistoryControllers.getChatById);



module.exports = router;