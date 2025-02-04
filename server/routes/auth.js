import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { sendSMS } from '../utils/twilio.js';
import { generateOTP, createOTPEmail, createOTPMessage } from '../utils/otp.js';
import User from '../models/User.js';
import Captain from '../models/Captain.js';
import Admin from '../models/Admin.js';
import OTP from '../models/OTP.js';
import { auth } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage });

// Send OTP via email
const sendEmailOTP = async (user, email) => {
  const otp = generateOTP();
  const emailContent = createOTPEmail(otp);

  // Save OTP to database
  const otpDoc = new OTP({
    userId: user._id,
    email,
    otp,
    type: 'email',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });
  await otpDoc.save();

  // Send email
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: emailContent.subject,
    html: emailContent.html
  });

  return otpDoc;
};

// Send OTP via SMS
const sendPhoneOTP = async (user, phone) => {
  const otp = generateOTP();
  const message = createOTPMessage(otp);

  // Save OTP to database
  const otpDoc = new OTP({
    userId: user._id,
    phone,
    otp,
    type: 'phone',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });
  await otpDoc.save();

  // Send SMS
  await sendSMS(phone, message);

  return otpDoc;
};

// User signup
router.post('/user/signup', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Validate phone number
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      profilePhoto: req.file ? req.file.path : null,
      verified: false
    });

    await user.save();

    // Send verification OTPs
    await Promise.all([
      sendEmailOTP(user, email),
      sendPhoneOTP(user, phone)
    ]);

    // Generate token
    const token = generateToken(user._id, 'user');

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', auth, async (req, res) => {
  try {
    const { otp, type } = req.body;
    const userId = req.user.id;

    // Find the latest unverified OTP
    const otpDoc = await OTP.findOne({
      userId,
      type,
      verified: false,
      expiresAt: { $gt: new Date() }
    }).sort('-createdAt');

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (otpDoc.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark OTP as verified
    otpDoc.verified = true;
    await otpDoc.save();

    // Check if both email and phone are verified
    const [emailVerified, phoneVerified] = await Promise.all([
      OTP.exists({ userId, type: 'email', verified: true }),
      OTP.exists({ userId, type: 'phone', verified: true })
    ]);

    if (emailVerified && phoneVerified) {
      // Update user verification status
      const user = await User.findById(userId);
      user.verified = true;
      await user.save();
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend OTP
router.post('/resend-otp', auth, async (req, res) => {
  try {
    const { type } = req.body;
    const user = req.user;

    if (type === 'email') {
      await sendEmailOTP(user, user.email);
    } else if (type === 'phone') {
      await sendPhoneOTP(user, user.phone);
    } else {
      return res.status(400).json({ message: 'Invalid OTP type' });
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Other existing routes...

export default router;