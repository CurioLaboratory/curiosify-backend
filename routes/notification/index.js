const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
const quizControllers = require('../../controllers/notification/Notification');


router.route('/getallnotification').get(middleware.fetchuser, quizControllers.getNotifications);


module.exports = router;