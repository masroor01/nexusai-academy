import React from 'react';
import { Flame, Sparkles, Calendar } from 'lucide-react';

interface StreakTrackerProps {
  streak: number;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({ streak }) => {
  return (
    <div className="p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-[#111726] to-[#0d121f] relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Active Learning Streak</h3>
            <p className="text-xs text-slate-400">Consistent daily Python & ML problem solving</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-amber-400 font-mono">{streak}</span>
          <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Days</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mt-4">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
          const isActive = idx < Math.min(streak, 7);
          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center py-2 rounded-lg border text-xs font-mono transition-all ${
                isActive
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}
            >
              <span className="text-[10px] text-slate-400">{day}</span>
              <span className="mt-0.5">{isActive ? '✓' : '•'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
