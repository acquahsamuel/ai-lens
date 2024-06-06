
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEYS);
const Interaction = require('../models/Interaction');


const generateRandomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
  };
  



  const generateRandomPassword = () => {
    const length = 25; 
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
  
    return password;
  };





// @route     GET /api/v1/loggedin
// Common logic for generating content and updating/creating interaction
const interactionPromptHandler = async (req, res, next) => {
    const modelTypeInit = req.query.model || "gemini-1.5-flash";

    const message = req.body.prompt;
    const model = genAI.getGenerativeModel({ model: modelTypeInit });
    const result = await model.generateContent(message);
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
        data: interaction,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  };
  
  

  module.exports = { generateRandomString , generateRandomPassword , interactionPromptHandler }