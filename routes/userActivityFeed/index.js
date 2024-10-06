const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
const activityController = require('../../controllers/userActivityFeed/index');

router.route('/addActivity').post(middleware.fetchuser,activityController.addActivity)
router.route('/getActivity').get(middleware.fetchuser, activityController.getActivities)

module.exports = router;
