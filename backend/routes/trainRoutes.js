import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import TrainSchedule from '../models/TrainSchedule.js';
import { memoryDb } from '../config/inMemoryStore.js';
import { parseCSVBuffer } from '../services/csvParser.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const isDbConnected = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      let trains = await TrainSchedule.find({}).sort({ arrivalTime: 1 });
      if (!trains || trains.length === 0) trains = memoryDb.trains;
      return res.json({ success: true, trains });
    }
    res.json({ success: true, trains: memoryDb.trains });
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
      if (!row.trainNumber) continue;
      const tObj = {
        trainNumber: row.trainNumber,
        trainName: row.trainName || 'Express Train',
        corridorId: row.corridorId || 'VJA-GNT',
        date: row.date || '2026-09-15',
        arrivalTime: row.arrivalTime || '10:00',
        departureTime: row.departureTime || '10:15',
        trainType: row.trainType || 'Express',
        priority: row.priority || 'High'
      };

      if (isDbConnected()) {
        await TrainSchedule.findOneAndUpdate({ trainNumber: row.trainNumber, date: tObj.date }, tObj, { upsert: true });
      } else {
        const idx = memoryDb.trains.findIndex(t => t.trainNumber === row.trainNumber && t.date === tObj.date);
        if (idx >= 0) memoryDb.trains[idx] = tObj;
        else memoryDb.trains.unshift(tObj);
      }
      count++;
    }

    res.json({ success: true, message: `${count} train timetable records imported successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
