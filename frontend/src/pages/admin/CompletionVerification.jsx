import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, FileImage, ShieldCheck, AlertCircle, Eye, X } from 'lucide-react';
import api from '../../utils/api';

export default function CompletionVerification() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rejectingReportId, setRejectingReportId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/verification');
      if (res.data?.success) setReports(res.data.reports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleVerifyAction = async (reportId, action, reason = '') => {
    try {
      const res = await api.post(`/verification/${reportId}/verify`, { action, rejectionReason: reason });
      if (res.data?.success) {
        setMessage(res.data.message);
        setSelectedReport(null);
        setRejectingReportId(null);
        setRejectionReason('');
        fetchReports();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Maintenance Completion Verification
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Review staff work completion reports, inspection notes, and uploaded evidence photos before approving task closure.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {message}
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Reports Waiting for Admin Verification ({reports.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Staff User</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Work Performed</th>
                <th className="py-3 px-4">Completion Notes</th>
                <th className="py-3 px-4">Evidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-medium">Loading verification queue...</td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map((rep) => (
                  <tr key={rep._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{rep.taskId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{rep.submittedByName || rep.submittedBy}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(rep.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate font-medium">{rep.workPerformed}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">{rep.completionNotes}</td>
                    <td className="py-3 px-4">
                      {rep.evidenceImages && rep.evidenceImages.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <FileImage className="w-3.5 h-3.5" /> Photo Attached
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">No Image</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        {rep.verificationStatus || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReport(rep)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold shadow-xs flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Review
                        </button>
                        <button
                          onClick={() => handleVerifyAction(rep._id, 'approve')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingReportId(rep._id)}
                          className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-[10px] font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-medium">
                    No completion reports waiting for verification. All submitted maintenance work is verified!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Detailed Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Work Completion Report Review</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Task ID: {selectedReport.taskId}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Submitted By</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedReport.submittedByName || selectedReport.submittedBy}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Submission Date</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{new Date(selectedReport.submittedAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Work Performed</div>
                <div className="font-medium text-slate-900">{selectedReport.workPerformed}</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Completion & Safety Notes</div>
                <div className="font-medium text-slate-900">{selectedReport.completionNotes}</div>
              </div>

              {/* Photo Evidence Preview */}
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase mb-2">Uploaded Work Evidence Photo</div>
                {selectedReport.evidenceImages && selectedReport.evidenceImages.length > 0 ? (
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 inline-block">
                    <img
                      src={selectedReport.evidenceImages[0]}
                      alt="Work Evidence"
                      className="max-h-64 rounded-lg object-cover border"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'; }}
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border rounded-lg text-slate-400 text-center font-medium">No photo uploaded</div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => handleVerifyAction(selectedReport._id, 'reject')}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs rounded-xl"
              >
                Reject Report
              </button>
              <button
                onClick={() => handleVerifyAction(selectedReport._id, 'approve')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Approve Completion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingReportId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Reject Completion Report</h3>
            <p className="text-xs text-slate-500">Provide a reason for rejection. Task status will revert to IN_PROGRESS and notification will be sent to staff.</p>

            <textarea
              required
              rows="3"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why completion was rejected..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-red-600"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setRejectingReportId(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                Cancel
              </button>
              <button
                onClick={() => handleVerifyAction(rejectingReportId, 'reject', rejectionReason)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
