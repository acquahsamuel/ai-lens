const express = require('express');
// const { protect, authorize } = require('../middleware/auth');
const { invite, inviteByEmail } = require("../controllers/PromptController");
const { generateSEODescription } = require("../controllers/PromptController")
const router = express.Router();


/**
 * Inviting users
 */
// router.route("/users-invited")
//   .get(protect, authorize("user", "admin", "superadmin"), invite);


// router.route("/invite-by-email")
//   .post(protect, authorize("user", "admin", "superadmin"), inviteByEmail);

router.route("/gemini").post(generateSEODescription)



module.exports = router;
