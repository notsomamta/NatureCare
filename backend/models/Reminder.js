// File: models/Reminder.js

import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  // Link to the user who owns this reminder
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Link to the specific plant this reminder is for
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true,
  },
  // The type of reminder, e.g., 'Watering', 'Fertilizing'
  reminderType: {
    type: String,
    enum: ['Watering', 'Fertilizing', 'Repotting'], // Restricts to these values
    default: 'Watering',
  },
  // The date when the next reminder is due
  nextDueDate: {
    type: Date,
    required: true,
  },
  // How often the reminder should repeat, e.g., "Every 7 days"
  frequency: {
    type: String,
    required: true,
  },
  // We can add more fields later, like a 'notes' section
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

export default mongoose.model('Reminder', ReminderSchema);