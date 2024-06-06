const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { saveHistory, getAllHistory } = require("../controllers/HistoryController")
const router = express.Router();


 
router.route("/").post(saveHistory)
router.get("/", protect, getAllHistory)



module.exports = router;
