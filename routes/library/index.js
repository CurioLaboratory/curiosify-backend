const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
const libraryControllers = require('../../controllers/library/index');

router.route('/createmanualresource').post(middleware.fetchuser, libraryControllers.createManualResources);
router.route('/getallresource').get(libraryControllers.getAllResources);
router.route('/deleteresource/:id').delete(middleware.fetchuser, libraryControllers.deleteResouces);

module.exports = router;