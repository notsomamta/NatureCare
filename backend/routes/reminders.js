// File: routes/reminders.js

import express from 'express';
import auth from '../middleware/auth.js';
import Reminder from '../models/Reminder.js';
import Plant from '../models/Plant.js';
import User from '../models/User.js'; // <-- 1. ADD THIS IMPORT to find the user's email
import { sendReminderEmail } from '../services/mailService.js'; // <-- 2. ADD THIS IMPORT for our email service

const router = express.Router();

// @route   POST /api/reminders
// @desc    Create a new reminder for a plant
// @access  Private
router.post('/', auth, /* ... (existing code is unchanged) ... */ async (req, res) => {
  const { plantId, reminderType, nextDueDate, frequency } = req.body;
  try {
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ msg: 'Plant not found' });
    }
    if (plant.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to access this plant' });
    }
    const newReminder = new Reminder({
      user: req.user.id,
      plant: plantId,
      reminderType,
      nextDueDate,
      frequency,
    });
    const reminder = await newReminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reminders
// @desc    Get all reminders for the logged-in user
// @access  Private
router.get('/', auth, /* ... (existing code is unchanged) ... */ async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ nextDueDate: 1 });
    res.json(reminders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




// @route   POST /api/reminders/test-email
// @desc    Sends a test email to the logged-in user
// @access  Private
router.post('/test-email', auth, async (req, res) => {
  try {
    //  logged-in user to get their email address
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const recipientEmail = user.email;
    const subject = 'Test Reminder from NatureCare';
    const text = `Hello ${user.name},\n\nThis is a test email to confirm that your reminder notifications are working correctly!\n\n- The NatureCare Team`;

    await sendReminderEmail(recipientEmail, subject, text);

    res.json({ msg: 'Test email sent successfully!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


export default router;