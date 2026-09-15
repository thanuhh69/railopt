import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import Corridor from '../models/Corridor.js';
import { memoryDb } from '../config/inMemoryStore.js';
import { parseCSVBuffer } from '../services/csvParser.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const isDbConnected = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      let corridors = await Corridor.find({}).sort({ corridorId: 1 });
      if (!corridors || corridors.length === 0) corridors = memoryDb.corridors;
      return res.json({ success: true, corridors });
    }
    res.json({ success: true, corridors: memoryDb.corridors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No CSV file uploaded' });

    const rows = await parseCSVBuffer(req.file.buffer);
    let count = 0;

    for (const row of rows) {
      if (!row.corridorId) continue;
      const cObj = {
        corridorId: row.corridorId,
        fromLocation: row.fromLocation || 'Station A',
        toLocation: row.toLocation || 'Station B',
        date: row.date || '2026-09-15',
        availableStart: row.availableStart || '09:00',
        availableEnd: row.availableEnd || '17:00',
        trainCount: Number(row.trainCount || 0),
        trafficLevel: row.trafficLevel || 'Medium',
        availabilityStatus: row.availabilityStatus || 'Available'
      };

      if (isDbConnected()) {
        await Corridor.findOneAndUpdate({ corridorId: row.corridorId, date: cObj.date }, cObj, { upsert: true });
      } else {
        const idx = memoryDb.corridors.findIndex(c => c.corridorId === row.corridorId && c.date === cObj.date);
        if (idx >= 0) memoryDb.corridors[idx] = cObj;
        else memoryDb.corridors.unshift(cObj);
      }
      count++;
    }

    res.json({ success: true, message: `${count} corridor schedule records imported successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
