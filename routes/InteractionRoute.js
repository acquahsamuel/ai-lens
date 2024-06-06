const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { initiatePrompt, updateInteraction, getAllInteraction } = require("../controllers/InteractionController")
const router = express.Router();

 


router.route("/")
      .post(protect, authorize("user"),initiatePrompt)
      .patch(protect, authorize("user"), updateInteraction)
      .get(protect, authorize("user"),getAllInteraction)


module.exports = router;
