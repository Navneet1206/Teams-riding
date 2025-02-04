import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Captain from '../models/Captain.js';
import Admin from '../models/Admin.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;

    switch (decoded.role) {
      case 'user':
        user = await User.findById(decoded.id);
        break;
      case 'captain':
        user = await Captain.findById(decoded.id);
        break;
      case 'admin':
        user = await Admin.findById(decoded.id);
        break;
      default:
        throw new Error();
    }

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const adminAuth = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const captainAuth = (req, res, next) => {
  if (req.userRole !== 'captain') {
    return res.status(403).json({ message: 'Captain access required' });
  }
  next();
};

export const userAuth = (req, res, next) => {
  if (req.userRole !== 'user') {
    return res.status(403).json({ message: 'User access required' });
  }
  next();
};