
const asyncHandler = require('../middleware/async');
const Interaction = require('../models/Interaction');
const moment = require('moment');
const {interactionPromptHandler} = require("../utils/helper-function");



// @route     GET /api/v1/update-interaction
exports.initiatePrompt = asyncHandler(interactionPromptHandler);


// @route     GET /api/v1/update-interaction
exports.updateInteraction = asyncHandler(interactionPromptHandler);


// @route     GET /api/v1/get all interaction
exports.getAllInteraction = asyncHandler(async (req, res, next) => {

    const interaction = await Interaction.find().lean();
    res.status(200).json({
        success: true,
        count : interaction.length,
        data: interaction
      });
});



// @route     GET /api/v1/get all interaction
exports.getInteractionById = asyncHandler(async (req, res, next) => {
    console.log(req.params.promptId);

    const interaction = await Interaction.findById(req.params.promptId);
    res.status(200).json({
        success: true,
        count : interaction.length,
        data: interaction
      });
});




exports.getAllInteractionPrompt = asyncHandler(async (req, res, next) => {
    const interaction = await Interaction.find().lean();
     const prompts = interaction.flatMap(interactionItem => 
        interactionItem.prompts.map(promptItem => ({
            _id: promptItem._id,
            prompt: promptItem.prompt
        }))
    );


    res.status(200).json({
        success: true,
        count : interaction.length,
        data: prompts
      });
});
