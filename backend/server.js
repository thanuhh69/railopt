import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import activityLogRoutes from './routes/activityLogRoutes.js';
import corridorRoutes from './routes/corridorRoutes.js';
import trainRoutes from './routes/trainRoutes.js';
import blockRequestRoutes from './routes/blockRequestRoutes.js';
import planningRoutes from './routes/planningRoutes.js';
import conflictRoutes from './routes/conflictRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded evidence images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/corridors', corridorRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/block-requests', blockRequestRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/conflicts', conflictRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', analyticsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/seed', seedRoutes);

// Root landing route for web browsers
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'RAILOPT Automatic Railway Maintenance Block Planning System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      analytics: '/api/analytics',
      maintenance: '/api/maintenance',
      planning: '/api/planning',
      conflicts: '/api/conflicts'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'RAILOPT Enterprise Prototype Backend',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`   RAILOPT Backend Server Running on Port ${PORT}`);
  console.log(`   Automatic Railway Maintenance Block Planning System`);
  console.log(`===================================================`);
});
