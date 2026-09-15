import express from 'express';
import mongoose from 'mongoose';
import MaintenanceTask from '../models/MaintenanceTask.js';
import Corridor from '../models/Corridor.js';
import TrainSchedule from '../models/TrainSchedule.js';
import BlockRequest from '../models/BlockRequest.js';
import OptimizedBlock from '../models/OptimizedBlock.js';
import Conflict from '../models/Conflict.js';
import PlanningRun from '../models/PlanningRun.js';
import { memoryDb } from '../config/inMemoryStore.js';
import { runBlockOptimization } from '../services/optimizer.js';
import { detectConflicts } from '../services/conflictDetector.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

// Generate Plan
router.post('/generate', async (req, res) => {
  try {
    let tasks, corridors, trains, blockRequests;

    if (isDbConnected()) {
      [tasks, corridors, trains, blockRequests] = await Promise.all([
        MaintenanceTask.find({ status: { $ne: 'Completed' } }),
        Corridor.find({}),
        TrainSchedule.find({}),
        BlockRequest.find({})
      ]);
    } else {
      tasks = memoryDb.tasks;
      corridors = memoryDb.corridors;
      trains = memoryDb.trains;
      blockRequests = memoryDb.blockRequests;
    }

    const detectedConflicts = detectConflicts(blockRequests, trains, corridors, tasks);
    const { optimizedBlocks, metrics } = runBlockOptimization(tasks, corridors, trains, blockRequests);

    if (isDbConnected()) {
      await OptimizedBlock.deleteMany({ status: 'Proposed' });
      const created = await OptimizedBlock.insertMany(optimizedBlocks);
      await Conflict.deleteMany({ status: 'Open' });
      if (detectedConflicts.length > 0) await Conflict.insertMany(detectedConflicts);

      return res.json({ success: true, message: 'Optimized block plan generated.', blocks: created, conflicts: detectedConflicts, metrics });
    }

    memoryDb.optimizedBlocks = optimizedBlocks;
    memoryDb.conflicts = detectedConflicts;

    res.json({
      success: true,
      message: 'Optimized railway maintenance block plan generated successfully.',
      blocks: optimizedBlocks,
      conflicts: detectedConflicts,
      metrics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// List blocks
router.get('/blocks', async (req, res) => {
  try {
    if (isDbConnected()) {
      const blocks = await OptimizedBlock.find({}).sort({ date: 1, startTime: 1 });
      return res.json({ success: true, blocks });
    }
    res.json({ success: true, blocks: memoryDb.optimizedBlocks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update block status
router.patch('/blocks/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (isDbConnected()) {
      const block = await OptimizedBlock.findOneAndUpdate({ blockId: req.params.id }, { status }, { new: true });
      return res.json({ success: true, block });
    }

    const block = memoryDb.optimizedBlocks.find(b => b.blockId === req.params.id);
    if (block) block.status = status;
    res.json({ success: true, block });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Weekly plan
router.get('/weekly', async (req, res) => {
  try {
    const blocks = isDbConnected() ? await OptimizedBlock.find({}).sort({ date: 1, startTime: 1 }) : memoryDb.optimizedBlocks;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyGrid = days.map((day, idx) => ({
      day,
      date: `Sep ${15 + idx}, 2026`,
      blocks: blocks.filter((b, i) => (i % 7) === idx)
    }));
    res.json({ success: true, weeklyGrid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Monthly plan
router.get('/monthly', async (req, res) => {
  try {
    const blocks = isDbConnected() ? await OptimizedBlock.find({}) : memoryDb.optimizedBlocks;
    res.json({ success: true, blocks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Demo scenario trigger
router.post('/demo-scenario', async (req, res) => {
  try {
    const demoCorridor = 'VJA-GNT';
    const demoDate = '2026-09-15';

    const coordinatedBlock = {
      blockId: 'BLK-2026-DEMO',
      date: demoDate,
      corridorId: demoCorridor,
      startTime: '11:30',
      endTime: '13:00',
      totalDuration: 90,
      departments: ['Engineering', 'Signal & Telecommunication', 'Traction Distribution'],
      tasks: ['ENG-1042', 'ST-3021', 'TR-5012'],
      priorityLevel: 'Critical',
      status: 'Proposed',
      trainConflictsCount: 0,
      corridorConflictsCount: 0,
      deadlineConflictsCount: 0,
      beforeOccupationHours: 3.0,
      afterOccupationHours: 1.5
    };

    const conflictRecord = {
      conflictId: 'CONF-DEMO-01',
      corridorId: demoCorridor,
      date: demoDate,
      requestedBlockTime: '10:00–12:00',
      trainId: '12705 (Guntur Express)',
      conflictType: 'Train Conflict',
      description: 'Initial block request (10:00–12:00) overlaps with Express 12705 movement at 10:45.',
      recommendedWindow: '11:30–13:00',
      reasoning: 'Lower train traffic window after Express 12705 departure. Groups Engineering, S&T, and Traction into 1 single block.',
      status: 'Resolved'
    };

    if (isDbConnected()) {
      await OptimizedBlock.findOneAndUpdate({ blockId: 'BLK-2026-DEMO' }, coordinatedBlock, { upsert: true });
      await Conflict.findOneAndUpdate({ conflictId: 'CONF-DEMO-01' }, conflictRecord, { upsert: true });
    } else {
      const bIdx = memoryDb.optimizedBlocks.findIndex(b => b.blockId === 'BLK-2026-DEMO');
      if (bIdx >= 0) memoryDb.optimizedBlocks[bIdx] = coordinatedBlock;
      else memoryDb.optimizedBlocks.unshift(coordinatedBlock);

      const cIdx = memoryDb.conflicts.findIndex(c => c.conflictId === 'CONF-DEMO-01');
      if (cIdx >= 0) memoryDb.conflicts[cIdx] = conflictRecord;
      else memoryDb.conflicts.unshift(conflictRecord);
    }

    res.json({
      success: true,
      message: 'Demo Scenario executed! VJA-GNT 10:45 train conflict resolved and 11:30–13:00 multi-department coordinated block generated.',
      block: coordinatedBlock,
      conflict: conflictRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
