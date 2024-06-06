
const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require('../middleware/async');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEYS);
const Interaction = require('../models/Interaction');



// @route     GET /api/v1/loggedin
exports.initiatePrompt = asyncHandler(async (req, res, next) => {
    const userId = req.body; 

    const modelTypeInit = req.query.model || "gemini-1.5-flash";;
    
    const message = req.body.prompt;
    const model = genAI.getGenerativeModel({ model: modelTypeInit });
  
    const prompt = message;
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
  

    try {
        // Create a new interaction instance
        const interaction = new Interaction({
            // userId: req.user._id, 
            userId: "6661a0dfcf1a84560145c8e5", 
            type: "text",
            prompts: [{ prompt: message, response: text }],
            model: modelTypeInit,
        });

        
        await interaction.save();
        res.status(200).json({
            success: true,
            data: interaction,
        });

    } catch (err) {
        // Handle any errors
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});




// @desc      Generate prompt and save
// @route     GET /api/v1/not-loggedIn
exports.geminiGenerateImage = asyncHandler(async (req, res, next) => {
    const modelTypeInit = req.query.model || "gemini-1.5-flash";;
    
    const message = req.body.prompt;
    const model = genAI.getGenerativeModel({ model: modelTypeInit });
  
    const prompt = message;
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
  

    try {
        // Create a new interaction instance
        const interaction = new Interaction({
            // userId: req.user._id, 
            userId: "6661a0dfcf1a84560145c8e5", 
            type: "text",
            prompts: [{ prompt: message, response: text }],
            model: modelTypeInit,
        });

        
        await interaction.save();
        res.status(200).json({
            success: true,
            data: interaction,
        });

    } catch (err) {
        // Handle any errors
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});



 