
const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require('../middleware/async');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEYS);
const Interaction = require('../models/Interaction');



// @route     GET /api/v1/loggedin
exports.initiatePrompt = asyncHandler(async (req, res, next) => {
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
            userId: req.user._id,
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



// @route     GET /api/v1/update-interaction 
exports.updateInteraction = asyncHandler(async (req, res, next) => {

    const modelTypeInit = req.query.model || "gemini-1.5-flash";
    const userId = req.user._id;

    const message = req.body.prompt;
    const queryId = req.query.id;

    // console.log(queryId, message, req.user);
  
    const model = genAI.getGenerativeModel({ model: modelTypeInit });
    const prompt = message;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
  
    try {
      
      let interaction = await Interaction.findOne({ userId: req.user._id, model: modelTypeInit });
  
      if (interaction) {
        interaction.prompts.push({ prompt: message, response: text });
     
    } else {

        interaction = new Interaction({
          userId: req.user._id,  
          type: "text", 
          prompts: [{ prompt: message, response: text }],
          model: modelTypeInit,
        });
      }
  
   
      await interaction.save();
  
      res.status(200).json({
        success: true,
        data: text,
      });

    } catch (err) {
   
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  });
 

