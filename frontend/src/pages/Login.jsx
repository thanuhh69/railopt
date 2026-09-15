import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrainFront, Shield, User, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('admin@railopt.demo');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        if (res.data.token) {
          localStorage.setItem('railopt_token', res.data.token);
        }
        login(res.data.user);
        const role = (res.data.user.role || '').toUpperCase();
        if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 z-10">
        <div className="bg-[#002B49] p-8 text-white text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center shadow-xl mb-3 border border-blue-400/30">
            <TrainFront className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">RAILOPT</h1>
          <p className="text-xs text-blue-200 mt-1 font-medium">Automatic Railway Maintenance Block Planning System</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Portal Login Preset</label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => { setEmail('admin@railopt.demo'); setPassword('admin123'); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  email === 'admin@railopt.demo'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Admin Portal</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">admin@railopt.demo</div>
              </button>

              <button
                type="button"
                onClick={() => { setEmail('user@railopt.demo'); setPassword('user123'); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  email === 'user@railopt.demo'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>User Portal</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">user@railopt.demo</div>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#002B49] hover:bg-[#00385F] text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            {loading ? 'Authenticating...' : 'Login'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-4 text-center border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">New User?</span>
            <Link to="/register" className="text-xs font-bold text-blue-700 hover:underline">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
