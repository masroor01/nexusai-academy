import { create } from 'zustand';
import api from '../services/api';
import { ExecutionResult, CertificateMetadata } from '../types';

interface ExecutionState {
  code: string;
  stdin: string;
  isExecuting: boolean;
  isSubmitting: boolean;
  result: ExecutionResult | null;
  activeTab: 'console' | 'tests';
  unlockedCertificate: CertificateMetadata | null;

  setCode: (code: string) => void;
  setStdin: (stdin: string) => void;
  setActiveTab: (tab: 'console' | 'tests') => void;
  clearResults: () => void;
  runCode: () => Promise<void>;
  submitExercise: (lessonId: string) => Promise<{ allPassed: boolean; courseCompleted: boolean }>;
  dismissCertificateModal: () => void;
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  code: '',
  stdin: '',
  isExecuting: false,
  isSubmitting: false,
  result: null,
  activeTab: 'console',
  unlockedCertificate: null,

  setCode: (code) => set({ code }),
  setStdin: (stdin) => set({ stdin }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  clearResults: () => set({ result: null }),

  runCode: async () => {
    const { code, stdin } = get();
    set({ isExecuting: true, activeTab: 'console' });
    try {
      const res = await api.post('/execution/run', { code, stdin });
      set({ result: res.data.data, isExecuting: false });
    } catch (err: any) {
      set({
        isExecuting: false,
        result: {
          stdout: '',
          stderr: err.response?.data?.message || 'Execution request failed',
          exitCode: 1,
          durationMs: 0,
          timedOut: false
        }
      });
    }
  },

  submitExercise: async (lessonId: string) => {
    const { code } = get();
    set({ isSubmitting: true, activeTab: 'tests' });
    try {
      const res = await api.post('/execution/submit', { lessonId, code });
      const { evaluation, courseCompleted, certificate } = res.data.data;

      set({
        result: evaluation,
        isSubmitting: false,
        unlockedCertificate: certificate || null
      });

      return {
        allPassed: !!evaluation.allPassed,
        courseCompleted: !!courseCompleted
      };
    } catch (err: any) {
      set({
        isSubmitting: false,
        result: {
          stdout: '',
          stderr: err.response?.data?.message || 'Submission failed. Please log in first.',
          exitCode: 1,
          durationMs: 0,
          timedOut: false,
          allPassed: false
        }
      });
      return { allPassed: false, courseCompleted: false };
    }
  },

  dismissCertificateModal: () => set({ unlockedCertificate: null })
}));
