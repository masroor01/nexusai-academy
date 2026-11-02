import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCourseStore } from '../store/courseStore';
import { useExecutionStore } from '../store/executionStore';
import { useAuthStore } from '../store/authStore';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { CodeEditor } from '../components/playground/CodeEditor';
import { OutputConsole } from '../components/playground/OutputConsole';
import { TestResults } from '../components/playground/TestResults';
import { CertificateCard } from '../components/certificate/CertificateCard';
import {
  Play,
  FileText,
  Bookmark,
  CheckCircle2,
  Circle,
  Terminal,
  Send,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Save,
  HelpCircle,
  Award,
  X
} from 'lucide-react';

export const LessonWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentLesson,
    lessonLoading,
    fetchLessonById,
    toggleLessonCompletion,
    saveNote,
    addBookmark,
    deleteBookmark
  } = useCourseStore();

  const {
    code,
    setCode,
    stdin,
    setStdin,
    isExecuting,
    isSubmitting,
    result,
    activeTab,
    setActiveTab,
    clearResults,
    runCode,
    submitExercise,
    unlockedCertificate,
    dismissCertificateModal
  } = useExecutionStore();

  const [leftTab, setLeftTab] = useState<'lecture' | 'notes' | 'bookmarks'>('lecture');
  const [personalNote, setPersonalNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (id) {
      clearResults();
      fetchLessonById(id);
    }
  }, [id, fetchLessonById, clearResults]);

  useEffect(() => {
    if (currentLesson) {
      if (currentLesson.exercise) {
        setCode(currentLesson.exercise.starterCode);
      }
      setPersonalNote(currentLesson.note || '');
    }
  }, [currentLesson, setCode]);

  const handleRunCode = async () => {
    await runCode();
  };

  const handleSubmitSolution = async () => {
    if (!currentLesson?.exercise) return;

    if (!user) {
      alert('Please log in to submit exercises and record your progress!');
      return;
    }

    const { allPassed, courseCompleted } = await submitExercise(currentLesson.id);

    if (allPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Refresh completion locally
      await toggleLessonCompletion(currentLesson.id, true);

      if (courseCompleted) {
        setShowCelebration(true);
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 }
        });
      }
    }
  };

  const handleToggleCompleted = async () => {
    if (!currentLesson) return;
    const nextStatus = !currentLesson.isCompleted;
    const res = await toggleLessonCompletion(currentLesson.id, nextStatus);
    if (res?.courseCompleted) {
      setShowCelebration(true);
      confetti({ particleCount: 200, spread: 120 });
    }
  };

  const handleSaveNotes = async () => {
    if (!currentLesson) return;
    setIsSavingNote(true);
    await saveNote(currentLesson.id, personalNote);
    setIsSavingNote(false);
  };

  if (lessonLoading || !currentLesson) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400">Loading interactive coding laboratory...</p>
      </div>
    );
  }

  const course = currentLesson.module.course;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0a0d14] overflow-hidden">
      {/* Top Workspace Header Bar */}
      <div className="h-14 border-b border-slate-800 bg-[#0d121f] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to={`/courses/${course.slug}`}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-mono">{course.title}</span>
          </Link>
          <span className="text-slate-700 font-mono">/</span>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {currentLesson.title}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
              {currentLesson.module.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Manual Completion Toggle */}
          <button
            onClick={handleToggleCompleted}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentLesson.isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {currentLesson.isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5" />
                <span>Mark as Done</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Column: Video, Lecture Markdown, Notes, Bookmarks */}
        <div className="flex flex-col border-r border-slate-800 overflow-y-auto bg-[#0c101a]">
          {/* Left Column Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-[#090d16] px-4">
            <button
              onClick={() => setLeftTab('lecture')}
              className={`flex items-center gap-2 px-3.5 py-3 text-xs font-semibold border-b-2 transition-all ${
                leftTab === 'lecture'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Lesson & Video
            </button>
            <button
              onClick={() => setLeftTab('notes')}
              className={`flex items-center gap-2 px-3.5 py-3 text-xs font-semibold border-b-2 transition-all ${
                leftTab === 'notes'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              My Notes
            </button>
            <button
              onClick={() => setLeftTab('bookmarks')}
              className={`flex items-center gap-2 px-3.5 py-3 text-xs font-semibold border-b-2 transition-all ${
                leftTab === 'bookmarks'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Bookmarks ({currentLesson.bookmarks.length})
            </button>
          </div>

          <div className="p-6 space-y-6">
            {leftTab === 'lecture' && (
              <>
                {/* Custom Video Player */}
                <VideoPlayer
                  videoUrl={currentLesson.videoUrl}
                  lessonId={currentLesson.id}
                  bookmarks={currentLesson.bookmarks}
                  onAddBookmark={(ts, title) => addBookmark(currentLesson.id, ts, title)}
                  onProgressSync={() => handleToggleCompleted()}
                />

                {/* Lecture Notes in Markdown */}
                <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
                  <div className="p-4 rounded-xl border border-slate-800 bg-[#111726]/60 whitespace-pre-wrap font-sans">
                    {currentLesson.contentMarkdown}
                  </div>
                </div>
              </>
            )}

            {leftTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Revision Notebook</h3>
                    <p className="text-xs text-slate-400">Save personal formulas, insights, and key reminders.</p>
                  </div>
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNote}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingNote ? 'Saving...' : 'Save Note'}</span>
                  </button>
                </div>

                <textarea
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Record key observations, mathematical formulas, or edge case pitfalls..."
                  className="w-full h-80 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed resize-none font-mono"
                />
              </div>
            )}

            {leftTab === 'bookmarks' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Video Moment Bookmarks</h3>
                {currentLesson.bookmarks.length === 0 ? (
                  <p className="text-xs text-slate-400">No bookmarks saved yet. Use the "Note Moment" button in the video player to mark key parts.</p>
                ) : (
                  <div className="space-y-2">
                    {currentLesson.bookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        className="p-3 rounded-xl border border-slate-800 bg-[#111726] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                            {Math.floor(bm.timestamp / 60)}:{(Math.floor(bm.timestamp % 60) < 10 ? '0' : '')}{Math.floor(bm.timestamp % 60)}
                          </span>
                          <span className="text-slate-200 font-medium">{bm.title}</span>
                        </div>
                        <button
                          onClick={() => deleteBookmark(bm.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Coding Playground & Auto-Grader */}
        <div className="flex flex-col overflow-y-auto bg-[#0a0d14]">
          {currentLesson.exercise ? (
            <div className="flex flex-col h-full p-4 space-y-4">
              {/* Exercise Prompt Box */}
              <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-950/20 text-slate-300 space-y-2 shrink-0">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>Interactive Coding Laboratory</span>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-200">
                  {currentLesson.exercise.prompt}
                </p>
              </div>

              {/* Code Editor Container */}
              <div className="flex-1 min-h-[360px]">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  onReset={() => setCode(currentLesson.exercise?.starterCode || '')}
                />
              </div>

              {/* Execution Actions Toolbar */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0e1424] border border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('console')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeTab === 'console'
                        ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Console Output
                  </button>
                  <button
                    onClick={() => setActiveTab('tests')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeTab === 'tests'
                        ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Test Suite Results
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isExecuting || isSubmitting}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all border border-slate-700 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                    <span>Run Code</span>
                  </button>

                  <button
                    onClick={handleSubmitSolution}
                    disabled={isExecuting || isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Evaluate</span>
                  </button>
                </div>
              </div>

              {/* Output & Test Console */}
              <div className="shrink-0">
                {activeTab === 'console' ? (
                  <OutputConsole
                    result={result}
                    isExecuting={isExecuting}
                    onClear={clearResults}
                  />
                ) : (
                  <TestResults
                    testResults={result?.testResults}
                    allPassed={result?.allPassed}
                    isSubmitting={isSubmitting}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full">
              <Terminal className="w-8 h-8 mb-2" />
              <p className="text-sm">This lesson contains video and lecture material without an interactive exercise.</p>
            </div>
          )}
        </div>
      </div>

      {/* Course Completion & Certificate Unlocked Celebration Modal */}
      {(showCelebration || unlockedCertificate) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-2xl w-full rounded-3xl border border-amber-500/40 bg-[#0e1424] p-6 sm:p-8 text-center shadow-2xl relative space-y-6">
            <button
              onClick={() => {
                setShowCelebration(false);
                dismissCertificateModal();
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl">
              <Award className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Course Complete!
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Mastery Achieved: Digital Certificate Unlocked
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Congratulations! You have passed all unit-tested coding exercises and laboratory modules across the entire curriculum.
              </p>
            </div>

            {unlockedCertificate ? (
              <div className="pt-2">
                <CertificateCard certificate={unlockedCertificate} />
              </div>
            ) : (
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  to="/dashboard"
                  onClick={() => setShowCelebration(false)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/20"
                >
                  View in Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
