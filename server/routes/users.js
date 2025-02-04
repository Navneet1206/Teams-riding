import express from 'express';
import { auth, userAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import Ride from '../models/Ride.js';

const router = express.Router();

// Get user profile
router.get('/profile', [auth, userAuth], async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', [auth, userAuth], async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's ride history
router.get('/rides', [auth, userAuth], async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.id })
      .populate('captain', 'name vehicleNumber vehicleType rating')
      .sort('-createdAt');
    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;