import express from 'express';
import mongoose from 'mongoose';
import MaintenanceTask from '../models/MaintenanceTask.js';
import CompletionReport from '../models/CompletionReport.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import { memoryDb } from '../config/inMemoryStore.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET pending completion reports for Admin Verification
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      const reports = await CompletionReport.find({ verificationStatus: 'PENDING' }).sort({ submittedAt: -1 }).lean();
      
      // Fetch associated task details for location hierarchy
      const enrichedReports = await Promise.all(reports.map(async (rep) => {
        const task = await MaintenanceTask.findOne({ taskId: rep.taskId }).lean();
        return {
          ...rep,
          taskDetails: task || {}
        };
      }));

      return res.json({ success: true, reports: enrichedReports });
    }

    const pendingTasks = memoryDb.tasks.filter(t => t.status === 'VERIFICATION_PENDING');
    const reports = pendingTasks.map(t => ({
      _id: `rep-${t.taskId}`,
      taskId: t.taskId,
      submittedBy: t.assignedUserEmail || 'user@railopt.demo',
      submittedByName: t.assignedUserName || 'Ravi Kumar (SSE)',
      completionNotes: 'Replaced cracked rail defect joint, torqued fishplate bolts to 450 Nm, and cleared track circuit section.',
      workPerformed: 'Replaced rail joint 245, installed new sleepers, tested alignment.',
      issuesFound: 'Minor ballast compaction needed on turnout 3B.',
      evidenceImages: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'],
      beforeImages: ['https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80'],
      afterImages: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'],
      submittedAt: t.updatedAt || new Date(),
      verificationStatus: 'PENDING',
      taskDetails: {
        baseCity: t.baseCity || 'Vijayawada',
        railwayDivision: t.railwayDivision || 'Vijayawada (BZA)',
        zone: t.zone || 'Vijayawada Area',
        corridorId: t.corridorId || 'VJA-GNT-CORRIDOR',
        section: t.section || 'Vijayawada - Mangalagiri - Guntur Track 1',
        maintenanceLocation: t.maintenanceLocation || 'KM 14/200 - KM 16/400 (Mangalagiri)',
        assetName: t.assetName || 'Track Section VJA-04',
        assetType: t.assetType || 'TRACK'
      }
    }));

    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Review Decision (Approve / Reject)
router.post('/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'
    const reportId = req.params.id;

    if (action === 'approve') {
      if (isDbConnected()) {
        const report = await CompletionReport.findByIdAndUpdate(
          reportId,
          { verificationStatus: 'APPROVED', verifiedBy: req.user?.name || 'Admin', verifiedAt: new Date() },
          { new: true }
        );
        const taskId = report ? report.taskId : reportId;
        await MaintenanceTask.findOneAndUpdate({ taskId }, { status: 'COMPLETED' });

        await Notification.create({
          recipient: report?.submittedBy || 'user@railopt.demo',
          title: 'Completion Report Approved ✓',
          message: `Your work completion report for task ${taskId} has been verified and approved by ${req.user?.name || 'Admin'}. Task marked as COMPLETED.`,
          type: 'REPORT_APPROVED',
          taskId
        });

        await ActivityLog.create({
          user: req.user?.name || 'Admin',
          role: 'ADMIN',
          action: 'REPORT_APPROVED',
          description: `Approved completion verification for task ${taskId}`,
          taskId
        });

        return res.json({ success: true, message: `Completion report for ${taskId} approved. Task marked COMPLETED.` });
      }

      const task = memoryDb.tasks.find(t => t.taskId === reportId || `rep-${t.taskId}` === reportId);
      if (task) task.status = 'COMPLETED';
      return res.json({ success: true, message: `Completion report approved. Task marked COMPLETED.` });
    }

    if (action === 'reject') {
      const reason = rejectionReason || 'Further work required to meet railway safety standards.';
      if (isDbConnected()) {
        const report = await CompletionReport.findByIdAndUpdate(
          reportId,
          { verificationStatus: 'REJECTED', verifiedBy: req.user?.name || 'Admin', verifiedAt: new Date(), rejectionReason: reason },
          { new: true }
        );
        const taskId = report ? report.taskId : reportId;
        await MaintenanceTask.findOneAndUpdate({ taskId }, { status: 'IN_PROGRESS', rejectionReason: reason });

        await Notification.create({
          recipient: report?.submittedBy || 'user@railopt.demo',
          title: 'Completion Report Rejected ⚠',
          message: `Your completion report for task ${taskId} was rejected: "${reason}". Task returned to IN_PROGRESS.`,
          type: 'REPORT_REJECTED',
          taskId
        });

        await ActivityLog.create({
          user: req.user?.name || 'Admin',
          role: 'ADMIN',
          action: 'REPORT_REJECTED',
          description: `Rejected completion report for task ${taskId} (Reason: ${reason})`,
          taskId
        });

        return res.json({ success: true, message: `Completion report rejected. Task returned to IN_PROGRESS.` });
      }

      const task = memoryDb.tasks.find(t => t.taskId === reportId || `rep-${t.taskId}` === reportId);
      if (task) {
        task.status = 'IN_PROGRESS';
        task.rejectionReason = reason;
      }
      return res.json({ success: true, message: `Completion report rejected. Task returned to IN_PROGRESS.` });
    }

    res.status(400).json({ success: false, message: 'Invalid verification action' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
