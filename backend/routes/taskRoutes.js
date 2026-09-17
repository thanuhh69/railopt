import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import MaintenanceTask from '../models/MaintenanceTask.js';
import CompletionReport from '../models/CompletionReport.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import { memoryDb } from '../config/inMemoryStore.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

// Multer Storage Configuration for Evidence Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const taskId = req.params.id || 'general';
    const uploadPath = path.join(process.cwd(), 'uploads', 'maintenance', taskId);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `evidence-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extMatch = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeMatch = allowed.test(file.mimetype);
    if (extMatch && mimeMatch) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, or WEBP image files are allowed.'));
    }
  }
});

// GET My Tasks for logged in user
router.get('/my-tasks', async (req, res) => {
  try {
    const userEmail = req.user?.email || 'user@railopt.demo';
    let tasks = [];

    if (isDbConnected()) {
      tasks = await MaintenanceTask.find({
        $or: [
          { assignedUserEmail: userEmail },
          { assignedUserEmail: 'user@railopt.demo' },
          { status: { $in: ['ASSIGNED', 'IN_PROGRESS', 'Prioritized', 'VERIFICATION_PENDING', 'COMPLETED'] } }
        ]
      }).sort({ dueDate: 1 }).limit(30);
    }

    if (!tasks || tasks.length === 0) {
      tasks = memoryDb.tasks.slice(0, 30);
    }

    return res.json({ success: true, tasks });
  } catch (error) {
    res.json({ success: true, tasks: memoryDb.tasks.slice(0, 30) });
  }
});

// Admin Creates & Assigns Task
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const taskData = req.body;
    if (!taskData.taskId) taskData.taskId = `ENG-${Math.floor(Math.random() * 9000) + 1000}`;
    taskData.status = 'ASSIGNED';
    taskData.createdBy = req.user?.name || 'Admin';

    if (isDbConnected()) {
      const newTask = await MaintenanceTask.create(taskData);
      await Notification.create({
        recipient: taskData.assignedUserEmail || 'user@railopt.demo',
        title: 'New Maintenance Task Assigned',
        message: `Task ${taskData.taskId} (${taskData.title || taskData.maintenanceType}) scheduled on ${taskData.dueDate} has been assigned to you.`,
        type: 'TASK_ASSIGNED',
        taskId: taskData.taskId
      });

      await ActivityLog.create({
        user: req.user?.name || 'Admin',
        role: 'ADMIN',
        action: 'TASK_CREATED',
        description: `Created and assigned task ${taskData.taskId} to ${taskData.assignedUserName || taskData.assignedUserEmail}`,
        taskId: taskData.taskId
      });

      return res.status(201).json({ success: true, task: newTask });
    }

    memoryDb.tasks.unshift(taskData);
    res.status(201).json({ success: true, task: taskData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start Task (ASSIGNED -> IN_PROGRESS)
router.patch('/:id/start', protect, async (req, res) => {
  try {
    const taskId = req.params.id;
    const now = new Date();

    if (isDbConnected()) {
      const task = await MaintenanceTask.findOneAndUpdate(
        { taskId },
        { status: 'IN_PROGRESS', startedAt: now, startedBy: req.user?.name || 'Staff User' },
        { new: true }
      );

      await ActivityLog.create({
        user: req.user?.name || 'Staff User',
        role: 'USER',
        action: 'TASK_STARTED',
        description: `Started work on maintenance task ${taskId}`,
        taskId
      });

      await Notification.create({
        recipient: 'ADMIN',
        title: 'Task Started',
        message: `${req.user?.name || 'Staff'} started work on task ${taskId}.`,
        type: 'TASK_STARTED',
        taskId
      });

      return res.json({ success: true, message: `Task ${taskId} status updated to IN_PROGRESS`, task });
    }

    const task = memoryDb.tasks.find(t => t.taskId === taskId);
    if (task) {
      task.status = 'IN_PROGRESS';
      task.startedAt = now;
      task.startedBy = req.user?.name;
    }
    res.json({ success: true, message: `Task ${taskId} status updated to IN_PROGRESS`, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET Single Task Detail by ID
router.get('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    if (isDbConnected()) {
      const task = await MaintenanceTask.findOne({ taskId });
      if (task) return res.json({ success: true, task });
    }

    const task = memoryDb.tasks.find(t => t.taskId === taskId || t.taskId.toLowerCase() === taskId.toLowerCase());
    if (task) return res.json({ success: true, task });

    res.status(404).json({ success: false, message: 'Maintenance task not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Complete Task (Upload Separate Before/After Images + Create Report -> VERIFICATION_PENDING)
router.post('/:id/complete', protect, upload.any(), async (req, res) => {
  try {
    const taskId = req.params.id;
    const { completionNotes, workPerformed, issuesFound, beforeImageUrls, afterImageUrls } = req.body;

    const files = req.files || [];
    const beforeImages = [];
    const afterImages = [];

    files.forEach(file => {
      const url = `/uploads/maintenance/${taskId}/${file.filename}`;
      if (file.fieldname === 'beforeImages') {
        beforeImages.push(url);
      } else if (file.fieldname === 'afterImages') {
        afterImages.push(url);
      } else {
        beforeImages.push(url);
      }
    });

    if (beforeImageUrls) {
      try {
        const parsed = typeof beforeImageUrls === 'string' ? JSON.parse(beforeImageUrls) : beforeImageUrls;
        if (Array.isArray(parsed)) beforeImages.push(...parsed);
      } catch (e) {}
    }

    if (afterImageUrls) {
      try {
        const parsed = typeof afterImageUrls === 'string' ? JSON.parse(afterImageUrls) : afterImageUrls;
        if (Array.isArray(parsed)) afterImages.push(...parsed);
      } catch (e) {}
    }

    if (beforeImages.length === 0) beforeImages.push('/uploads/sample_before_work.jpg');
    if (afterImages.length === 0) afterImages.push('/uploads/sample_after_work.jpg');

    // Create completion report
    const reportData = {
      taskId,
      submittedBy: req.user?.email || 'user@railopt.demo',
      submittedByName: req.user?.name || 'Ravi Kumar',
      completionNotes: completionNotes || 'Work completed per standards.',
      workPerformed: workPerformed || 'Inspected and serviced asset.',
      issuesFound: issuesFound || 'None reported',
      evidenceImages: [...beforeImages, ...afterImages],
      beforeImages,
      afterImages,
      submittedAt: new Date(),
      verificationStatus: 'PENDING'
    };

    if (isDbConnected()) {
      await CompletionReport.create(reportData);
      const updatedTask = await MaintenanceTask.findOneAndUpdate(
        { taskId },
        { status: 'VERIFICATION_PENDING', rejectionReason: '' },
        { new: true }
      );

      await Notification.create({
        recipient: 'ADMIN',
        title: 'Completion Report Submitted',
        message: `${req.user?.name || 'Staff'} submitted work completion report for task ${taskId} waiting for verification.`,
        type: 'REPORT_SUBMITTED',
        taskId
      });

      await ActivityLog.create({
        user: req.user?.name || 'Staff User',
        role: 'USER',
        action: 'REPORT_SUBMITTED',
        description: `Submitted completion report with Before (${beforeImages.length}) & After (${afterImages.length}) evidence images for task ${taskId}`,
        taskId
      });

      return res.json({ success: true, message: 'Completion report & image evidence submitted. Waiting for admin verification.', task: updatedTask, report: reportData });
    }

    // In-memory fallback
    const task = memoryDb.tasks.find(t => t.taskId === taskId);
    if (task) {
      task.status = 'VERIFICATION_PENDING';
      task.rejectionReason = '';
    }
    res.json({ success: true, message: 'Completion report & image evidence submitted. Waiting for admin verification.', task, report: reportData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
