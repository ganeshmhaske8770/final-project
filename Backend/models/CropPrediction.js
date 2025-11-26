// models/CropPrediction.js
const mongoose = require("mongoose");

const CropPredictionSchema = new mongoose.Schema({
  soilPh: { 
    type: Number, 
    required: true, 
    min: 4, 
    max: 9, // assuming typical crop range
  },
  waterAvailability: { 
    type: String, 
    enum: ["Low", "Medium", "High"], 
    required: true 
  },
  season: { 
    type: String, 
    enum: ["Winter", "Monsoon", "Summer"], 
    required: true 
  },
  soilType: { 
    type: String, 
    enum: ["Sandy", "Loamy", "Clay", "Black", "Alluvial"], 
    required: true 
  },
  growingPeriod: { 
    type: String, 
    enum: ["Short", "Medium", "Long"], 
    required: true 
  },
  recommendedCrops: [
    {
      name: { type: String, required: true },
      priority: { type: Number, enum: [1, 2], required: true }, // 1 = best, 2 = alternative
      imageUrl: { type: String, required: false } // optional image field
    }
  ],

  // 🆕 New fields
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: 500 // limit length to avoid very large text
  },
  fertilizers: {
    type: [String], // array of fertilizers
    required: false,
    default: [] // optional
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CropPrediction", CropPredictionSchema);
