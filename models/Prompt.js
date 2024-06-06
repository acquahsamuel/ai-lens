const mongoose = require('mongoose');

const PromptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  type: {
    type: String,
    default : 'text',
    enum: ['text', 'image'],
    required: true
  },

  prompt: {
    type: String,
    required: true
  },

  response: {
    type: String,
    required: true
  },

  model: {
    type: String,
    default: 'gemini-1.5-flash'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save hook to update the `updatedAt` field
PromptSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Prompt', PromptSchema);
