import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import {
  BookOpen,
  Layers,
  CheckCircle2,
  Circle,
  Play,
  Terminal,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentCourse, fetchCourseBySlug, loading } = useCourseStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      fetchCourseBySlug(slug);
    }
  }, [slug, fetchCourseBySlug]);

  if (loading || !currentCourse) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400">Loading curriculum syllabus...</p>
      </div>
    );
  }

  // Find first uncompleted lesson, or fall back to first lesson
  let nextLessonId: string | null = null;
  for (const mod of currentCourse.modules) {
    for (const l of mod.lessons) {
      if (!l.isCompleted && !nextLessonId) {
        nextLessonId = l.id;
        break;
      }
    }
  }

  if (!nextLessonId && currentCourse.modules[0]?.lessons[0]) {
    nextLessonId = currentCourse.modules[0].lessons[0].id;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Course Hero Banner */}
      <div className="rounded-3xl border border-slate-800 bg-[#111726] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {currentCourse.level}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {currentCourse.modules.length} Modules &bull; {currentCourse.totalLessons} Lessons
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {currentCourse.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {currentCourse.description}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              {nextLessonId && (
                <button
                  onClick={() => navigate(`/lesson/${nextLessonId}`)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all group"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{currentCourse.progressPercentage > 0 ? 'Resume Learning' : 'Start First Lesson'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>Progress: {currentCourse.completedLessons}/{currentCourse.totalLessons} ({currentCourse.progressPercentage}%)</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-black">
            <img
              src={currentCourse.thumbnail}
              alt={currentCourse.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Course Curriculum Accordion / Module List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Curriculum Structure & Coding Exercises
          </h2>
        </div>

        <div className="space-y-4">
          {currentCourse.modules.map((module, mIdx) => (
            <div
              key={module.id}
              className="rounded-2xl border border-slate-800 bg-[#111726]/90 overflow-hidden shadow-lg"
            >
              {/* Module Header */}
              <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono font-medium text-cyan-400 uppercase tracking-wider">
                    Module {mIdx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">{module.title}</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'}
                </span>
              </div>

              {/* Lessons within Module */}
              <div className="divide-y divide-slate-800/60">
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={`/lesson/${lesson.id}`}
                    className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {lesson.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0 group-hover:text-blue-400 transition-colors" />
                      )}
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                          {lesson.title}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {lesson.hasExercise && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono">
                          <Terminal className="w-3 h-3" />
                          Code Exercise
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
