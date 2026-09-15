import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import MaintenanceTask from '../models/MaintenanceTask.js';
import { memoryDb } from '../config/inMemoryStore.js';
import { evaluateTaskPriorityWithGrok, calculateFallbackPriority } from '../services/priorityEngine.js';
import { parseCSVBuffer } from '../services/csvParser.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const isDbConnected = () => mongoose.connection.readyState === 1;

// Get paginated, filtered maintenance tasks
router.get('/', async (req, res) => {
  try {
    const { department, priority, corridor, status, search, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    if (isDbConnected()) {
      const query = {};
      if (department && department !== 'All') query.department = department;
      if (priority && priority !== 'All') query.priorityLevel = priority.toUpperCase();
      if (corridor && corridor !== 'All') query.corridorId = corridor;
      if (status && status !== 'All') query.status = status;
      if (search) {
        query.$or = [
          { taskId: { $regex: search, $options: 'i' } },
          { assetName: { $regex: search, $options: 'i' } },
          { issueDescription: { $regex: search, $options: 'i' } }
        ];
      }
      const skip = (pageNum - 1) * limitNum;
      const [tasks, total] = await Promise.all([
        MaintenanceTask.find(query).sort({ priorityScore: -1, createdAt: -1 }).skip(skip).limit(limitNum),
        MaintenanceTask.countDocuments(query)
      ]);
      return res.json({ success: true, tasks, total, page: pageNum, totalPages: Math.ceil(total / limitNum) || 1 });
    }

    // In-Memory Fallback
    let filtered = [...memoryDb.tasks];
    if (department && department !== 'All') filtered = filtered.filter(t => t.department === department);
    if (priority && priority !== 'All') filtered = filtered.filter(t => t.priorityLevel === priority.toUpperCase());
    if (corridor && corridor !== 'All') filtered = filtered.filter(t => t.corridorId === corridor);
    if (status && status !== 'All') filtered = filtered.filter(t => t.status === status);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.taskId.toLowerCase().includes(q) || t.assetName.toLowerCase().includes(q) || t.issueDescription.toLowerCase().includes(q)
      );
    }
    filtered.sort((a, b) => (b.priorityScore || 50) - (a.priorityScore || 50));
    const total = filtered.length;
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    res.json({ success: true, tasks: paginated, total, page: pageNum, totalPages: Math.ceil(total / limitNum) || 1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Single task detail
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const task = await MaintenanceTask.findOne({ taskId: req.params.id });
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      return res.json({ success: true, task });
    }
    const task = memoryDb.tasks.find(t => t.taskId === req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const taskData = req.body;
    if (!taskData.taskId) taskData.taskId = `TASK-${Date.now().toString().slice(-6)}`;

    const prioResult = await evaluateTaskPriorityWithGrok(taskData);
    taskData.priorityScore = prioResult.priorityScore;
    taskData.priorityLevel = prioResult.priorityLevel;
    taskData.reasoning = prioResult.reasoning;
    taskData.status = 'Prioritized';

    if (isDbConnected()) {
      const newTask = await MaintenanceTask.create(taskData);
      return res.status(201).json({ success: true, task: newTask });
    }

    memoryDb.tasks.unshift(taskData);
    res.status(201).json({ success: true, task: taskData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Run Priority Engine on all tasks
router.post('/prioritize-all', async (req, res) => {
  try {
    const targetTasks = isDbConnected() ? await MaintenanceTask.find({}) : memoryDb.tasks;
    let count = 0;

    for (const task of targetTasks) {
      const evalResult = await evaluateTaskPriorityWithGrok(task);
      task.priorityScore = evalResult.priorityScore;
      task.priorityLevel = evalResult.priorityLevel;
      task.reasoning = evalResult.reasoning;
      task.status = 'Prioritized';
      if (isDbConnected()) await task.save();
      count++;
    }

    res.json({ success: true, message: `Successfully prioritized ${count} maintenance tasks using RAILOPT Priority Engine.`, updatedCount: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CSV Upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No CSV file uploaded' });

    const rows = await parseCSVBuffer(req.file.buffer);
    let count = 0;

    for (const row of rows) {
      if (!row.taskId || !row.department) continue;
      const prio = calculateFallbackPriority({
        criticality: Number(row.criticality || 50),
        urgency: Number(row.urgency || 50),
        assetImpact: Number(row.assetImpact || 50),
        trainImpact: Number(row.trainImpact || 50),
        safetyImpact: Number(row.safetyImpact || 50),
        overdueDays: Number(row.overdueDays || 0)
      });

      const taskObj = {
        taskId: row.taskId,
        department: row.department,
        sourceSystem: row.sourceSystem || 'CSV',
        assetId: row.assetId || 'ASSET-CSV',
        assetName: row.assetName || 'Railway Asset',
        corridorId: row.corridorId || 'VJA-GNT',
        maintenanceType: row.maintenanceType || 'Inspection',
        issueDescription: row.issueDescription || 'Imported task',
        criticality: Number(row.criticality || 50),
        urgency: Number(row.urgency || 50),
        assetImpact: Number(row.assetImpact || 50),
        trainImpact: Number(row.trainImpact || 50),
        safetyImpact: Number(row.safetyImpact || 50),
        overdueDays: Number(row.overdueDays || 0),
        estimatedDuration: Number(row.estimatedDuration || 60),
        dueDate: row.dueDate || '2026-09-15',
        status: 'Prioritized',
        priorityScore: prio.priorityScore,
        priorityLevel: prio.priorityLevel,
        reasoning: prio.reasoning
      };

      if (isDbConnected()) {
        await MaintenanceTask.findOneAndUpdate({ taskId: row.taskId }, taskObj, { upsert: true });
      } else {
        const idx = memoryDb.tasks.findIndex(t => t.taskId === row.taskId);
        if (idx >= 0) memoryDb.tasks[idx] = taskObj;
        else memoryDb.tasks.unshift(taskObj);
      }
      count++;
    }

    res.json({ success: true, message: `${count} maintenance records imported and prioritized successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
