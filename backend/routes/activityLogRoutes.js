import express from 'express';
import mongoose from 'mongoose';
import ActivityLog from '../models/ActivityLog.js';
import { memoryDb } from '../config/inMemoryStore.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      const logs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(50);
      return res.json({ success: true, logs });
    }

    res.json({
      success: true,
      logs: [
        { _id: 'log-01', user: 'Ravi Kumar (SSE)', role: 'USER', action: 'REPORT_SUBMITTED', description: 'Submitted completion report for task ENG-1042', taskId: 'ENG-1042', timestamp: new Date(Date.now() - 3600000) },
        { _id: 'log-02', user: 'Ravi Kumar (SSE)', role: 'USER', action: 'TASK_STARTED', description: 'Started maintenance work on task ENG-1042', taskId: 'ENG-1042', timestamp: new Date(Date.now() - 7200000) },
        { _id: 'log-03', user: 'Chief Planning Engineer', role: 'ADMIN', action: 'TASK_CREATED', description: 'Assigned task ENG-1042 to Ravi Kumar', taskId: 'ENG-1042', timestamp: new Date(Date.now() - 86400000) }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
