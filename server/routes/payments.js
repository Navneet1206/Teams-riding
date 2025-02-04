import express from 'express';
import { auth } from '../middleware/auth.js';
import { createOrder, verifyPayment } from '../utils/razorpay.js';
import Ride from '../models/Ride.js';

const router = express.Router();

// Create payment order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await createOrder(amount);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment order creation failed' });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature, rideId } = req.body;

    const isValid = verifyPayment(orderId, paymentId, signature);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    ride.paymentStatus = 'completed';
    ride.paymentId = paymentId;
    await ride.save();

    res.json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

export default router;