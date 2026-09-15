import express from 'express';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import { memoryDb } from '../config/inMemoryStore.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

router.get('/', protect, async (req, res) => {
  try {
    const userRole = req.user?.role || 'USER';
    const userEmail = req.user?.email || 'user@railopt.demo';

    if (isDbConnected()) {
      const query = userRole === 'ADMIN'
        ? { recipient: 'ADMIN' }
        : { recipient: userEmail };

      const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
      const unreadCount = await Notification.countDocuments({ ...query, read: false });

      return res.json({ success: true, notifications, unreadCount });
    }

    res.json({
      success: true,
      notifications: [
        {
          _id: 'notif-01',
          title: 'New Task Assigned',
          message: 'Task ENG-1042 (Rail Defect Repair) has been assigned to your queue.',
          type: 'TASK_ASSIGNED',
          read: false,
          createdAt: new Date()
        }
      ],
      unreadCount: 1
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/read', protect, async (req, res) => {
  try {
    if (isDbConnected()) {
      await Notification.findByIdAndUpdate(req.params.id, { read: true });
    }
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
