import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CertificateMetadata } from '../types';
import { CertificateCard } from '../components/certificate/CertificateCard';
import { ShieldCheck, Search, AlertCircle, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const CertificateVerifyPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId?: string }>();
  const navigate = useNavigate();

  const [inputHash, setInputHash] = useState(certificateId || '');
  const [certificate, setCertificate] = useState<CertificateMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performVerification = async (idToVerify: string) => {
    if (!idToVerify.trim()) return;
    setLoading(true);
    setError(null);
    setCertificate(null);

    try {
      const res = await api.get(`/certificates/verify/${idToVerify.trim()}`);
      setCertificate(res.data.data.certificate);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Certificate not found or verification ID invalid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      performVerification(certificateId);
    }
  }, [certificateId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputHash.trim()) {
      navigate(`/verify/${inputHash.trim()}`);
      performVerification(inputHash.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Public Credential Verification Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify NexusAI Academy Digital Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          NexusAI digital certificates are cryptographically bound using SHA-256 hashes and timestamped directly on our distributed records.
        </p>
      </div>

      {/* Verification Lookup Input */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter Certificate UUID or verification ID..."
            value={inputHash}
            onChange={(e) => setInputHash(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !inputHash.trim()}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <span>{loading ? 'Verifying...' : 'Verify'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Results State */}
      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <div className="font-bold">Credential Verification Failed</div>
            <div className="text-rose-200/80">{error}</div>
          </div>
        </div>
      )}

      {certificate && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold">Official Record Verified Authentic</span>
            </div>
            <span className="font-mono text-emerald-400/80 text-xs">
              Issued: {new Date(certificate.issueDate).toLocaleDateString()}
            </span>
          </div>

          <CertificateCard certificate={certificate} />
        </div>
      )}
    </div>
  );
};
