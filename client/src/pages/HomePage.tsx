import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Cpu,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Database,
  BrainCircuit,
  ShieldCheck,
  Play
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const HomePage: React.FC = () => {
  const { user } = useAuthStore();

  const curriculumLevels = [
    {
      level: 'Level 1: Beginner',
      title: 'Python for Data Science & Scientific Computing',
      badge: 'Syntax & Wrangling',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Master core Python data structures, list comprehensions, vectorized mathematical array manipulation with NumPy, and exploratory data analysis with Pandas.',
      icon: Database,
      topics: ['Pythonic Syntax & Comprehensions', 'NumPy Vectorization & Slicing', 'Pandas DataFrames & Aggregations', 'Matplotlib & Statistical Plots']
    },
    {
      level: 'Level 2: Intermediate',
      title: 'Machine Learning Engineering with Scikit-Learn',
      badge: 'Supervised & Unsupervised',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      description: 'Implement regression and classification from scratch, understand convex loss functions, optimize with gradient descent, and master cross-validation.',
      icon: Cpu,
      topics: ['Convex Optimization & MSE Loss', 'Logistic Regression & Decision Trees', 'Confusion Matrix, Precision & Recall', 'Feature Engineering & Ensembles']
    },
    {
      level: 'Level 3: Advanced',
      title: 'Deep Learning Architectures & Modern AI',
      badge: 'Neural Networks & LLMs',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'Build deep neural networks, implement backpropagation, understand convolutional filters (CNNs), sequence models (LSTMs), and Transformer self-attention.',
      icon: BrainCircuit,
      topics: ['ReLU & Numerically Stable Softmax', 'Deep Feedforward & Backpropagation', 'Convolutional Feature Maps (CNNs)', 'Scaled Dot-Product Attention (Transformers)']
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-cyan-400/20 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Generation EdTech Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Master Data Science & AI. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
              Directly in the Browser.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            NexusAI Academy combines immersive video lessons, interactive Monaco code playgrounds, and an automated Python unit-test evaluation engine—empowering you from syntax basics to Transformer models.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/courses"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/25 transition-all text-sm group"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-sm"
              >
                Start Free Learning
              </Link>
            )}
          </div>

          {/* Interactive Feature Highlights Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <Terminal className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-xs font-bold text-white">Monaco Code IDE</div>
              <div className="text-[11px] text-slate-400">Integrated Python execution</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <Cpu className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-xs font-bold text-white">Auto-Grader Engine</div>
              <div className="text-[11px] text-slate-400">Instant unit test verification</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <Play className="w-5 h-5 text-blue-400 mb-2" />
              <div className="text-xs font-bold text-white">Adaptive Video</div>
              <div className="text-[11px] text-slate-400">Timestamps & auto-sync</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <Award className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-xs font-bold text-white">SHA-256 Credentials</div>
              <div className="text-[11px] text-slate-400">Public QR code verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Levels Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400">
            End-To-End Learning Path
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Structured From Ground Zero to Frontier AI
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Every module includes theory, breakdown videos, rich markdown lecture notes, and automated unit-tested coding exercises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {curriculumLevels.map((lvl, index) => {
            const Icon = lvl.icon;
            return (
              <div
                key={index}
                className="flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-[#111726]/80 hover:border-slate-700 transition-all shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-full border ${lvl.badgeColor}`}>
                      {lvl.level}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {lvl.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lvl.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Key Milestones:</div>
                    <ul className="space-y-1.5">
                      {lvl.topics.map((t, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80">
                  <Link
                    to="/courses"
                    className="flex items-center justify-between text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>Inspect Course Syllabus</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Platform Architecture Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-800 bg-gradient-to-b from-[#111726] to-[#0a0d14] relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
                Developer-First Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Write Real Python Code in Monaco. <br />
                Get Real Execution Feedback in Milliseconds.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                No local dependencies or virtual environments required. Our secure sandboxed backend executes your Python algorithms, checks memory boundaries, tests against public and hidden unit test cases, and dynamically updates your progress.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Strict Sandbox Isolation:</strong> Memory caps, 5s process timeouts, and AST policy safeguards.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Automated Grading Harness:</strong> Comprehensive hidden test cases verify edge conditions.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Cryptographic Certificate:</strong> Instant issuance upon 100% course and lab completion.
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Code Playground Preview Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-4 shadow-2xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="text-cyan-400 font-semibold">interactive_test.py</span>
                <span className="text-emerald-400">● Sandbox Ready</span>
              </div>
              <pre className="text-slate-300 leading-relaxed text-[11px] overflow-x-auto">
{`# Feature Normalization in NumPy
def min_max_scale(values):
    min_v, max_v = min(values), max(values)
    return [(x - min_v) / (max_v - min_v) for x in values]

# Unit Test Assertion
assert min_max_scale([10, 20, 30]) == [0.0, 0.5, 1.0]
print("All unit assertions passed successfully!")`}
              </pre>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold">✓ Test 1: Passed (14ms)</span>
                <span className="text-slate-500">Exit Code: 0</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
