import mongoose from 'mongoose';

const completionReportSchema = new mongoose.Schema({
  taskId: { type: String, required: true, index: true },
  submittedBy: { type: String, required: true }, // email
  submittedByName: { type: String, required: true },
  completionNotes: { type: String, required: true },
  workPerformed: { type: String, required: true },
  issuesFound: { type: String, default: 'None reported' },
  evidenceImages: [{ type: String }], // Array of uploaded image URLs/file paths
  submittedAt: { type: Date, default: Date.now },
  verificationStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING', index: true },
  verifiedBy: { type: String },
  verifiedAt: { type: Date },
  rejectionReason: { type: String }
}, { timestamps: true });

const CompletionReport = mongoose.model('CompletionReport', completionReportSchema);
export default CompletionReport;
