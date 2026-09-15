import mongoose from 'mongoose';

const conflictSchema = new mongoose.Schema({
  conflictId: { type: String, required: true, unique: true, index: true },
  corridorId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  requestedBlockTime: { type: String, required: true },
  trainId: { type: String },
  conflictType: { 
    type: String, 
    enum: ['Train Conflict', 'Corridor Conflict', 'Department Conflict', 'Deadline Conflict', 'Availability Conflict'], 
    required: true 
  },
  description: { type: String, required: true },
  recommendedWindow: { type: String, required: true },
  reasoning: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Resolved', 'Rejected'], default: 'Open', index: true }
}, { timestamps: true });

const Conflict = mongoose.model('Conflict', conflictSchema);
export default Conflict;
