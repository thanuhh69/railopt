import mongoose from 'mongoose';

const planningRunSchema = new mongoose.Schema({
  runId: { type: String, required: true, unique: true, index: true },
  runDate: { type: Date, default: Date.now },
  tasksScheduled: { type: Number, default: 0 },
  blocksCreated: { type: Number, default: 0 },
  conflictsResolved: { type: Number, default: 0 },
  multiDeptBlocks: { type: Number, default: 0 },
  estimatedBlockUtilization: { type: String, default: '88%' },
  estimatedAssetAvailability: { type: String, default: '94%' },
  status: { type: String, enum: ['Success', 'Failed', 'Processing'], default: 'Success' }
}, { timestamps: true });

const PlanningRun = mongoose.model('PlanningRun', planningRunSchema);
export default PlanningRun;
