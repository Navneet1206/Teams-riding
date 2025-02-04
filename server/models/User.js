import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String },
  rides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);