import React from 'react';
import { Terminal, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { ExecutionResult } from '../../types';

interface OutputConsoleProps {
  result: ExecutionResult | null;
  isExecuting: boolean;
  onClear: () => void;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({ result, isExecuting, onClear }) => {
  if (isExecuting) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#090d16] rounded-xl border border-slate-800 text-slate-400 min-h-[160px]">
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-cyan-300">Spawning sandboxed Python worker process...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#090d16] rounded-xl border border-slate-800 text-slate-500 min-h-[160px]">
        <Terminal className="w-6 h-6 mb-2 text-slate-600" />
        <p className="text-xs font-mono">Console is idle. Press "Run Code" or "Submit Solution" to execute.</p>
      </div>
    );
  }

  const isSuccess = result.exitCode === 0 && !result.stderr;

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-[#090d16] overflow-hidden text-xs font-mono">
      {/* Console Status Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Process Exited (0)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <XCircle className="w-3.5 h-3.5" />
              Process Exited ({result.exitCode ?? 1})
            </span>
          )}
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3" />
            {result.durationMs}ms
          </span>
        </div>

        <button
          onClick={onClear}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output Content */}
      <div className="p-3.5 max-h-60 overflow-y-auto space-y-2 selection:bg-slate-700">
        {result.stdout && (
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Standard Output</div>
            <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">{result.stdout}</pre>
          </div>
        )}

        {result.stderr && (
          <div>
            <div className="text-[10px] text-rose-500 uppercase tracking-wider mb-0.5">Execution Diagnostics</div>
            <pre className="text-rose-400 whitespace-pre-wrap leading-relaxed">{result.stderr}</pre>
          </div>
        )}

        {result.securityViolation && (
          <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Security Violation</div>
              <div className="text-[11px] text-amber-200/90">{result.securityViolation}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
