const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { initiatePrompt, updateInteraction } = require("../controllers/InteractionController")
const router = express.Router();

 


router.route("/")
      .post(protect, authorize("user"),initiatePrompt)
      .patch(protect, authorize("user"), updateInteraction)


module.exports = router;
