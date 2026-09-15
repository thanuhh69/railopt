import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { memoryDb } from '../config/inMemoryStore.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, name: user.fullName || user.name, role: user.role, department: user.department },
    process.env.JWT_SECRET || 'railopt_secret_jwt_key_sih2026',
    { expiresIn: '7d' }
  );
};

// User Self-Registration
router.post('/register', async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword, phone, employeeId, department, designation } = req.body;

    if (!fullName || !username || !email || !password || !employeeId) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Force role USER for normal registration
    const role = 'USER';

    if (isDbConnected()) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ success: false, message: 'User with this email already exists.' });

      const existingUsername = await User.findOne({ username });
      if (existingUsername) return res.status(400).json({ success: false, message: 'Username is already taken.' });

      const newUser = await User.create({
        fullName,
        username,
        email,
        password,
        phone: phone || '',
        employeeId,
        department: department || 'Engineering',
        designation: designation || 'Senior Section Engineer',
        role
      });

      const token = generateToken(newUser);
      return res.status(201).json({
        success: true,
        message: 'Registration successful. Please login.',
        token,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          employeeId: newUser.employeeId
        }
      });
    }

    // In-memory fallback
    const exists = memoryDb.users.find(u => u.email === email || u.username === username);
    if (exists) return res.status(400).json({ success: false, message: 'User already exists in in-memory store.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const memUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      fullName,
      username,
      email,
      password: hashedPassword,
      phone: phone || '',
      employeeId,
      department: department || 'Engineering',
      designation: designation || 'Senior Section Engineer',
      role: 'USER'
    };
    memoryDb.users.push(memUser);

    const token = generateToken(memUser);
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please login.',
      token,
      user: {
        id: memUser.id,
        fullName: memUser.fullName,
        email: memUser.email,
        role: memUser.role,
        department: memUser.department,
        employeeId: memUser.employeeId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password.' });
    }

    // Default admin accounts setup
    if (email === 'admin@railopt.demo' || email === 'admin@railopt.in') {
      const adminUser = {
        id: 'usr-admin-01',
        name: 'Chief Planning Engineer (Admin)',
        fullName: 'Chief Planning Engineer (Admin)',
        email: email,
        role: 'ADMIN',
        department: 'Operations Planning'
      };
      const token = generateToken(adminUser);
      return res.json({ success: true, token, user: adminUser });
    }

    if (isDbConnected()) {
      const dbUser = await User.findOne({ email });
      if (dbUser && (await dbUser.matchPassword(password))) {
        const token = generateToken(dbUser);
        return res.json({
          success: true,
          token,
          user: {
            id: dbUser._id,
            fullName: dbUser.fullName,
            name: dbUser.fullName,
            email: dbUser.email,
            role: dbUser.role,
            department: dbUser.department,
            employeeId: dbUser.employeeId
          }
        });
      }
    }

    // In-memory fallback
    const memUser = memoryDb.users.find(u => u.email === email);
    if (memUser) {
      const match = memUser.password ? await bcrypt.compare(password, memUser.password) : true;
      if (match) {
        const token = generateToken(memUser);
        return res.json({
          success: true,
          token,
          user: {
            id: memUser.id,
            fullName: memUser.fullName || memUser.name,
            name: memUser.fullName || memUser.name,
            email: memUser.email,
            role: memUser.role,
            department: memUser.department,
            employeeId: memUser.employeeId
          }
        });
      }
    }

    // Prototype fallback for user@railopt.demo
    if (email === 'user@railopt.demo') {
      const defaultUser = {
        id: 'usr-user-02',
        name: 'Ravi Kumar (SSE)',
        fullName: 'Ravi Kumar (SSE)',
        email: 'user@railopt.demo',
        role: 'USER',
        department: 'Engineering'
      };
      const token = generateToken(defaultUser);
      return res.json({ success: true, token, user: defaultUser });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Current User Profile
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
