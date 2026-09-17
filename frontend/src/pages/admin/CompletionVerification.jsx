import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, FileImage, ShieldCheck, AlertCircle, Eye, X, MapPin, Train, Calendar, User, Clock, AlertTriangle } from 'lucide-react';
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
    if (action === 'reject' && !reason.trim()) {
      alert('Please enter a rejection reason before confirming.');
      return;
    }

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
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Executive Quality Assurance Portal
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Maintenance Completion Verification
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium max-w-2xl">
            Review site completion evidence submitted by field engineers. Verify side-by-side Before & After photographic proof along with location hierarchy clearance before authorizing block closure.
          </p>
        </div>
        <button
          onClick={fetchReports}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all"
        >
          Refresh Verification Queue
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Pending Verification Requests ({reports.length})
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Work completion submissions awaiting Senior SSE clearance</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Location Hierarchy</th>
                <th className="py-3 px-4">Submitted By</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Work Summary</th>
                <th className="py-3 px-4">Photo Evidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">Loading verification queue...</td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map((rep) => {
                  const tDetails = rep.taskDetails || {};
                  const hasBeforeAfter = (rep.beforeImages && rep.beforeImages.length > 0) || (rep.afterImages && rep.afterImages.length > 0);
                  return (
                    <tr key={rep._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-black text-blue-700">{rep.taskId}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{tDetails.maintenanceLocation || 'Site Location'}</div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {tDetails.railwayDivision || 'Vijayawada'} &bull; {tDetails.section || 'Track Section'}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {rep.submittedByName || rep.submittedBy}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {new Date(rep.submittedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-800">{rep.workPerformed}</td>
                      <td className="py-3 px-4">
                        {hasBeforeAfter ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <FileImage className="w-3.5 h-3.5 text-emerald-600" /> Dual Photos Attached
                          </span>
                        ) : rep.evidenceImages && rep.evidenceImages.length > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            <FileImage className="w-3.5 h-3.5" /> 1 Photo
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">No Image</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedReport(rep)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-xs flex items-center gap-1 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" /> Review Evidence
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-slate-900 text-white z-10">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Quality Clearance Inspection</span>
                <h3 className="text-lg font-black flex items-center gap-2">
                  Work Completion Review — <span className="font-mono text-blue-300">{selectedReport.taskId}</span>
                </h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-slate-700 overflow-y-auto">
              {/* Location Hierarchy Banner */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 border border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" /> Railway Location Hierarchy Breakdown
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Division / Zone</span>
                    <span className="font-bold text-white text-xs">{(selectedReport.taskDetails && selectedReport.taskDetails.railwayDivision) || 'Vijayawada (BZA)'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Corridor</span>
                    <span className="font-bold text-white text-xs">{(selectedReport.taskDetails && selectedReport.taskDetails.corridorId) || 'VJA-GNT'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Section</span>
                    <span className="font-bold text-white text-xs truncate block font-medium">{(selectedReport.taskDetails && selectedReport.taskDetails.section) || 'Vijayawada - Guntur'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Location / Asset</span>
                    <span className="font-bold text-amber-400 text-xs">{(selectedReport.taskDetails && selectedReport.taskDetails.maintenanceLocation) || 'KM 14/200'}</span>
                  </div>
                </div>
              </div>

              {/* Submitter & Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Submitted By</div>
                  <div className="font-black text-slate-900 text-sm">{selectedReport.submittedByName || selectedReport.submittedBy}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Timestamp: {new Date(selectedReport.submittedAt).toLocaleString('en-IN')}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Work Performed Summary</div>
                  <div className="font-semibold text-slate-900 leading-relaxed">{selectedReport.workPerformed}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completion & Field Safety Inspection Notes</div>
                <div className="font-medium text-slate-800 leading-relaxed">{selectedReport.completionNotes}</div>
                {selectedReport.issuesFound && (
                  <div className="pt-2 border-t border-slate-200 text-amber-700 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Note: {selectedReport.issuesFound}
                  </div>
                )}
              </div>

              {/* Side-by-Side Photographic Evidence Review */}
              <div className="space-y-3">
                <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Photographic Evidence Comparison</span>
                  <span className="text-[10px] text-slate-500 font-normal">Compare site condition before and after maintenance work</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before Image Card */}
                  <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" /> BEFORE Maintenance Photo
                      </span>
                    </div>
                    {selectedReport.beforeImages && selectedReport.beforeImages.length > 0 ? (
                      <div className="rounded-lg overflow-hidden border border-amber-200 bg-slate-900">
                        <img
                          src={selectedReport.beforeImages[0]}
                          alt="Before Maintenance"
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80'; }}
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-medium text-xs">
                        No "Before" image provided
                      </div>
                    )}
                  </div>

                  {/* After Image Card */}
                  <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> AFTER Maintenance Photo
                      </span>
                    </div>
                    {selectedReport.afterImages && selectedReport.afterImages.length > 0 ? (
                      <div className="rounded-lg overflow-hidden border border-emerald-200 bg-slate-900">
                        <img
                          src={selectedReport.afterImages[0]}
                          alt="After Maintenance"
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'; }}
                        />
                      </div>
                    ) : selectedReport.evidenceImages && selectedReport.evidenceImages.length > 0 ? (
                      <div className="rounded-lg overflow-hidden border border-emerald-200 bg-slate-900">
                        <img
                          src={selectedReport.evidenceImages[0]}
                          alt="Work Evidence"
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'; }}
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-medium text-xs">
                        No "After" image provided
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setRejectingReportId(selectedReport._id)}
                className="px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-red-700" /> Reject Work (Revert Task)
              </button>
              <button
                onClick={() => handleVerifyAction(selectedReport._id, 'approve')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-100" /> Approve & Close Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingReportId && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-black text-sm uppercase">
              <AlertTriangle className="w-5 h-5 text-red-600" /> Specify Rejection Reason
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              State why this work completion report is rejected. The task status will revert to <span className="font-mono text-amber-700 font-bold">IN_PROGRESS</span> and an urgent notice will be logged in the staff employee portal.
            </p>

            <textarea
              required
              rows="4"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Fishplate bolts missing lock washers, track circuit test report not attached, or ballast not properly tamped..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-red-600 focus:bg-white"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setRejectingReportId(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200">
                Cancel
              </button>
              <button
                onClick={() => handleVerifyAction(rejectingReportId, 'reject', rejectionReason)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                Submit Rejection & Revert Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

