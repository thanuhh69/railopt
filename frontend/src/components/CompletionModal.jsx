import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function CompletionModal({ isOpen, onClose, taskId, onSuccess }) {
  const [completionNotes, setCompletionNotes] = useState('');
  const [workPerformed, setWorkPerformed] = useState('');
  const [issuesFound, setIssuesFound] = useState('');
  const [beforeFile, setBeforeFile] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleBeforeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB.');
        return;
      }
      setBeforeFile(file);
      setBeforePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleAfterFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB.');
        return;
      }
      setAfterFile(file);
      setAfterPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('completionNotes', completionNotes || 'Work completed as per standard maintenance operating procedure.');
    formData.append('workPerformed', workPerformed || 'Inspected, serviced, and replaced worn asset components.');
    formData.append('issuesFound', issuesFound || 'None reported.');
    
    if (beforeFile) {
      formData.append('beforeImages', beforeFile);
    }
    if (afterFile) {
      formData.append('afterImages', afterFile);
    }

    try {
      const res = await api.post(`/tasks/${taskId}/complete`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        if (onSuccess) onSuccess(res.data.task);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit completion report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden my-6">
        <div className="px-6 py-4 bg-[#002B49] text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-black tracking-tight">Submit Work Completion Report</h3>
            <p className="text-xs text-blue-200 font-mono mt-0.5">Task Order ID: {taskId}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Work Performed *</label>
            <textarea
              required
              rows="2"
              value={workPerformed}
              onChange={(e) => setWorkPerformed(e.target.value)}
              placeholder="Detail exact maintenance activities performed, fastener torque, track alignment, etc."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Completion Notes *</label>
            <textarea
              required
              rows="2"
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Safety clearances, ultrasonic test readings, post-maintenance track speed approval..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Issues / Observations Found (Optional)</label>
            <textarea
              rows="2"
              value={issuesFound}
              onChange={(e) => setIssuesFound(e.target.value)}
              placeholder="Any additional component wear or follow-up maintenance recommendations..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Dual Image Uploads: Before & After Maintenance */}
          <div className="pt-2 border-t border-slate-100">
            <span className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
              Upload Verification Evidence Photos
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Before Photo Field */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Before Maintenance Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBeforeFileChange}
                  className="w-full text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white"
                />

                {beforePreview ? (
                  <div className="mt-2 relative">
                    <img src={beforePreview} alt="Before Evidence" className="h-24 w-full rounded-lg object-cover border border-slate-300" />
                    <span className="text-[9px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded absolute bottom-1 left-1">BEFORE</span>
                  </div>
                ) : (
                  <div className="h-20 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                    No Before Photo Selected
                  </div>
                )}
              </div>

              {/* After Photo Field */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> After Maintenance Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAfterFileChange}
                  className="w-full text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-emerald-600 file:text-white"
                />

                {afterPreview ? (
                  <div className="mt-2 relative">
                    <img src={afterPreview} alt="After Evidence" className="h-24 w-full rounded-lg object-cover border border-slate-300" />
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded absolute bottom-1 left-1">AFTER</span>
                  </div>
                ) : (
                  <div className="h-20 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                    No After Photo Selected
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Submitting Completion Report...' : 'Submit Completion Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
