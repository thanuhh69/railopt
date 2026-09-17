import express from 'express';
import mongoose from 'mongoose';
import BlockRequest from '../models/BlockRequest.js';
import { memoryDb } from '../config/inMemoryStore.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      let requests = await BlockRequest.find({}).sort({ createdAt: -1 });
      if (!requests || requests.length === 0) requests = memoryDb.blockRequests;
      return res.json({ success: true, requests });
    }
    res.json({ success: true, requests: memoryDb.blockRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const reqData = req.body;
    if (!reqData.requestId) reqData.requestId = `REQ-${Date.now().toString().slice(-4)}`;

    if (isDbConnected()) {
      const newReq = await BlockRequest.create(reqData);
      return res.status(201).json({ success: true, request: newReq });
    }

    memoryDb.blockRequests.unshift(reqData);
    res.status(201).json({ success: true, request: reqData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status, rescheduledTime } = req.body; // 'Approved', 'Rejected', 'Rescheduled', 'Cancelled'
    const requestId = req.params.id;

    if (isDbConnected()) {
      const updated = await BlockRequest.findOneAndUpdate({ requestId }, { status }, { new: true });
      return res.json({ success: true, request: updated, message: `Block request ${requestId} updated to ${status}` });
    }

    const reqItem = memoryDb.blockRequests.find(r => r.requestId === requestId || r._id === requestId);
    if (reqItem) {
      reqItem.status = status;
      if (rescheduledTime) reqItem.startTime = rescheduledTime;
    }

    // Also notify assigned user about block approval
    memoryDb.tasks.filter(t => t.corridorId === (reqItem?.corridorId || 'VJA-GNT')).forEach(t => {
      t.blockStatus = status;
    });

    res.json({ success: true, request: reqItem, message: `Block request ${requestId} marked as ${status}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
