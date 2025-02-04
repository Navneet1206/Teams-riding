import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import Captain from '../models/Captain.js';
import Ride from '../models/Ride.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', [auth, adminAuth], async (req, res) => {
  try {
    const [users, captains, rides] = await Promise.all([
      User.countDocuments(),
      Captain.countDocuments(),
      Ride.find()
    ]);

    const totalRevenue = rides.reduce((acc, ride) => acc + ride.fare, 0);

    // Calculate ride stats for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const rideStats = await Promise.all(
      last7Days.map(async (date) => {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const dayRides = await Ride.find({
          createdAt: {
            $gte: startDate,
            $lt: endDate
          }
        });

        return {
          date,
          rides: dayRides.length,
          revenue: dayRides.reduce((acc, ride) => acc + ride.fare, 0)
        };
      })
    );

    res.json({
      totalUsers: users,
      totalCaptains: captains,
      totalRides: rides.length,
      totalRevenue,
      rideStats: rideStats.reverse()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending ride requests
router.get('/ride-requests', [auth, adminAuth], async (req, res) => {
  try {
    const requests = await Ride.find({ status: 'pending' })
      .populate('user', 'firstName lastName phone email')
      .sort('-createdAt');

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get captains list
router.get('/captains', [auth, adminAuth], async (req, res) => {
  try {
    const captains = await Captain.find()
      .select('-password')
      .sort('-createdAt');

    res.json(captains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user activity
router.get('/user-activity', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt')
      .limit(10);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get captain activity
router.get('/captain-activity', [auth, adminAuth], async (req, res) => {
  try {
    const captains = await Captain.find()
      .select('-password')
      .sort('-createdAt')
      .limit(10);

    res.json(captains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle ride actions (accept/reject)
router.post('/rides/:id/:action', [auth, adminAuth], async (req, res) => {
  try {
    const { id, action } = req.params;
    const ride = await Ride.findById(id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (action === 'accept') {
      ride.status = 'accepted';
    } else if (action === 'reject') {
      ride.status = 'cancelled';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await ride.save();
    res.json(ride);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;