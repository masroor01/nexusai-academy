import { create } from 'zustand';
import api from '../services/api';
import { CourseSummary, CourseDetail, LessonDetail, Bookmark } from '../types';

interface CourseState {
  courses: CourseSummary[];
  currentCourse: CourseDetail | null;
  currentLesson: LessonDetail | null;
  loading: boolean;
  lessonLoading: boolean;
  error: string | null;

  fetchCourses: () => Promise<void>;
  fetchCourseBySlug: (slug: string) => Promise<void>;
  fetchLessonById: (id: string) => Promise<void>;
  toggleLessonCompletion: (lessonId: string, completed: boolean) => Promise<any>;
  saveNote: (lessonId: string, content: string) => Promise<void>;
  addBookmark: (lessonId: string, timestamp: number, title: string) => Promise<Bookmark | null>;
  deleteBookmark: (id: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  currentCourse: null,
  currentLesson: null,
  loading: false,
  lessonLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/courses');
      set({ courses: res.data.data.courses, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to load courses' });
    }
  },

  fetchCourseBySlug: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/courses/slug/${slug}`);
      set({ currentCourse: res.data.data.course, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to load course' });
    }
  },

  fetchLessonById: async (id: string) => {
    set({ lessonLoading: true, error: null });
    try {
      const res = await api.get(`/courses/lesson/${id}`);
      set({ currentLesson: res.data.data.lesson, lessonLoading: false });
    } catch (err: any) {
      set({ lessonLoading: false, error: err.response?.data?.message || 'Failed to load lesson' });
    }
  },

  toggleLessonCompletion: async (lessonId: string, completed: boolean) => {
    try {
      const res = await api.post('/progress/toggle', { lessonId, completed });
      const current = get().currentLesson;
      if (current && current.id === lessonId) {
        set({ currentLesson: { ...current, isCompleted: completed } });
      }
      return res.data.data;
    } catch (err) {
      console.error('Failed to toggle completion', err);
      return null;
    }
  },

  saveNote: async (lessonId: string, content: string) => {
    try {
      await api.post('/progress/note', { lessonId, content });
      const current = get().currentLesson;
      if (current && current.id === lessonId) {
        set({ currentLesson: { ...current, note: content } });
      }
    } catch (err) {
      console.error('Failed to save note', err);
    }
  },

  addBookmark: async (lessonId: string, timestamp: number, title: string) => {
    try {
      const res = await api.post('/progress/bookmark', { lessonId, timestamp, title });
      const newBm = res.data.data.bookmark;
      const current = get().currentLesson;
      if (current && current.id === lessonId) {
        set({ currentLesson: { ...current, bookmarks: [...current.bookmarks, newBm] } });
      }
      return newBm;
    } catch (err) {
      console.error('Failed to add bookmark', err);
      return null;
    }
  },

  deleteBookmark: async (id: string) => {
    try {
      await api.delete(`/progress/bookmark/${id}`);
      const current = get().currentLesson;
      if (current) {
        set({
          currentLesson: {
            ...current,
            bookmarks: current.bookmarks.filter(b => b.id !== id)
          }
        });
      }
    } catch (err) {
      console.error('Failed to delete bookmark', err);
    }
  }
}));
