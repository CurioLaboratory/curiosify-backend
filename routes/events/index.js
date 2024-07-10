const express = require("express");
const router = express.Router();
const middleware = require('../../middleware/index.js')
const eventControllers = require('../../controllers/events/index')

router.route('/getallevent').get(eventControllers.getallevents)
router.route('/addevent').post(middleware.fetchuser, eventControllers.addevents)
router.route('/editevent/:id').post(middleware.fetchuser, eventControllers.editevents)
router.route('/deleteevent/:id').delete(middleware.fetchuser, eventControllers.deleteevents)

module.exports = router;