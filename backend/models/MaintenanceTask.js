import mongoose from 'mongoose';

const maintenanceTaskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true, index: true }, // Engineering, Traction, Signal & Telecommunication
  sourceSystem: { type: String, enum: ['TMS', 'SMMS', 'TDMS', 'MANUAL', 'CSV'], default: 'TMS' },
  assetId: { type: String, required: true },
  assetName: { type: String, required: true },
  assetType: { type: String, default: 'Rail Track' },
  assetCondition: { type: String, default: 'Action Required' },
  baseCity: { type: String, default: 'Vijayawada' },
  railwayDivision: { type: String, default: 'Vijayawada Division' },
  zone: { type: String, default: 'Vijayawada Area' },
  corridorId: { type: String, required: true, index: true },
  section: { type: String, default: 'VJA-GDL' },
  maintenanceLocation: { type: String, default: 'Track Section A-17' },
  location: { type: String, default: 'Track Section A-17' },
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
  blockId: { type: String, default: 'BLK-2026-021' },
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
  workInstructions: { type: String, default: 'Inspect sleeper joint bolts, measure gap clearance, replace defective rail section, and calibrate alignment.' },
  safetyInstructions: { type: String, default: 'Ensure catenary power disconnection, apply track circuit shunt flags, and deploy look-out protection before work.' },
  specialInstructions: { type: String, default: 'Perform post-repair ultrasound test on weld joint and log ultrasonic defect readings.' },
  rejectionReason: { type: String, default: '' },
  startedAt: { type: Date },
  startedBy: { type: String },
  reasoning: [{ type: String }]
}, { timestamps: true });

const MaintenanceTask = mongoose.model('MaintenanceTask', maintenanceTaskSchema);
export default MaintenanceTask;
