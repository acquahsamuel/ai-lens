const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { invite, inviteByEmail } = require("../controllers/PromptController");
const { generateSEODescription } = require("../controllers/PromptController")
const router = express.Router();


 
router.route("/").post(generateSEODescription)



module.exports = router;
