import express from 'express';
import { auth, userAuth } from '../middleware/auth.js';
import Rating from '../models/Rating.js';
import Captain from '../models/Captain.js';

const router = express.Router();

// Add rating for a ride
router.post('/', [auth, userAuth], async (req, res) => {
  try {
    const { rideId, rating, comment } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const newRating = new Rating({
      ride: rideId,
      user: req.user.id,
      captain: ride.captain,
      rating,
      comment
    });

    await newRating.save();

    // Update captain's average rating
    const ratings = await Rating.find({ captain: ride.captain });
    const avgRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
    
    await Captain.findByIdAndUpdate(ride.captain, { rating: avgRating });

    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ratings for a captain
router.get('/captain/:id', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ captain: req.params.id })
      .populate('user', 'firstName lastName')
      .sort('-createdAt');

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;