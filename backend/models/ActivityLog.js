import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Name or Email
  role: { type: String, enum: ['USER', 'ADMIN', 'SYSTEM'], default: 'USER' },
  action: { type: String, required: true },
  description: { type: String, required: true },
  taskId: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
