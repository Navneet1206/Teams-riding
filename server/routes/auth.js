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

    // Validation checks
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!validatePhone(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be 8+ chars with uppercase, lowercase, and number'
      });
    }

    // Existing user check
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      const conflictField = existingUser.email === email ? 'Email' : 'Phone';
      return res.status(409).json({ message: `${conflictField} already exists` });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      profilePhoto: req.file?.path || null,
    });

    await user.save();

    // Send OTPs and respond
    await Promise.all([sendEmailOTP(user, email), sendPhoneOTP(user, phone)]);
    const token = generateToken(user._id, 'user');
    res.status(201).json({ token, user: { ...user._doc, password: undefined } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// ✅ Captain Signup
router.post('/captain/signup', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'licensePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const { 
      name, email, phone, password, licenseNumber,
      taxiLocation, vehicleNumber, vehicleType, age 
    } = req.body;

    // Validation checks
    const requiredFields = [
      'name', 'email', 'phone', 'password', 'licenseNumber',
      'taxiLocation', 'vehicleNumber', 'vehicleType', 'age'
    ];
    if (requiredFields.some(field => !req.body[field])) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!validatePhone(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be 8+ chars with uppercase, lowercase, and number'
      });
    }
    if (!['hatchback', 'sedan', 'suv', 'muv'].includes(vehicleType)) {
      return res.status(400).json({ message: 'Invalid vehicle type' });
    }
    if (!req.files?.licensePhoto) {
      return res.status(400).json({ message: 'License photo is required' });
    }

    // Age validation
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 70) {
      return res.status(400).json({ message: 'Age must be between 18-70' });
    }

    // Existing captain check
    const existingCaptain = await Captain.findOne({ $or: [{ email }, { phone }] });
    if (existingCaptain) {
      const conflictField = existingCaptain.email === email ? 'Email' : 'Phone';
      return res.status(409).json({ message: `${conflictField} already exists` });
    }

    // Create captain
    const hashedPassword = await bcrypt.hash(password, 10);
    const captain = new Captain({
      name,
      email,
      phone,
      password: hashedPassword,
      licenseNumber,
      taxiLocation,
      vehicleNumber,
      vehicleType,
      age: ageNum,
      profilePhoto: req.files.profilePhoto?.[0]?.path || null,
      licensePhoto: req.files.licensePhoto[0].path,
      location: { type: 'Point', coordinates: [0, 0] },
    });

    await captain.save();

    // Send OTPs and respond
    await Promise.all([sendEmailOTP(captain, email), sendPhoneOTP(captain, phone)]);
    const token = generateToken(captain._id, 'captain');
    res.status(201).json({ token, captain: { ...captain._doc, password: undefined } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// ✅ Login (User, Captain, Admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }) || 
                 await Captain.findOne({ email }) || 
                 await Admin.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const role = user instanceof User ? 'user' : user instanceof Captain ? 'captain' : 'admin';
    const token = generateToken(user._id, role);

    res.json({ token, user, role });
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

// ✅ Password Reset
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email }) || 
                 await Captain.findOne({ email }) || 
                 await Admin.findOne({ email });

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
                 await Captain.findById(req.user.id).select('-password') || 
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
