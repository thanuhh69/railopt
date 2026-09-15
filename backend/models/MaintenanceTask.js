import mongoose from 'mongoose';

const maintenanceTaskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true, index: true }, // Engineering, Traction, Signal & Telecommunication
  sourceSystem: { type: String, enum: ['TMS', 'SMMS', 'TDMS', 'MANUAL', 'CSV'], default: 'TMS' },
  assetId: { type: String, required: true },
  assetName: { type: String, required: true },
  corridorId: { type: String, required: true, index: true },
  location: { type: String, default: 'KM 245/12' },
  maintenanceType: { type: String, default: 'Defect Repair' },
  criticality: { type: Number, default: 80 },
  urgency: { type: Number, default: 80 },
  assetImpact: { type: Number, default: 75 },
  trainImpact: { type: Number, default: 70 },
  safetyImpact: { type: Number, default: 85 },
  overdueDays: { type: Number, default: 0 },
  failureHistory: { type: Number, default: 0 },
  estimatedDuration: { type: Number, default: 90 }, // in minutes
  dueDate: { type: String, required: true, index: true }, // YYYY-MM-DD
  startTime: { type: String, default: '10:00' },
  endTime: { type: String, default: '11:30' },
  status: { 
    type: String, 
    enum: ['ASSIGNED', 'IN_PROGRESS', 'VERIFICATION_PENDING', 'COMPLETED', 'Pending', 'Prioritized', 'Scheduled'], 
    default: 'ASSIGNED', 
    index: true 
  },
  priorityScore: { type: Number, default: 75 },
  priorityLevel: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'Critical', 'High', 'Medium', 'Low'], default: 'HIGH' },
  assignedUserEmail: { type: String, default: 'user@railopt.demo', index: true },
  assignedUserName: { type: String, default: 'Ravi Kumar (SSE)' },
  safetyInstructions: { type: String, default: 'Ensure power disconnection and flag protection before entering section.' },
  specialInstructions: { type: String, default: 'Perform post-inspection ultrasound test on weld joint.' },
  startedAt: { type: Date },
  startedBy: { type: String },
  reasoning: [{ type: String }]
}, { timestamps: true });

const MaintenanceTask = mongoose.model('MaintenanceTask', maintenanceTaskSchema);
export default MaintenanceTask;
