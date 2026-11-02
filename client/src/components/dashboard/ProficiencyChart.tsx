import React from 'react';
import { ProficiencyLevel } from '../../types';
import { Target, CheckCircle, Award } from 'lucide-react';

interface ProficiencyChartProps {
  proficiency: ProficiencyLevel[];
}

export const ProficiencyChart: React.FC<ProficiencyChartProps> = ({ proficiency }) => {
  const getColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return {
          bar: 'bg-emerald-500',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/10 border-emerald-500/30'
        };
      case 'Intermediate':
        return {
          bar: 'bg-blue-500',
          text: 'text-blue-400',
          badge: 'bg-blue-500/10 border-blue-500/30'
        };
      case 'Advanced':
        return {
          bar: 'bg-purple-500',
          text: 'text-purple-400',
          badge: 'bg-purple-500/10 border-purple-500/30'
        };
      default:
        return {
          bar: 'bg-cyan-500',
          text: 'text-cyan-400',
          badge: 'bg-cyan-500/10 border-cyan-500/30'
        };
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-[#111726] shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Curriculum Mastery Breakdown</h3>
            <p className="text-xs text-slate-400">Skill proficiency measured by unit-tested code exercises</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {proficiency.map((item) => {
          const style = getColor(item.level);
          return (
            <div key={item.level} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-medium border ${style.badge} ${style.text}`}>
                    {item.level}
                  </span>
                  <span className="text-slate-200 font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">
                    {item.completed}/{item.total} modules
                  </span>
                  <span className={`font-mono font-bold ${style.text}`}>{item.score}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                <div
                  className={`h-full ${style.bar} transition-all duration-500`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
