import React from 'react';
import { CheckCircle2, XCircle, EyeOff, ShieldAlert, Award } from 'lucide-react';
import { TestResult } from '../../types';

interface TestResultsProps {
  testResults?: TestResult[];
  allPassed?: boolean;
  isSubmitting: boolean;
}

export const TestResults: React.FC<TestResultsProps> = ({ testResults, allPassed, isSubmitting }) => {
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#090d16] rounded-xl border border-slate-800 text-slate-400 min-h-[160px]">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-emerald-300">Grading against unit test harness...</p>
      </div>
    );
  }

  if (!testResults || testResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#090d16] rounded-xl border border-slate-800 text-slate-500 min-h-[160px]">
        <Award className="w-6 h-6 mb-2 text-slate-600" />
        <p className="text-xs font-mono">No evaluation run yet. Click "Submit & Evaluate" to verify your solution.</p>
      </div>
    );
  }

  const passedCount = testResults.filter((t) => t.passed).length;
  const totalCount = testResults.length;
  const passPercent = Math.round((passedCount / totalCount) * 100);

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-[#090d16] overflow-hidden text-xs">
      {/* Header Summary */}
      <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {allPassed ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              All Tests Passed! ({passedCount}/{totalCount})
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <XCircle className="w-4 h-4" />
              {passedCount} of {totalCount} Tests Passed
            </span>
          )}
        </div>

        <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${allPassed ? 'bg-emerald-500' : 'bg-amber-500'}`}
            style={{ width: `${passPercent}%` }}
          />
        </div>
      </div>

      {/* Test Cases List */}
      <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
        {testResults.map((tc, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-lg border transition-all ${
              tc.passed
                ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200'
                : 'bg-rose-950/20 border-rose-900/50 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between font-mono font-medium">
              <div className="flex items-center gap-2">
                {tc.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{tc.name}</span>
                {tc.hidden && (
                  <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    <EyeOff className="w-3 h-3" />
                    Hidden
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500">{tc.durationMs}ms</span>
            </div>

            {!tc.passed && tc.error && (
              <div className="mt-2 p-2 rounded bg-black/40 border border-rose-900/40 text-[11px] font-mono text-rose-300 overflow-x-auto">
                <span className="text-slate-400">Error: </span>
                {tc.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
