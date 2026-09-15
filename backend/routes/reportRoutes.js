import express from 'express';
import mongoose from 'mongoose';
import MaintenanceTask from '../models/MaintenanceTask.js';
import OptimizedBlock from '../models/OptimizedBlock.js';
import Conflict from '../models/Conflict.js';
import { memoryDb } from '../config/inMemoryStore.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

const jsonToCSV = (items, fields) => {
  if (!items || items.length === 0) return '';
  const header = fields.join(',') + '\n';
  const body = items.map(item => {
    return fields.map(f => {
      let val = item[f];
      if (Array.isArray(val)) val = val.join(';');
      if (val === undefined || val === null) val = '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',');
  }).join('\n');
  return header + body;
};

router.get('/export', async (req, res) => {
  try {
    const { type = 'blocks' } = req.query;
    let csvData = '';
    let filename = `railopt_${type}_export.csv`;

    if (type === 'blocks' || type === 'weekly' || type === 'monthly') {
      const blocks = isDbConnected() ? await OptimizedBlock.find({}).lean() : memoryDb.optimizedBlocks;
      csvData = jsonToCSV(blocks, ['blockId', 'date', 'corridorId', 'startTime', 'endTime', 'totalDuration', 'departments', 'tasks', 'priorityLevel', 'status']);
      filename = `railopt_optimized_block_plan.csv`;
    } else if (type === 'tasks') {
      const tasks = isDbConnected() ? await MaintenanceTask.find({}).lean() : memoryDb.tasks;
      csvData = jsonToCSV(tasks, ['taskId', 'department', 'assetId', 'corridorId', 'maintenanceType', 'dueDate', 'criticality', 'urgency', 'priorityScore', 'priorityLevel', 'status']);
      filename = `railopt_maintenance_tasks.csv`;
    } else if (type === 'conflicts') {
      const conflicts = isDbConnected() ? await Conflict.find({}).lean() : memoryDb.conflicts;
      csvData = jsonToCSV(conflicts, ['conflictId', 'corridorId', 'date', 'requestedBlockTime', 'trainId', 'conflictType', 'description', 'recommendedWindow', 'status']);
      filename = `railopt_conflicts_report.csv`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
