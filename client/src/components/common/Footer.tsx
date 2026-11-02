import React from 'react';
import { Code2, ShieldCheck, Cpu, Terminal, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#070a10] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-lg">NexusAI Academy</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Industrial-grade interactive training platform engineered for modern Data Scientists, ML Engineers, and AI Researchers.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Curriculum Paths</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-blue-400 cursor-pointer">Level 1: Python, NumPy & Pandas</li>
              <li className="hover:text-blue-400 cursor-pointer">Level 2: Scikit-Learn & Machine Learning</li>
              <li className="hover:text-blue-400 cursor-pointer">Level 3: PyTorch, CNNs & Transformers</li>
              <li className="hover:text-blue-400 cursor-pointer">Capstone Projects & Digital Certifications</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Architecture & Stack</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-cyan-400" /> Isolated Python Execution Sandbox</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cryptographic SHA-256 Credentials</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> Monaco IDE with Real-time Auto-grader</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">System Integrity</h4>
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Sandbox Engine:</span>
                <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active (Python 3.14)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">API Status:</span>
                <span className="text-blue-400 font-mono">200 OK</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} NexusAI Academy Inc. Built for elite Data Science engineering.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with <Sparkles className="w-3 h-3 text-cyan-400" /> for production scalability
          </p>
        </div>
      </div>
    </footer>
  );
};
