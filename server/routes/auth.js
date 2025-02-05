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

// Multer configuration for file uploads
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

const router = express.Router();

// 🔹 Send OTP via email
const sendEmailOTP = async (user, email) => {
  const otp = generateOTP();
  const emailContent = createOTPEmail(otp);

  const otpDoc = new OTP({
    userId: user._id,
    email,
    otp,
    type: 'email',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });
  await otpDoc.save();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: emailContent.subject,
    html: emailContent.html
  });

  return otpDoc;
};

// 🔹 Send OTP via SMS
const sendPhoneOTP = async (user, phone) => {
  const otp = generateOTP();
  const message = createOTPMessage(otp);

  const otpDoc = new OTP({
    userId: user._id,
    phone,
    otp,
    type: 'phone',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });
  await otpDoc.save();

  await sendSMS(phone, message);

  return otpDoc;
};

// ✅ User Signup
router.post('/user/signup', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
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

    await Promise.all([sendEmailOTP(user, email), sendPhoneOTP(user, phone)]);
    const token = generateToken(user._id, 'user');

    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Verify OTP
router.post('/verify-otp', auth, async (req, res) => {
  try {
    const { otp, type } = req.body;
    const userId = req.user.id;

    const otpDoc = await OTP.findOne({
      userId,
      type,
      verified: false,
      expiresAt: { $gt: new Date() }
    }).sort('-createdAt');

    if (!otpDoc || otpDoc.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    otpDoc.verified = true;
    await otpDoc.save();

    const [emailVerified, phoneVerified] = await Promise.all([
      OTP.exists({ userId, type: 'email', verified: true }),
      OTP.exists({ userId, type: 'phone', verified: true })
    ]);

    if (emailVerified && phoneVerified) {
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

// ✅ Resend OTP
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

// ✅ User Login
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, 'user');
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id, 'admin');
    res.json({ token, admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Create an Admin (Only for initial setup)
router.post('/admin/create', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Password Reset (Forgetting Password)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email }) || await Admin.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get Profile (Authenticated Users)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password') ||
                 await Admin.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
