const mongoose = require("mongoose");

const PromptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },

  response: {
    type: String,
    required: true,
  }
});

const InteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    default: "text",
    enum: ["text", "image"],
    required: true,
  },

  prompts: {
    type :  [PromptSchema],
  },

  model: {
    type: String,
    default: "gemini-1.5-flash",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


// Add a pre-save hook to update the `updatedAt` field
InteractionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model("Interaction", InteractionSchema);
