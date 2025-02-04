import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' },
  pickup: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  destination: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  distance: { type: Number, required: true },
  duration: { type: Number, required: true },
  fare: { type: Number, required: true },
  vehicleType: {
    type: String,
    enum: ['hatchback', 'sedan', 'suv', 'muv'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  paymentId: { type: String },
  scheduledTime: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ride', rideSchema);