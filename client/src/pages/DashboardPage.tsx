import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { StreakTracker } from '../components/dashboard/StreakTracker';
import { ProficiencyChart } from '../components/dashboard/ProficiencyChart';
import { StatsCard } from '../components/dashboard/StatsCard';
import { CertificateCard } from '../components/certificate/CertificateCard';
import { StudentAnalytics, CertificateMetadata } from '../types';
import {
  Flame,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null);
  const [certificates, setCertificates] = useState<CertificateMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anaRes, certRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/certificates/my')
        ]);
        setAnalytics(anaRes.data.data);
        setCertificates(certRes.data.data.certificates);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400">Loading student analytics & credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-slate-800 bg-[#111726] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {user?.role} ACCOUNT
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {user?.id.slice(0, 8)}...</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track your daily engineering streak, algorithmic mastery, and verifiable certifications.
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Daily Streak"
          value={`${analytics?.streak || 1} Days`}
          subtitle="Consecutive code commits"
          icon={Flame}
          colorClass="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />
        <StatsCard
          title="Lessons Completed"
          value={`${analytics?.completedLessons || 0} / ${analytics?.totalLessons || 0}`}
          subtitle={`${analytics?.totalCompletionPercentage || 0}% total progress`}
          icon={BookOpen}
          colorClass="bg-blue-500/10 text-blue-400 border border-blue-500/20"
        />
        <StatsCard
          title="Estimated Time"
          value={`${analytics?.hoursSpent || 0} hrs`}
          subtitle="In lab exercises & lectures"
          icon={Clock}
          colorClass="bg-purple-500/10 text-purple-400 border border-purple-500/20"
        />
        <StatsCard
          title="Certifications"
          value={certificates.length}
          subtitle="Verifiable digital credentials"
          icon={Award}
          colorClass="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />
      </div>

      {/* Streak Tracker & Proficiency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StreakTracker streak={analytics?.streak || 1} />
        </div>
        <div className="lg:col-span-2">
          {analytics?.proficiency && <ProficiencyChart proficiency={analytics.proficiency} />}
        </div>
      </div>

      {/* Earned Digital Certificates Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Verifiable Digital Certificates
            </h2>
            <p className="text-xs text-slate-400">
              Each credential features an immutable SHA-256 verification hash and live public QR code.
            </p>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="p-8 rounded-2xl border border-slate-800 bg-[#111726] text-center space-y-3">
            <Award className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No certificates unlocked yet</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Complete 100% of the lessons and pass all unit-tested coding exercises in a course to automatically issue your verified credential!
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-6 rounded-3xl border border-slate-800 bg-[#111726]/60">
                <CertificateCard certificate={cert} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
