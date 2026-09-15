import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { memoryDb } from '../config/inMemoryStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'railopt_secret_jwt_key_sih2026');

      let user;
      try {
        user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        user = memoryDb.users.find(u => u.id === decoded.id || u.email === decoded.email);
      }

      if (!user) {
        user = {
          id: decoded.id || 'usr-gen',
          email: decoded.email,
          name: decoded.name || 'Railway Staff',
          role: decoded.role || 'USER',
          department: decoded.department || 'Engineering'
        };
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
  }

  // Fallback for prototype testing if no header is passed
  req.user = {
    id: 'usr-admin-01',
    email: 'admin@railopt.demo',
    name: 'Chief Planning Engineer (Admin)',
    role: 'ADMIN',
    department: 'Operations Planning'
  };
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access Denied: Admin authorization required' });
  }
};
