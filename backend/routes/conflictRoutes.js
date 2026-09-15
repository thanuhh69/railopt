import express from 'express';
import mongoose from 'mongoose';
import Conflict from '../models/Conflict.js';
import OptimizedBlock from '../models/OptimizedBlock.js';
import { memoryDb } from '../config/inMemoryStore.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      let conflicts = await Conflict.find({}).sort({ createdAt: -1 });
      if (!conflicts || conflicts.length === 0) conflicts = memoryDb.conflicts;
      return res.json({ success: true, conflicts });
    }
    res.json({ success: true, conflicts: memoryDb.conflicts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/resolve', async (req, res) => {
  try {
    const { action } = req.body;
    const status = action === 'accept' ? 'Resolved' : 'Rejected';

    if (isDbConnected()) {
      const conflict = await Conflict.findOneAndUpdate({ conflictId: req.params.id }, { status }, { new: true });
      if (action === 'accept' && conflict) {
        const [recStart, recEnd] = conflict.recommendedWindow.split('–');
        if (recStart && recEnd) {
          await OptimizedBlock.findOneAndUpdate(
            { corridorId: conflict.corridorId, date: conflict.date },
            { startTime: recStart.trim(), endTime: recEnd.trim(), status: 'Approved' }
          );
        }
      }
      return res.json({ success: true, message: `Conflict ${req.params.id} marked as ${status}.`, conflict });
    }

    const conflict = memoryDb.conflicts.find(c => c.conflictId === req.params.id);
    if (conflict) {
      conflict.status = status;
      if (action === 'accept' && conflict.recommendedWindow) {
        const [recStart, recEnd] = conflict.recommendedWindow.split('–');
        if (recStart && recEnd) {
          const blk = memoryDb.optimizedBlocks.find(b => b.corridorId === conflict.corridorId && b.date === conflict.date);
          if (blk) {
            blk.startTime = recStart.trim();
            blk.endTime = recEnd.trim();
            blk.status = 'Approved';
          }
        }
      }
    }

    res.json({ success: true, message: `Conflict ${req.params.id} marked as ${status}.`, conflict });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
