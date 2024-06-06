
const asyncHandler = require('../middleware/async');
const HistoryModel = require("../models/History");


// @desc      Generate SEO post description
// @route     GET /api/v1/save-history by default
exports.saveHistory = asyncHandler(async (req, res, next) => {
    console.log(req.body, "Data payload");

    const history = HistoryModel.create(req.body);

    res.status(201).json({
        success: true,
        data: history
      });
});




// @desc    get all prompt for user   
// @route    
exports.getAllHistory = asyncHandler(async (req, res, next) => {
    const { userId } = req.body;
    console.log(userId, "USER ID");

    const history = await HistoryModel.findOne({ user: userId });
  
    if (!history) {
      return next(new ErrorResponse(`Document not found ${userId}`, 404));
    }
  
    const reviews = "";
    // const reviews = await Review.find({ user: userId }).populate({ path: 'commentFrom user',  select: 'name profileUrl' });
    
   
    res.status(200).json({
      success: true,
      count : history.length,
      data: history  
    })
});




// @desc      Generate SEO post description
// @route     GET /api/v1/seo-description
exports.getHistoryById = asyncHandler(async (req, res, next) => {
    console.log(req.body, "Data payload");
    
    const history = HistoryModel.findById(req.params.promptId);

    res.status(201).json({
        success: true,
        data: history
      });
});


