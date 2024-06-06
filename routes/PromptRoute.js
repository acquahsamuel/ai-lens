const express = require('express');
// const { protect, authorize } = require('../middleware/auth');
const { initiatePrompt } = require("../controllers/")
const router = express.Router();

 

router.route("/").post(initiatePrompt)

// router.route('/save').post()


module.exports = router;
