import mongoose from 'mongoose';

const blockRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true, index: true },
  department: { type: String, required: true },
  corridorId: { type: String, required: true, index: true },
  requestedDate: { type: String, required: true, index: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  reason: { type: String, required: true },
  priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Optimized'], default: 'Pending', index: true }
}, { timestamps: true });

const BlockRequest = mongoose.model('BlockRequest', blockRequestSchema);
export default BlockRequest;
