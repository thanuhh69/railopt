import mongoose from 'mongoose';

const optimizedBlockSchema = new mongoose.Schema({
  blockId: { type: String, required: true, unique: true, index: true },
  date: { type: String, required: true, index: true },
  corridorId: { type: String, required: true, index: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  totalDuration: { type: Number, required: true }, // minutes
  departments: [{ type: String }],
  tasks: [{ type: String }], // taskIds
  priorityLevel: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'High' },
  status: { type: String, enum: ['Proposed', 'Approved', 'Rejected', 'In Progress', 'Completed'], default: 'Proposed', index: true },
  trainConflictsCount: { type: Number, default: 0 },
  corridorConflictsCount: { type: Number, default: 0 },
  deadlineConflictsCount: { type: Number, default: 0 },
  beforeOccupationHours: { type: Number, default: 0 },
  afterOccupationHours: { type: Number, default: 0 }
}, { timestamps: true });

const OptimizedBlock = mongoose.model('OptimizedBlock', optimizedBlockSchema);
export default OptimizedBlock;
