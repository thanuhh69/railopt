import express from 'express';
import { runSeedScript } from '../scripts/seed.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    await runSeedScript();
    res.json({
      success: true,
      message: 'Database seeded successfully with 500+ maintenance tasks, 50+ corridors, 500+ train schedule entries, and sample conflicts.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
