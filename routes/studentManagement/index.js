const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
const batchControllers = require("../../controllers/studentManagement/index");

router.route("/createBatch").post(batchControllers.createBatch);
router.route("/getAllBatches").get(batchControllers.getAllBatches);
router.route("/getBatch/:id").get(batchControllers.getBatchById);
router.route("/addEmail/:id").post(batchControllers.addEmail);
router.route("/deleteEmail/:id").post(batchControllers.deleteEmail);

module.exports = router;