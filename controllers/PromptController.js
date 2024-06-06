
const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require('../middleware/async');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEYS);


// @desc      Generate SEO post description
// @route     GET /api/v1/seo-description
exports.generateSEODescription = asyncHandler(async (req, res, next) => {
    const message = req.body.prompt;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const prompt = message;
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
  
    res.status(200).json({
      success: true,
      data: text,
    });
});




// @desc      Generate SEO post description
// @route     GET /api/v1/seo-description
exports.geminiGenerateImage = asyncHandler(async (req, res, next) => {
   
});



 