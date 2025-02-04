import express from 'express';
import { auth } from '../middleware/auth.js';
import Ride from '../models/Ride.js';
import Captain from '../models/Captain.js';
import { sendRideNotification, sendRideConfirmation } from '../utils/email.js';
import { createOrder, verifyPayment } from '../utils/razorpay.js';

const router = express.Router();

// Create a new ride request
router.post('/', auth, async (req, res) => {
  try {
    const {
      pickup,
      destination,
      distance,
      duration,
      vehicleType,
      paymentMethod,
      scheduledTime
    } = req.body;

    // Calculate fare based on vehicle type and distance
    const baseRate = {
      hatchback: 10,
      sedan: 12,
      suv: 15,
      muv: 18
    };

    const fare = Math.ceil(distance * baseRate[vehicleType]);

    const ride = new Ride({
      user: req.user.id,
      pickup,
      destination,
      distance,
      duration,
      fare,
      vehicleType,
      paymentMethod,
      scheduledTime: scheduledTime || new Date()
    });

    await ride.save();

    // Find nearby available captains
    const nearbyCaptains = await Captain.find({
      isAvailable: true,
      vehicleType,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickup.coordinates.lng, pickup.coordinates.lat]
          },
          $maxDistance: 5000 // 5km radius
        }
      }
    });

    // Notify captains about the new ride
    for (const captain of nearbyCaptains) {
      await sendRideNotification(captain, ride);
    }

    res.status(201).json(ride);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's ride history
router.get('/history', auth, async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.id })
      .populate('captain', 'name vehicleNumber vehicleType rating')
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a ride (captain)
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    ride.captain = req.user.id;
    ride.status = 'accepted';
    await ride.save();

    const captain = await Captain.findById(req.user.id);
    captain.isAvailable = false;
    captain.currentRide = ride._id;
    await captain.save();

    // Send confirmation email to user
    const user = await User.findById(ride.user);
    await sendRideConfirmation(user, { ...ride.toObject(), captain: captain.toObject() });

    res.json(ride);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete a ride
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    ride.status = 'completed';
    await ride.save();

    const captain = await Captain.findById(ride.captain);
    captain.isAvailable = true;
    captain.currentRide = null;
    await captain.save();

    res.json(ride);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;