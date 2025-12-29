// File: routes/plants.js

import express from 'express';
import Plant from '../models/Plant.js';
import Reminder from '../models/Reminder.js';
import auth from '../middleware/auth.js'; // <-- 1. IMPORT the auth middleware

const router = express.Router();

// @route   GET /api/plants
// @desc    Get all plants FOR THE LOGGED-IN USER
// @access  Private
router.get('/', auth, async (req, res) => { // <-- 2. ADD 'auth' MIDDLEWARE HERE
  try {
    // 3. Find plants that belong to the specific user ID from the token
    const plants = await Plant.find({ user: req.user.id }).sort({ date: -1 });
    res.json(plants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/plants
// @desc    Add a new plant FOR THE LOGGED-IN USER
// @access  Private
router.post('/', auth, async (req, res) => { // <-- 
  const { name, species /* other fields */ } = req.body;

  try {
    const newPlant = new Plant({
      name,
      species,
      // 5. Add the user ID from the token to the new plant
      user: req.user.id,
    });

    const plant = await newPlant.save();
    res.json(plant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/plants/:id
// @desc    Delete a plant (Only by the owner)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the plant by the ID passed in the URL
    const plant = await Plant.findById(req.params.id);

    // Check if plant exists 
    if (!plant) {
      return res.status(404).json({ msg: 'Plant not found' });
    }

    // SECURITY: Verify the user deleting it is the owner 
    if (plant.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await Reminder.deleteMany({ plant: req.params.id }); 

    

    //
    await plant.deleteOne();

    res.json({ msg: 'Plant removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// We can also protect PUT and DELETE routes in the same way
// (We will add those later)

export default router;