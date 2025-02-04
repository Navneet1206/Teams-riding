import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  email: { type: String },
  phone: { type: String },
  otp: { type: String, required: true },
  type: { type: String, enum: ['email', 'phone'], required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false }
});

// OTP expires after 10 minutes
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 600 });

export default mongoose.model('OTP', otpSchema);