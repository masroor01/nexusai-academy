export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface TestCase {
  name: string;
  input?: string;
  expectedOutput?: string;
  hidden?: boolean;
}

export interface TestResult {
  name: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput?: string;
  error?: string;
  durationMs: number;
  hidden: boolean;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
  timedOut: boolean;
  securityViolation?: string;
  testResults?: TestResult[];
  allPassed?: boolean;
}

export interface Exercise {
  id: string;
  prompt: string;
  starterCode: string;
  testCases: TestCase[];
}

export interface Bookmark {
  id: string;
  lessonId: string;
  timestamp: number;
  title: string;
  createdAt: string;
}

export interface LessonSummary {
  id: string;
  title: string;
  orderIndex: number;
  hasExercise: boolean;
  isCompleted: boolean;
}

export interface ModuleSummary {
  id: string;
  title: string;
  orderIndex: number;
  lessons: LessonSummary[];
}

export interface LessonDetail {
  id: string;
  title: string;
  videoUrl: string;
  contentMarkdown: string;
  orderIndex: number;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
      slug: string;
      level: string;
    };
  };
  exercise: Exercise | null;
  isCompleted: boolean;
  note: string;
  bookmarks: Bookmark[];
}

export interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  thumbnail: string;
  moduleCount: number;
  lessonCount: number;
  totalLessons?: number;
  completedLessons: number;
  progressPercentage: number;
}

export interface CourseDetail extends CourseSummary {
  modules: ModuleSummary[];
}

export interface CertificateMetadata {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseLevel: string;
  courseSlug: string;
  issueDate: string;
  verificationHash: string;
  qrCodeUrl: string;
  verificationUrl: string;
}

export interface ProficiencyLevel {
  level: string;
  label: string;
  score: number;
  completed: number;
  total: number;
}

export interface StudentAnalytics {
  streak: number;
  totalCourses: number;
  completedCourses: number;
  completedLessons: number;
  totalLessons: number;
  totalCompletionPercentage: number;
  hoursSpent: number;
  proficiency: ProficiencyLevel[];
  recentActivity: {
    lessonId: string;
    lessonTitle: string;
    courseTitle: string;
    completed: boolean;
    updatedAt: string;
  }[];
}
