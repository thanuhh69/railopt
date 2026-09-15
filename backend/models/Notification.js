import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: String, required: true, index: true }, // email or 'ADMIN'
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['TASK_ASSIGNED', 'TASK_STARTED', 'REPORT_SUBMITTED', 'REPORT_APPROVED', 'REPORT_REJECTED', 'CONFLICT_ALERT', 'GENERAL'], default: 'GENERAL' },
  taskId: { type: String },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
