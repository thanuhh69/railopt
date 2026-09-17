import React, { useState } from 'react';
import { UserCheck, MapPin, Building2, Shield, Phone, Mail, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function UserProfile() {
  const { user, login } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || user?.name || 'Ravi Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 94401 56789');
  const [baseCity, setBaseCity] = useState(user?.baseCity || 'Vijayawada');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const profile = {
    employeeId: user?.employeeId || 'EMP-1042',
    username: user?.username || 'ravikumar',
    email: user?.email || 'user@railopt.demo',
    department: user?.department || 'Engineering',
    designation: user?.designation || 'Senior Section Engineer (SSE)',
    railwayDivision: user?.railwayDivision || 'Vijayawada Division',
    assignedZone: user?.assignedZone || 'Vijayawada Area',
    assignedCorridor: user?.assignedCorridor || 'Vijayawada – Gudivada (VJA-GNT)',
    role: (user?.role || 'USER').toUpperCase()
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await api.put('/auth/profile', { fullName, phone, baseCity });
      if (res.data?.success) {
        setMessage('Profile updated successfully!');
        const updatedUser = { ...user, fullName, phone, baseCity };
        login(updatedUser);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#002B49] p-6 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl border border-blue-400/30 shadow-md">
            {fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{fullName}</h1>
            <p className="text-xs text-blue-200 mt-0.5 font-medium flex items-center gap-2">
              <span>{profile.department}</span> • <span>{profile.designation}</span>
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded-xl text-xs font-bold font-mono">
          ID: {profile.employeeId}
        </span>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Assigned Base Railway Operational Location */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-blue-600" /> Assigned Base Railway Operational Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Base City (Editable)</label>
              <input
                type="text"
                value={baseCity}
                onChange={(e) => setBaseCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Railway Division (Protected)</label>
              <input
                type="text"
                disabled
                value={profile.railwayDivision}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Assigned Zone (Protected)</label>
              <input
                type="text"
                disabled
                value={profile.assignedZone}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Assigned Corridor (Protected)</label>
              <input
                type="text"
                disabled
                value={profile.assignedCorridor}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-blue-700 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Employee Profile Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-blue-600" /> Railway Employee Identity & Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Employee ID (Protected)</label>
              <input
                type="text"
                disabled
                value={profile.employeeId}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Department (Protected)</label>
              <input
                type="text"
                disabled
                value={profile.department}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Designation (Protected)</label>
              <input
                type="text"
                disabled
                value={profile.designation}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-950/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
