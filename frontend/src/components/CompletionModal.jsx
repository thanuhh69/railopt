import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function CompletionModal({ isOpen, onClose, taskId, onSuccess }) {
  const [completionNotes, setCompletionNotes] = useState('');
  const [workPerformed, setWorkPerformed] = useState('');
  const [issuesFound, setIssuesFound] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('completionNotes', completionNotes);
    formData.append('workPerformed', workPerformed);
    formData.append('issuesFound', issuesFound);
    if (selectedFile) {
      formData.append('evidenceImages', selectedFile);
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Submit Work Completion Report</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Task ID: {taskId}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              placeholder="Detail the exact maintenance work performed..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Completion Notes *</label>
            <textarea
              required
              rows="2"
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Torque measurements, safety checks, post-maintenance clearance..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Issues / Observations Found (Optional)</label>
            <textarea
              rows="2"
              value={issuesFound}
              onChange={(e) => setIssuesFound(e.target.value)}
              placeholder="Any additional defects or observations noticed..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Evidence Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Upload Completion Evidence Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white"
            />

            {previewUrl && (
              <div className="mt-3 relative p-2 bg-slate-50 rounded-xl border border-slate-200 inline-block">
                <img src={previewUrl} alt="Evidence Preview" className="h-28 rounded-lg object-cover border" />
                <span className="text-[10px] font-bold text-slate-500 block mt-1">Image Evidence Preview</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Submitting Report...' : 'Submit Completion Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
