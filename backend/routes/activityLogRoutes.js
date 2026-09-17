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

    if (!memoryDb.activityLogs || memoryDb.activityLogs.length === 0) {
      memoryDb.activityLogs = [
        { _id: 'log-01', user: 'Chief Planning Engineer', role: 'ADMIN', action: 'REPORT_APPROVED', description: 'Approved work completion verification for task ENG-1042', taskId: 'ENG-1042', timestamp: new Date(Date.now() - 1800000) },
        { _id: 'log-02', user: 'Ravi Kumar (SSE)', role: 'USER', action: 'REPORT_SUBMITTED', description: 'Submitted completion report with Before & After evidence photos for task ENG-1042', taskId: 'ENG-1042', timestamp: new Date(Date.now() - 3600000) },
        { _id: 'log-03', user: 'Ravi Kumar (SSE)', role: 'USER', action: 'TASK_STARTED', description: 'Started maintenance work on track section A-17 for task ENG-1042', taskId: 'ENG-1042', timestamp: new Date(Date.now() - 7200000) },
        { _id: 'log-04', user: 'Chief Planning Engineer', role: 'ADMIN', action: 'BLOCK_APPROVED', description: 'Approved maintenance block demand REQ-801 for VJA-GNT corridor', taskId: 'REQ-801', timestamp: new Date(Date.now() - 14400000) },
        { _id: 'log-05', user: 'Chief Planning Engineer', role: 'ADMIN', action: 'CONFLICT_RESOLVED', description: 'Resolved train overlap conflict CONF-001 by shifting block window to 11:30–13:00', taskId: 'CONF-001', timestamp: new Date(Date.now() - 28800000) },
        { _id: 'log-06', user: 'Chief Planning Engineer', role: 'ADMIN', action: 'TASK_CREATED', description: 'Created and published maintenance task ENG-1042 to Ravi Kumar (SSE)', taskId: 'ENG-1042', timestamp: new Date(Date.now() - 86400000) }
      ];
    }

    res.json({ success: true, logs: memoryDb.activityLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
