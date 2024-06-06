const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { initiatePrompt, updateInteraction, getAllInteraction, getInteractionById, getAllInteractionPrompt } = require("../controllers/InteractionController")
const router = express.Router();

 


router.route("/")
      .post(protect, authorize("user"),initiatePrompt)
      .patch(protect, authorize("user"), updateInteraction)
      .get(protect, authorize("user"),getAllInteraction)


router.route("/all-prompt-titles")
      .get(protect, authorize("user"), getAllInteractionPrompt)

router.route("/:promptId")
       .get(protect, authorize("user"), getInteractionById)


module.exports = router;
