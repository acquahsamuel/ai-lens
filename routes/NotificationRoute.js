const express = require('express');
const { protect, authorize } = require('../middleware/auth');
// const { generateSEODescription } = require("../controllers/InteractionController")
const router = express.Router();


 
// router.route("/").post(generateSEODescription)



module.exports = router;
