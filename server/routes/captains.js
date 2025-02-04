import express from 'express';
import { auth, captainAuth } from '../middleware/auth.js';
import Captain from '../models/Captain.js';
import Ride from '../models/Ride.js';

const router = express.Router();

// Get captain profile
router.get('/profile', [auth, captainAuth], async (req, res) => {
  try {
    const captain = await Captain.findById(req.user.id).select('-password');
    res.json(captain);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update captain profile
router.put('/profile', [auth, captainAuth], async (req, res) => {
  try {
    const { name, phone, vehicleNumber, taxiLocation } = req.body;
    const captain = await Captain.findById(req.user.id);

    if (name) captain.name = name;
    if (phone) captain.phone = phone;
    if (vehicleNumber) captain.vehicleNumber = vehicleNumber;
    if (taxiLocation) captain.taxiLocation = taxiLocation;

    await captain.save();
    res.json(captain);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update captain location
router.post('/location', [auth, captainAuth], async (req, res) => {
  try {
    const { coordinates } = req.body;
    const captain = await Captain.findById(req.user.id);

    captain.location.coordinates = coordinates;
    await captain.save();

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update captain availability status
router.post('/status', [auth, captainAuth], async (req, res) => {
  try {
    const { status } = req.body;
    const captain = await Captain.findById(req.user.id);

    captain.isAvailable = status === 'active';
    await captain.save();

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get captain's ride history
router.get('/rides', [auth, captainAuth], async (req, res) => {
  try {
    const rides = await Ride.find({ captain: req.user.id })
      .populate('user', 'firstName lastName')
      .sort('-createdAt');
    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;