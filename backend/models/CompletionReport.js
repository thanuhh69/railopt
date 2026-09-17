import mongoose from 'mongoose';

const completionReportSchema = new mongoose.Schema({
  taskId: { type: String, required: true, index: true },
  submittedBy: { type: String, required: true }, // email
  submittedByName: { type: String, required: true },
  completionNotes: { type: String, required: true },
  workPerformed: { type: String, required: true },
  issuesFound: { type: String, default: 'None reported' },
  evidenceImages: [{ type: String }], // Combined fallback
  beforeImages: [{ type: String }], // Before maintenance photo URLs
  afterImages: [{ type: String }], // After maintenance photo URLs
  submittedAt: { type: Date, default: Date.now },
  verificationStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING', index: true },
  verifiedBy: { type: String },
  verifiedAt: { type: Date },
  rejectionReason: { type: String, default: '' }
}, { timestamps: true });

const CompletionReport = mongoose.model('CompletionReport', completionReportSchema);
export default CompletionReport;
