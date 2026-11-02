import React, { useRef } from 'react';
import { Award, ShieldCheck, Download, Share2, Check, ExternalLink } from 'lucide-react';
import { CertificateMetadata } from '../../types';

interface CertificateCardProps {
  certificate: CertificateMetadata;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const [copied, setCopied] = React.useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certificate.verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(certificate.issueDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Certificate Frame */}
      <div
        ref={certRef}
        className="w-full max-w-3xl aspect-[1.414/1] bg-gradient-to-br from-[#0e1424] via-[#090d16] to-[#0a0f1d] border-8 border-double border-amber-500/40 rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-between text-center select-none"
      >
        {/* Subtle Watermark & Guilloche Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <span className="font-extrabold text-sm sm:text-base text-white tracking-wider uppercase font-mono">
              NexusAI Academy
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographically Verified</span>
          </div>
        </div>

        {/* Main Body */}
        <div className="relative z-10 my-auto py-6 space-y-4">
          <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Certificate of Professional Competency
          </div>

          <h2 className="text-sm sm:text-base text-slate-300 font-light">
            This officially certifies that
          </h2>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200">
            {certificate.studentName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            has successfully completed all rigorous curriculum coursework, laboratory modules, and unit-tested code exercises in
          </p>

          <div className="text-base sm:text-xl font-bold text-blue-400 font-mono tracking-tight">
            {certificate.courseTitle}
          </div>
        </div>

        {/* Footer Meta & QR */}
        <div className="relative z-10 border-t border-amber-500/20 pt-4 flex items-end justify-between text-left">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Date of Conformance</div>
            <div className="text-xs text-slate-200 font-medium font-mono">{formattedDate}</div>
            <div className="text-[9px] text-slate-500 font-mono pt-1">
              Verification Hash: <span className="text-slate-400">{certificate.verificationHash.slice(0, 16)}...</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {certificate.qrCodeUrl && (
              <div className="p-1 rounded bg-white shadow-md">
                <img src={certificate.qrCodeUrl} alt="Verification QR Code" className="w-14 h-14 sm:w-16 sm:h-16" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all"
        >
          <Download className="w-4 h-4" />
          Download / Print Certificate
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm border border-slate-700 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Link Copied!' : 'Copy Verification Link'}</span>
        </button>
      </div>
    </div>
  );
};
