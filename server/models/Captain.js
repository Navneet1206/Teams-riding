import mongoose from 'mongoose';

const captainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String },
  licenseNumber: { type: String, required: true },
  licensePhoto: { type: String, required: true },
  taxiLocation: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  age: { type: Number, required: true },
  vehicleType: {
    type: String,
    enum: ['hatchback', 'sedan', 'suv', 'muv'],
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  isAvailable: { type: Boolean, default: true },
  currentRide: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  rides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

captainSchema.index({ location: '2dsphere' });

export default mongoose.model('Captain', captainSchema);