// File: models/Plant.js

import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  // ADD THIS WHOLE BLOCK to link the plant to a user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // You can add more plant-specific fields here later, e.g. type, description
}, {
  timestamps: true, // This is great, it automatically adds createdAt and updatedAt
});

const Plant = mongoose.model('Plant', plantSchema);

export default Plant;
