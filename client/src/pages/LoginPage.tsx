import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Code2, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const quickLogin = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('Password@123');
    const success = await login(roleEmail, 'Password@123');
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-[#111726] p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Code2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to NexusAI</h1>
          <p className="text-xs text-slate-400">Access your coursework, sandbox history, and certificates.</p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 space-y-2 text-xs">
          <div className="flex items-center justify-between text-blue-400 font-mono font-semibold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Default Sign In Credentials
            </span>
            <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded">Pre-Seeded</span>
          </div>
          <div className="space-y-1 font-mono text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Student:</span>
              <span className="text-white">student@nexusai.academy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Instructor:</span>
              <span className="text-white">instructor@nexusai.academy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Admin:</span>
              <span className="text-white">admin@nexusai.academy</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-blue-500/20 text-cyan-300">
              <span>Password (All):</span>
              <span className="font-bold">Password@123</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nexusai.academy"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Profiles */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
          <div className="text-[11px] font-mono font-medium text-slate-400 text-center uppercase tracking-wider">
            Quick 1-Click Demo Logins
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickLogin('student@nexusai.academy')}
              className="px-2 py-2 rounded-lg bg-slate-800 hover:bg-blue-600/30 text-[11px] font-mono text-slate-300 hover:text-blue-300 border border-slate-700 transition-colors"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => quickLogin('instructor@nexusai.academy')}
              className="px-2 py-2 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-[11px] font-mono text-slate-300 hover:text-indigo-300 border border-slate-700 transition-colors"
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => quickLogin('admin@nexusai.academy')}
              className="px-2 py-2 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-[11px] font-mono text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline font-semibold">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};
