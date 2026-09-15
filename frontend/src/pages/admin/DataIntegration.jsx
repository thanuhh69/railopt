import React, { useState } from 'react';
import { Database, Upload, Download, CheckCircle2, FileText, AlertCircle, RefreshCcw } from 'lucide-react';
import api from '../../utils/api';
import { SAMPLE_CSV_TEMPLATES } from '../../utils/sampleTemplates';

export default function DataIntegration() {
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState('maintenance');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState(null);

  const sources = [
    {
      id: 'TMS',
      name: 'TMS',
      full: 'Track Management System',
      dept: 'Engineering Department',
      desc: 'Integrates track defects, sleeper replacements, rail joint cracks, and ballast deep screening requirements.',
      records: '520 Records',
      status: 'Available',
      color: 'bg-blue-600'
    },
    {
      id: 'SMMS',
      name: 'SMMS',
      full: 'Signalling Maintenance & Management System',
      dept: 'Signal & Telecommunication',
      desc: 'Integrates switch point machine calibrations, axle counters, signal relays, and interlocking inspections.',
      records: '348 Records',
      status: 'Available',
      color: 'bg-emerald-600'
    },
    {
      id: 'TDMS',
      name: 'TDMS',
      full: 'Traction Distribution Management System',
      dept: 'Traction Distribution (OHE)',
      desc: 'Integrates overhead power catenary line wire tensioning, insulator cleaning, and power block demands.',
      records: '380 Records',
      status: 'Available',
      color: 'bg-amber-600'
    },
    {
      id: 'COA',
      name: 'COA',
      full: 'Control Office Application',
      dept: 'Traffic Operations & Timetable',
      desc: 'Provides real-time section corridor availability windows and passenger/freight train timetables.',
      records: '500+ Trains & 50 Corridors',
      status: 'Available',
      color: 'bg-purple-600'
    },
    {
      id: 'BDMS',
      name: 'BDMS',
      full: 'Block Demand Management System',
      dept: 'Multi-Department Block Demands',
      desc: 'Receives formal departmental requests for maintenance blocks and disconnections.',
      records: '164 Active Demands',
      status: 'Available',
      color: 'bg-indigo-600'
    }
  ];

  const handleDownloadSample = (typeKey) => {
    const content = SAMPLE_CSV_TEMPLATES[typeKey];
    if (!content) return;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_${typeKey}_data.csv`;
    a.click();
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      let endpoint = '/maintenance/upload';
      if (uploadType === 'corridor') endpoint = '/corridors/upload';
      if (uploadType === 'trains') endpoint = '/trains/upload';

      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        setMessage({ type: 'success', text: res.data.message });
        setSelectedFile(null);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'CSV Import failed' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            Data Integration Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
            Simulating legacy Indian Railways data sources (TMS, SMMS, TDMS, COA, BDMS) using MongoDB collections and batch CSV ingestion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadSample('maintenance')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Sample Maintenance CSV
          </button>
        </div>
      </div>

      {/* Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sources.map((src) => (
          <div key={src.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${src.color} shadow-xs`}></span>
                <span className="font-black text-lg text-slate-900 tracking-tight">{src.name}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {src.status}
              </span>
            </div>

            <div className="text-xs font-extrabold text-blue-900 mb-1">{src.full}</div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed font-normal">{src.desc}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">{src.dept}</span>
              <span className="text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">{src.records}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CSV Batch Upload Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-600" />
          Batch Data CSV Upload & Ingestion
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-medium">
          Upload synthetic CSV files to ingest maintenance tasks, train timetables, or corridor availability.
        </p>

        {message && (
          <div className={`p-4 rounded-xl border text-xs font-bold mb-4 flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Data Category</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="maintenance">Maintenance Data (TMS / SMMS / TDMS)</option>
                <option value="trains">Train Timetable (COA)</option>
                <option value="corridor">Corridor Availability (COA)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Select CSV File</label>
              <input
                type="file"
                accept=".csv"
                required
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2 text-[11px] text-slate-500 font-medium">
              <span>Download sample template:</span>
              <button type="button" onClick={() => handleDownloadSample('maintenance')} className="text-blue-600 underline font-bold">Tasks CSV</button>
              <button type="button" onClick={() => handleDownloadSample('trains')} className="text-blue-600 underline font-bold">Trains CSV</button>
              <button type="button" onClick={() => handleDownloadSample('corridor')} className="text-blue-600 underline font-bold">Corridors CSV</button>
            </div>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-5 py-2.5 bg-[#002B49] hover:bg-[#00385F] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Importing...' : 'Upload & Process CSV'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
