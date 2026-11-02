import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import { BookOpen, Layers, Clock, Award, ArrowRight, Sparkles, Filter } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const { courses, fetchCourses, loading } = useCourseStore();
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = courses.filter((c) => {
    if (selectedLevel === 'ALL') return true;
    return c.level.toLowerCase().includes(selectedLevel.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-blue-400 uppercase tracking-widest">
          <BookOpen className="w-4 h-4" />
          <span>Curriculum Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Comprehensive Data Science & Deep Learning Paths
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Master the foundational mathematics, scientific libraries, machine learning algorithms, and deep neural architectures through interactive coding labs.
        </p>
      </div>

      {/* Level Filters */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
        <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLevel === lvl
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            {lvl === 'ALL' ? 'All Learning Paths' : lvl}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">Loading structured curriculum modules...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center border border-slate-800 rounded-2xl bg-[#111726]">
          <p className="text-sm text-slate-400">No courses match the selected level filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col rounded-2xl border border-slate-800 bg-[#111726] hover:border-slate-700 transition-all overflow-hidden shadow-xl group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-300 font-semibold">
                  {course.level}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Progress / Stats */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      {course.moduleCount} Modules ({course.lessonCount} Lessons)
                    </span>
                    <span className="font-mono text-slate-300 font-medium">
                      {course.progressPercentage}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>

                  <Link
                    to={`/courses/${course.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold text-xs transition-all shadow-sm group/btn"
                  >
                    <span>{course.progressPercentage > 0 ? 'Continue Curriculum' : 'View Syllabus & Start'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
